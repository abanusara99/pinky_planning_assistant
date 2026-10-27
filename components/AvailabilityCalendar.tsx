"use client";

import { useMemo, useState } from "react";

interface DayCell {
    date: Date;
    key: string;
    isWednesday: boolean;
    status: "busy" | "free";
}

interface Props {
    busyDates: string[];
    onToggle: (date: string) => void;
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

    const { monthLabel, cells } = useMemo(() => {
        const now = new Date();
        const ref = new Date(now.getFullYear(), now.getMonth() + offset, 1);
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
    }, [offset, busyDates]);

    function colorClass(cell: DayCell) {
        if (cell.isWednesday) return "bg-red-500 text-white cursor-not-allowed";
        if (cell.status === "busy") return "bg-pinky-400 text-white cursor-pointer";
        return "bg-green-500 text-white cursor-pointer";
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
                        {monthLabel}
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
                    <div key={d} className="text-center text-[10px] font-semibold text-gray-500 py-1">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {cells.map((cell, i) => {
                    if (!cell) return <div key={`empty-${i}`} />;
                    return (
                        <button
                            key={cell.key}
                            disabled={cell.isWednesday}
                            onClick={() => !cell.isWednesday && onToggle(cell.key)}
                            className={`aspect-square rounded-lg text-xs font-semibold flex items-center justify-center transition ${colorClass(cell)}`}
                            title={
                                cell.isWednesday
                                    ? "Closed on Wednesdays"
                                    : cell.status === "busy"
                                        ? "Busy — click to free"
                                        : "Free — click to mark busy"
                            }
                        >
                            {cell.date.getDate()}
                        </button>
                    );
                })}
            </div>

            <div className="flex flex-wrap gap-3 mt-3 text-[11px] text-gray-600">
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-pinky-400" /> Busy
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-green-500" /> Free / Booking available
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-red-500" /> Closed (Wed)
                </span>
            </div>
        </div>
    );
}