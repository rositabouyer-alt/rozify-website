# Website → CRM integration

The website sends events to your separate CRM from the **server only**.
The token never reaches the browser. If the CRM isn't configured or is
down, booking and chat keep working, and the error is just logged.

## Environment variables (server-side)

| Variable | Required | Example | Purpose |
|---|---|---|---|
| `CRM_API_URL` | yes, to turn it on | `https://crm.example.com` | Base URL of the CRM. Leave it empty to turn syncing off. |
| `WEBSITE_INGEST_TOKEN` | yes, to turn it on | (secret) | Sent as `Authorization: Bearer <token>` |
| `CRM_INGEST_PATH` | no | `/api/ingest/website` | Endpoint path. This is the default. |

- **Locally:** put these in `.env`. It's ignored by git.
- **On Lovable:** store them as project secrets.

## Endpoint the CRM must expose

```
POST {CRM_API_URL}{CRM_INGEST_PATH}
Authorization: Bearer <WEBSITE_INGEST_TOKEN>
Content-Type: application/json
X-Rozify-Event: booking.created | customer.created | customer.updated | chat.message
Idempotency-Key: <event_id>
```

- **Success:** return any 2xx.
- **Failures:** non-2xx responses and timeouts (5 s) are logged, not retried.
- **Duplicates:** use `event_id` to remove duplicates.

## Envelope

```json
{
  "event_id": "4f7c…uuid",
  "event_type": "booking.created",
  "schema_version": 1,
  "source": "rozify-website",
  "occurred_at": "2026-09-23T18:40:00.000Z",
  "data": { }
}
```

## Payloads (`data`)

### `booking.created`
This is sent right after `customer.created` for the same booking.
```json
{
  "booking_id": "BK-20260923-001", "customer_id": "CU-DEMO-0001",
  "customer_name": "Sara", "phone": "+989121234567",
  "service_id": "hair_color", "service_name": { "fa": "رنگ مو", "en": "Hair Color" },
  "price": 3500000, "currency": "IRR",
  "date": "2026-09-23", "time": "10:30", "duration_minutes": 120,
  "status": "confirmed", "notes": "optional", "language": "fa",
  "created_at": "2026-09-23T18:40:00.000Z"
}
```

### `customer.created` / `customer.updated`
```json
{ "customer_id": "CU-DEMO-0001", "name": "Sara", "phone": "+989121234567", "language": "fa", "notes": "optional" }
```
- `customer.created` is sent with every new booking.
- `customer.updated` is sent when `PATCH /api/bookings/:id` changes the name, phone or notes. Add `?lang=en|fa` to that request to set the language.

### `chat.message`
One event is sent for each question-and-answer exchange.
```json
{
  "conversation_id": "CV-M1ABC-XY12Z", "customer_id": null, "language": "en",
  "user_message": "How much is hair coloring?",
  "assistant_message": "Hair Color costs 3,500,000 Toman…",
  "ai_provider": "demo",
  "actions": [{ "type": "select_service", "service_id": "hair_color" }]
}
```

## Data flow

```text
Browser ── POST /api/bookings ──► server route ──► mock/real booking ──► crm.server.ts ──► CRM
Browser ── POST /api/chat ──────► server route ──► AI provider ────────► crm.server.ts ──► CRM
```

## Files

- `src/lib/crm/events.ts`: event types, the envelope builder and phone normalisation. It contains no secrets.
- `src/lib/crm/crm.server.ts`: the server-only sender, which reads the env vars on each request.
- `src/lib/crm/crm.test.ts`: tests that run against a mocked CRM.
- `src/routes/api/bookings.ts`, `src/routes/api/bookings.$id.ts` and `src/routes/api/chat.ts`: these send the events.
- `src/services/api/bookingApi.ts`: creating, updating and cancelling bookings now always goes through the server, so they can be synced.

## Connecting later

1. In the CRM, implement `POST /api/ingest/website`, or any path you set with `CRM_INGEST_PATH`. It must check the Bearer token and accept the envelope above.
2. Set `CRM_API_URL` and `WEBSITE_INGEST_TOKEN` to the same token the CRM expects.
3. Make a booking and send a chat message on the site, then check the CRM.

## Commands

```bash
bun install
cp .env.example .env   # fill CRM_API_URL + WEBSITE_INGEST_TOKEN
bun run dev            # http://localhost:8080
bun run test           # CRM integration tests (mocked CRM)
```
