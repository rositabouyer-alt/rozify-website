import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useServices } from "@/hooks/useServices";
import { bookingApi } from "@/services/api/bookingApi";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";
import { ApiError, type Booking, type Service } from "@/types";
import {
  formatDate,
  formatDuration,
  formatPrice,
  formatTime,
  isValidPhone,
  toIsoDate,
} from "@/utils/format";

const DAYS_AHEAD = 14;

export function BookingFlow({ initialServiceId }: { initialServiceId?: string }) {
  const { t, language } = useLanguage();
  const { services, categories } = useServices();

  const [step, setStep] = useState(initialServiceId ? 1 : 0);
  const [serviceId, setServiceId] = useState(initialServiceId ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  const service: Service | undefined = services.find((item) => item.service_id === serviceId);

  const dates = useMemo(() => {
    const today = new Date();

    return Array.from({ length: DAYS_AHEAD }, (_, index) => {
      const day = new Date(today);
      day.setHours(12, 0, 0, 0);
      day.setDate(today.getDate() + index);
      return toIsoDate(day);
    });
  }, []);

  const availability = useQuery({
    queryKey: ["availability", serviceId, date],
    queryFn: () => bookingApi.getAvailability(serviceId, date),
    enabled: Boolean(serviceId && date),
  });

  const create = useMutation({
    mutationFn: () =>
      bookingApi.createBooking({
        service_id: serviceId,
        customer_name: name.trim(),
        phone: phone.trim(),
        date,
        time,
        notes: notes.trim() || undefined,
        language,
      }),

    onSuccess: (result) => {
      setBooking(result);
      setStep(3);
      setFormError(null);
    },

    onError: (error) => {
      const code = error instanceof ApiError ? error.code : "unknown";
      setFormError(t.errors[code] ?? t.errors.unknown);
    },
  });

  const reset = () => {
    setBooking(null);
    setStep(0);
    setServiceId("");
    setDate("");
    setTime("");
    setName("");
    setPhone("");
    setNotes("");
    setFormError(null);
    create.reset();
  };

  const submit = () => {
    if (!name.trim()) {
      setFormError(t.errors.requiredName);
      return;
    }

    if (!isValidPhone(phone)) {
      setFormError(t.errors.invalid_phone);
      return;
    }

    if (!serviceId || !date || !time) {
      setFormError(t.errors.unknown);
      return;
    }

    setFormError(null);
    create.mutate();
  };

  const slots = availability.data?.slots ?? [];

  return (
    <div>
      {" "}
      <ol className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {t.booking.steps.map((label, index) => (
          <li
            key={label}
            className={cn(
              "flex items-center gap-2",
              index === step ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs",
                index <= step
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border",
              )}
            >
              {index + 1}{" "}
            </span>
            {label}{" "}
          </li>
        ))}{" "}
      </ol>
      <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
        {step === 0 && (
          <div>
            <h3 className="text-2xl">{t.booking.chooseService}</h3>

            <div className="mt-6 space-y-8">
              {categories.map((category) => {
                const items = services.filter((item) => item.category === category.category_id);

                if (items.length === 0) {
                  return null;
                }

                return (
                  <div key={category.category_id}>
                    <p className="eyebrow">{category.name[language]}</p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {items.map((item) => (
                        <button
                          key={item.service_id}
                          type="button"
                          onClick={() => {
                            setServiceId(item.service_id);
                            setDate("");
                            setTime("");
                            setFormError(null);
                            setStep(1);
                          }}
                          className={cn(
                            "rounded-2xl border p-4 text-start transition-colors",
                            serviceId === item.service_id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50",
                          )}
                        >
                          <span className="block text-base">{item.name[language]}</span>

                          <span className="mt-1 block text-xs text-muted-foreground">
                            {formatDuration(item.duration_minutes, language)} ·{" "}
                            {formatPrice(item.price, language)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="text-2xl">{t.booking.chooseDate}</h3>

            <div className="mt-5 flex flex-wrap gap-2">
              {dates.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setDate(value);
                    setTime("");
                    setFormError(null);
                  }}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    date === value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {formatDate(value, language)}
                </button>
              ))}
            </div>

            {date && (
              <div className="mt-8">
                <h4 className="text-lg">{t.booking.chooseTime}</h4>

                {availability.isLoading ? (
                  <p className="mt-3 text-sm text-muted-foreground">{t.booking.loadingSlots}</p>
                ) : availability.isError ? (
                  <p className="mt-3 text-sm text-destructive">{t.errors.unknown}</p>
                ) : slots.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">{t.booking.noSlots}</p>
                ) : (
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {slots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => {
                          setTime(slot.time);
                          setFormError(null);
                        }}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-sm transition-colors",
                          !slot.available && "cursor-not-allowed opacity-40",
                          time === slot.time
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        {formatTime(slot.time, language)}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStep(0);
                      setDate("");
                      setTime("");
                      setFormError(null);
                    }}
                  >
                    {t.common.back}
                  </Button>

                  <Button
                    type="button"
                    disabled={!time}
                    onClick={() => {
                      setFormError(null);
                      setStep(2);
                    }}
                  >
                    {t.common.next}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-2xl">{t.booking.yourDetails}</h3>

            <div className="mt-6 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm">{t.booking.name}</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                  autoComplete="name"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm">{t.booking.phone}</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm">{t.booking.notes}</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="min-h-28 rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              </label>

              {formError && <p className="text-sm text-destructive">{formError}</p>}

              <div className="rounded-2xl border border-border p-4 text-sm">
                <p>
                  {service?.name[language]} · {formatDate(date, language)} ·{" "}
                  {formatTime(time, language)}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={create.isPending}
                  onClick={() => {
                    setStep(1);
                    setFormError(null);
                  }}
                >
                  {t.common.back}
                </Button>

                <Button type="button" disabled={create.isPending} onClick={submit}>
                  {create.isPending ? t.booking.submitting : t.booking.submit}
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && booking && (
          <div>
            <h3 className="text-2xl">{t.booking.successTitle}</h3>

            <div className="mt-6 rounded-2xl border border-border p-5">
              <p className="text-sm text-muted-foreground">{t.booking.successBody}</p>

              <p className="mt-2 font-medium">{booking.booking_id}</p>

              <p className="mt-3">
                {service?.name[language]} · {formatDate(booking.date, language)} ·{" "}
                {formatTime(booking.time, language)}
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                {booking.customer_name} · {booking.phone}
              </p>
            </div>

            <div className="mt-6">
              <Button type="button" onClick={reset}>
                {t.booking.newBooking}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
