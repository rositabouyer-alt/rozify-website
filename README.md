# ROZIFY AI — Smart Beauty Salon (Demo)

A bilingual (Persian / English) website for a women's beauty salon, with a
service catalogue, appointment booking and a floating AI beauty assistant.
This build runs fully in **demo mode**: no real backend, no real bookings.

## Features

- **Bilingual UI** — Persian (RTL) and English (LTR). The switcher in the header
  flips direction, typography and every label. The choice is stored locally.
- **Service catalogue** — 20 services in 5 categories with price (Toman),
  duration and description, filterable by category.
- **Booking flow** — service → date → available time → your details →
  confirmation, driven by the availability and booking APIs.
- **ROZIFY AI assistant** — floating chat window answering questions on
  services, prices, durations, hours and policies, with quick actions that jump
  into the booking flow.
- **Gallery** — salon and treatment photography.
- **Contact** — address, hours, phone, email, policies and FAQ.

## Design system

Defined once in `src/styles.css` as semantic tokens:

| Token | Colour |
| --- | --- |
| Primary | `#818263` Savory Sage |
| Secondary | `#C2C395` Avocado Smoothie |
| Accent | `#DDBAAE` Blush Beet |
| Soft accent | `#EFD7CF` Peach Protein |
| Background | `#DCD4C1` Oat Latte |
| Text | `#2F3028` |

Typography: Cormorant Garamond (display), Jost (Latin body), Vazirmatn (Persian).

## Getting started

```bash
bun install
bun run dev      # http://localhost:8080
bun run build
```

Copy `.env.example` to `.env` to change demo mode or the AI provider.

## Project structure

```
src/
  routes/            pages (/, /services, /gallery, /booking, /contact)
  routes/api/        server endpoints: chat, availability, bookings
  data/              services, gallery, FAQ — single source of truth
  config/business.ts business info, hours, policies, demo flag
  i18n/              translations + language provider (RTL/LTR)
  services/api/      typed API clients (mock in demo mode)
  services/mock/     mock backend: availability, bookings
  lib/ai/            knowledge context + server-side AI providers
  components/        layout, services, gallery, booking, chat, UI primitives
```

## API endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/chat` | AI assistant replies (provider chosen server-side) |
| GET | `/api/availability?service_id=&date=` | Free time slots for a day |
| POST | `/api/bookings` | Create a booking |
| GET/PATCH/DELETE | `/api/bookings/:id` | Read, update or cancel a booking |

## AI providers

The browser never talks to an AI provider. `/api/chat` resolves the provider
from `AI_PROVIDER` (`demo`, `ollama`, `gapgpt`) on the server and falls back to
the built-in rule-based demo assistant if the provider is unavailable. API keys
stay in server-side environment variables.

Answers are grounded in a knowledge context built from the same service, FAQ
and business data the website renders, so prices can never drift.

## Connecting a real backend / CRM

1. Set `VITE_DEMO_MODE=false` and `VITE_API_BASE_URL=https://your-api`.
2. `src/services/api/*` then calls the real endpoints instead of the mock
   backend — no component changes needed.
3. The types in `src/types/index.ts` (Service, Booking, Customer, TimeSlot)
   define the contract your backend should return.

## Demo limitations

- Bookings are created in memory and disappear on reload.
- Contact details, address and phone number are placeholders.

## CRM integration

Bookings, customer details and chat messages are forwarded server-side to an external CRM when `CRM_API_URL` and `WEBSITE_INGEST_TOKEN` are set. See [docs/CRM_INTEGRATION.md](docs/CRM_INTEGRATION.md). Run tests with `bun run test`.
