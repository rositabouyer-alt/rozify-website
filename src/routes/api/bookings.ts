import { createFileRoute } from "@tanstack/react-router";

import {
  createCrmBooking,
  findOrCreateCrmCustomer,
  findCrmServiceId,
} from "@/lib/crm/crm-api.server";

export const Route = createFileRoute("/api/bookings")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          console.log("BOOKING REQUEST:", body);

          const {
            customer_name,
            phone,
            service_id,
            date,
            time,
            notes,
          } = body;

          if (
            !customer_name ||
            !phone ||
            !service_id ||
            !date ||
            !time
          ) {
            return Response.json(
              {
                error: "Missing fields",
              },
              {
                status: 400,
              }
            );
          }

          const crmServiceId = await findCrmServiceId(service_id);

          if (!crmServiceId) {
            return Response.json(
              {
                error: "Service not found",
                service_id,
              },
              {
                status: 404,
              }
            );
          }

          const customer = await findOrCreateCrmCustomer({
            customer_name,
            phone,
          });

          const booking = await createCrmBooking({
            customer_id: customer.id,
            service_id: crmServiceId,
            date,
            time,
            notes,
          });

          return Response.json({
            success: true,
            booking,
          });
        } catch (error) {
          console.error("BOOKING ERROR:", error);

          const message =
            error instanceof Error
              ? error.message
              : String(error);

          return Response.json(
            {
              error: "Booking failed",
              details: message,
            },
            {
              status: 500,
            }
          );
        }
      },
    },
  },
});