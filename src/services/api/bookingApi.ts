import type { Availability, Booking, BookingRequest } from "@/types";

import { apiRequest } from "./http";

export const bookingApi = {
  async getAvailability(serviceId: string, date: string): Promise<Availability> {
    return apiRequest<Availability>(
      `/api/availability?service_id=${encodeURIComponent(
        serviceId,
      )}&date=${encodeURIComponent(date)}`,
      {
        method: "GET",
      },
    );
  },

  async createBooking(request: BookingRequest): Promise<Booking> {
    return apiRequest<Booking>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  async updateBooking(bookingId: string, patch: Partial<Booking>): Promise<Booking> {
    return apiRequest<Booking>(`/api/bookings/${encodeURIComponent(bookingId)}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  },

  async cancelBooking(bookingId: string): Promise<Booking> {
    return apiRequest<Booking>(`/api/bookings/${encodeURIComponent(bookingId)}`, {
      method: "DELETE",
    });
  },
};
