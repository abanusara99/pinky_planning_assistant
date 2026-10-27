"use client";

import { useEffect, useMemo, useState } from "react";

interface DayCell {
    date: Date;
    key: string;
    isWednesday: boolean;
    status: "busy" | "free";
}

interface Props {
    busyDates: string[];
    /** Optional. If provided, clicks toggle busy/free (admin mode). If omitted, clicks navigate to /chat. */
    onToggle?: (date: string) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fmt(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export default function AvailabilityCalendar({ busyDates, onToggle }: Props) {
    const [offset, setOffset] = useState(0);
    // Base year/month as a stable placeholder; real value set after mount.
    const [base, setBase] = useState<{ year: number; month: number } | null>(null);
    const [tooltip, setTooltip] = useState<string | null>(null);

    useEffect(() => {
        const now = new Date();
        setBase({ year: now.getFullYear(), month: now.getMonth() });
    }, []);

    const { monthLabel, cells } = useMemo(() => {
        if (!base) return { monthLabel: "", cells: [] as (DayCell | null)[] };

        const ref = new Date(base.year, base.month + offset, 1);
        const year = ref.getFullYear();
        const month = ref.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const list: (DayCell | null)[] = [];
        for (let i = 0; i < firstDay; i++) list.push(null);
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const key = fmt(date);
            list.push({
                date,
                key,
                isWednesday: date.getDay() === 3,
                status: busyDates.includes(key) ? "busy" : "free",
            });
        }

        return {
            monthLabel: ref.toLocaleString("en-US", { month: "long", year: "numeric" }),
            cells: list,
        };
    }, [base, offset, busyDates]);

    const isAdmin = typeof onToggle === "function";

    function colorClass(cell: DayCell) {
        if (cell.isWednesday) return "bg-red-500 text-white cursor-pointer";
        if (cell.status === "busy") return "bg-pinky-400 text-white cursor-pointer";
        return "bg-green-500 text-white cursor-pointer";
    }

    function tooltipFor(cell: DayCell) {
        if (cell.isWednesday) return "Company holiday — closed";
        if (cell.status === "busy")
            return isAdmin ? "Busy — click to free" : "Busy day — already booked";
        return isAdmin ? "Free — click to mark busy" : "Free — booking available";
    }

    function handleClick(cell: DayCell) {
        if (isAdmin) {
            // Admin mode: Wednesdays are locked, others toggle.
            if (cell.isWednesday) return;
            onToggle!(cell.key);
            return;
        }
        // User mode: hard navigation so it reliably works on Vercel.
        if (cell.isWednesday) {
            window.location.href = `/chat?date=${cell.key}&closed=1`;
        } else if (cell.status === "busy") {
            window.location.href = `/chat?date=${cell.key}&busy=1`;
        } else {
            window.location.href = `/chat?date=${cell.key}`;
        }
    }

    return (
        <div className="bg-white border border-pinky-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-800">Availability Calendar</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setOffset((o) => o - 1)}
                        className="px-2 py-1 text-xs border border-pinky-200 rounded-lg hover:bg-pinky-50"
                        aria-label="Previous month"
                    >
                        ‹
                    </button>
                    <span className="text-xs text-gray-600 min-w-27.5 text-center">
                        {monthLabel || "Loading…"}
                    </span>
                    <button
                        onClick={() => setOffset((o) => o + 1)}
                        className="px-2 py-1 text-xs border border-pinky-200 rounded-lg hover:bg-pinky-50"
                        aria-label="Next month"
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map((d) => (
                    <div
                        key={d}
                        className="text-center text-[10px] font-semibold text-gray-500 py-1"
                    >
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {cells.length === 0
                    ? Array.from({ length: 35 }).map((_, i) => (
                        <div key={`ph-${i}`} className="aspect-square rounded-lg bg-gray-50" />
                    ))
                    : cells.map((cell, i) => {
                        if (!cell) return <div key={`empty-${i}`} />;
                        return (
                            <div key={cell.key} className="relative">
                                <button
                                    onClick={() => handleClick(cell)}
                                    onMouseEnter={() =>
                                        setTooltip(`${cell.key}|${tooltipFor(cell)}`)
                                    }
                                    onMouseLeave={() => setTooltip(null)}
                                    disabled={isAdmin && cell.isWednesday}
                                    className={`w-full aspect-square rounded-lg text-xs font-semibold flex items-center justify-center transition ${colorClass(cell)}`}
                                    aria-label={tooltipFor(cell)}
                                >
                                    {cell.date.getDate()}
                                </button>
                                {tooltip?.startsWith(cell.key + "|") && (
                                    <div className="absolute z-20 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-[10px] px-2 py-1 rounded-md shadow-lg pointer-events-none">
                                        {tooltip.split("|")[1]}
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>

            <div className="flex flex-wrap gap-3 mt-3 text-[11px] text-gray-600">
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-green-500" /> Free / Booking available
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-pinky-400" /> Busy / Booked
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-red-500" /> Company holiday (Wed)
                </span>
            </div>
        </div>
    );
}