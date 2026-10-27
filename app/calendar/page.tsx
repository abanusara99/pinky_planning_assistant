"use client";

import { useEffect, useState } from "react";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";

export default function CalendarPage() {
    const [busyDates, setBusyDates] = useState<string[]>([]);

    useEffect(() => {
        fetch("/api/availability")
            .then((r) => r.json())
            .then((data) => {
                setBusyDates(
                    data.filter((a: any) => a.status === "busy").map((a: any) => a.date)
                );
            });
    }, []);

    async function toggle(date: string) {
        const isBusy = busyDates.includes(date);
        setBusyDates((prev) => (isBusy ? prev.filter((d) => d !== date) : [...prev, date]));
        await fetch("/api/availability", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date, status: isBusy ? "free" : "busy" }),
        });
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Booking Availability
            </h1>
            <AvailabilityCalendar busyDates={busyDates} onToggle={toggle} />
        </div>
    );
}