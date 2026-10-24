import { BUSINESS } from "@/config/business";
import { getServiceById } from "@/data/services";
import type { Availability, Booking, BookingRequest, TimeSlot } from "@/types";
import { ApiError } from "@/types";
import { isValidPhone, toEnDigits } from "@/utils/format";

/**
 * Deterministic in-memory mock of the future backend.
 * Response shapes are identical to what the real API must return.
 */

const bookings = new Map<string, Booking>();
let sequence = 0;

const SLOT_STEP_MINUTES = 30;

const hash = (input: string): number => {
  let value = 0;
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) % 100000;
  }
  return value;
};

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
};

const toTime = (minutes: number): string =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export const isOpenOn = (isoDate: string): boolean => {
  const day = new Date(`${isoDate}T00:00:00`).getDay();
  return (BUSINESS.openDays as readonly number[]).includes(day);
};

export function buildAvailability(serviceId: string, date: string): Availability {
  const service = getServiceById(serviceId);
  if (!service) throw new ApiError("not_found");
  if (!isOpenOn(date)) return { date, service_id: serviceId, slots: [] };

  const open = toMinutes(BUSINESS.workingHours.open);
  const close = toMinutes(BUSINESS.workingHours.close);
  const slots: TimeSlot[] = [];

  for (let minute = open; minute + service.duration_minutes <= close; minute += SLOT_STEP_MINUTES) {
    const time = toTime(minute);
    const taken = [...bookings.values()].some(
      (booking) =>
        booking.date === date &&
        booking.time === time &&
        (booking.status === "pending" || booking.status === "confirmed"),
    );
    // Pseudo-random but stable "already booked" pattern so the UI must handle gaps.
    const busy = hash(`${date}-${time}-${serviceId}`) % 10 < 3;
    slots.push({ time, available: !taken && !busy });
  }

  return { date, service_id: serviceId, slots };
}

export function createMockBooking(request: BookingRequest): Booking {
  const service = getServiceById(request.service_id);
  if (!service || !request.date || !request.time || !request.customer_name.trim()) {
    throw new ApiError("invalid_booking");
  }
  if (!isValidPhone(request.phone)) throw new ApiError("invalid_phone");

  const availability = buildAvailability(request.service_id, request.date);
  const slot = availability.slots.find((item) => item.time === request.time);
  if (!slot || !slot.available) throw new ApiError("slot_unavailable");

  sequence += 1;
  const compactDate = request.date.replaceAll("-", "");
  const booking: Booking = {
    booking_id: `BK-${compactDate}-${String(sequence).padStart(3, "0")}`,
    customer_id: request.customer_id ?? `CU-DEMO-${String(sequence).padStart(4, "0")}`,
    service_id: request.service_id,
    customer_name: request.customer_name.trim(),
    phone: toEnDigits(request.phone).replace(/[\s()-]/g, ""),
    date: request.date,
    time: request.time,
    duration_minutes: service.duration_minutes,
    status: "confirmed",
    created_at: new Date().toISOString(),
    notes: request.notes?.trim() || undefined,
  };

  bookings.set(booking.booking_id, booking);
  return booking;
}

export function getMockBooking(bookingId: string): Booking {
  const booking = bookings.get(bookingId);
  if (!booking) throw new ApiError("not_found");
  return booking;
}

export function updateMockBooking(bookingId: string, patch: Partial<Booking>): Booking {
  const booking = getMockBooking(bookingId);
  const updated = { ...booking, ...patch, booking_id: booking.booking_id };
  bookings.set(bookingId, updated);
  return updated;
}

export function cancelMockBooking(bookingId: string): Booking {
  return updateMockBooking(bookingId, { status: "cancelled" });
}
