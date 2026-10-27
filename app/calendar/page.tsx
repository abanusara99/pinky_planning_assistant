"use client";

import { useEffect, useState } from "react";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";

export default function CalendarPage() {
    const [busyDates, setBusyDates] = useState<string[]>([]);

    useEffect(() => {
        fetch("/api/availability")
            .then((r) => r.text())
            .then((text) => (text.trim() ? JSON.parse(text) : []))
            .then((data) =>
                setBusyDates(
                    data
                        .filter((a: { status: string }) => a.status === "busy")
                        .map((a: { date: string }) => a.date)
                )
            )
            .catch(() => setBusyDates([]));
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Booking Availability
            </h1>
            <p className="text-xs text-gray-500 text-center mb-4">
                Tap or hover a day for details. Click a green day to open the booking form.
                Pink days are already booked. Wednesdays are company holidays.
            </p>
            {/* No onToggle — this is user mode. Clicking never changes local state. */}
            <AvailabilityCalendar busyDates={busyDates} />
        </div>
    );
}