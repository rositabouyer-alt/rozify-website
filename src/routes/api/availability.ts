import { createFileRoute } from "@tanstack/react-router";
import { getCrmAvailability, findCrmServiceId } from "@/lib/crm/crm-api.server";

export const Route = createFileRoute("/api/availability")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);

          const serviceId = url.searchParams.get("service_id");
          const date = url.searchParams.get("date");

          if (!serviceId || !date) {
            return Response.json(
              { error: "Missing params" },
              { status: 400 }
            );
          }

          const crmServiceId = await findCrmServiceId(serviceId);

          if (!crmServiceId) {
            return Response.json({
              items: []
            });
          }

          const result = await getCrmAvailability(
            Number(crmServiceId),
            date
          );

          return Response.json(result);

        } catch (error) {
          console.error("AVAILABILITY ROUTE ERROR:", error);

          return Response.json(
            {
              items: []
            },
            {
              status: 500
            }
          );
        }
      }
    }
  }
});
