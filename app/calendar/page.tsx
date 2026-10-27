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

    async function toggle(date: string) {
        const isBusy = busyDates.includes(date);
        setBusyDates((prev) =>
            isBusy ? prev.filter((d) => d !== date) : [...prev, date]
        );
        try {
            await fetch("/api/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date, status: isBusy ? "free" : "busy" }),
            });
        } catch {
            // revert on failure
            setBusyDates((prev) =>
                isBusy ? [...prev, date] : prev.filter((d) => d !== date)
            );
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Booking Availability
            </h1>
            <p className="text-xs text-gray-500 text-center mb-4">
                Hover a day for details. Click a green or pink day to toggle booking
                availability. Wednesdays are company holidays.
            </p>
            <AvailabilityCalendar busyDates={busyDates} onToggle={toggle} />
        </div>
    );
}