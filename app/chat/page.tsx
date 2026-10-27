"use client";
import { useState, useEffect } from "react";

import type { PlanType } from "@/lib/types";

type Step = "greeting" | "confirmPlan" | "dateTime" | "success";

const plans: { type: PlanType; label: string; price: number }[] = [
    { type: "wedding", label: "Wedding", price: 220 },
    { type: "birthday", label: "Birthday", price: 170 },
    { type: "community", label: "Community Event", price: 500 },
    { type: "big", label: "Big Event (out of house)", price: 1000 },
];

export default function ChatPage() {
    const [step, setStep] = useState<Step>("greeting");
    const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[0] | null>(null);
    const [eventDate, setEventDate] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [popup, setPopup] = useState(false);

    const [greeting, setGreeting] = useState("Hello, how can I help you?");

    useEffect(() => {
        const hour = new Date().getHours();
        const part =
            hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night";
        setGreeting(`Good ${part}, how can I help you?`);
    }, []);

    function confirmPlan(plan: (typeof plans)[0]) {
        setSelectedPlan(plan);
        setStep("confirmPlan");
        setPopup(true);
    }

    async function submitBooking() {
        if (!selectedPlan || !eventDate || !eventTime) return;
        setSubmitting(true);
        try {
            await fetch("/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan_type: selectedPlan.type,
                    plan_price: selectedPlan.price,
                    event_date: eventDate,
                    event_time: eventTime,
                }),
            });
            setStep("success");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <div className="bg-white border border-pinky-200 rounded-2xl shadow-sm p-6 space-y-5">
                {step === "greeting" && (
                    <>
                        <Bubble role="ai">{greeting}</Bubble>
                        <Bubble role="user">I want to book a plan for my event.</Bubble>
                        <Bubble role="ai">Choose your plan:</Bubble>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {plans.map((p) => (
                                <button
                                    key={p.type}
                                    onClick={() => confirmPlan(p)}
                                    className="px-4 py-3 bg-pinky-100 hover:bg-pinky-200 border border-pinky-300 rounded-xl text-sm font-medium text-gray-800 shadow-sm hover:shadow-md transition"
                                >
                                    {p.label} — ${p.price}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {popup && step === "confirmPlan" && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
                            <p className="text-lg font-semibold text-gray-800 mb-2">
                                Great! Your plan is confirmed.
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                                {selectedPlan?.label} — ${selectedPlan?.price}
                            </p>
                            <button
                                onClick={() => {
                                    setPopup(false);
                                    setStep("dateTime");
                                }}
                                className="px-6 py-2 bg-pinky-400 hover:bg-pinky-500 text-white rounded-xl shadow-md"
                            >
                                Continue to Date & Time
                            </button>
                        </div>
                    </div>
                )}

                {step === "dateTime" && (
                    <>
                        <Bubble role="ai">Please add your event date and time:</Bubble>
                        <div className="space-y-3">
                            <input
                                type="date"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                className="w-full px-3 py-2 border border-pinky-200 rounded-xl text-sm"
                            />
                            <input
                                type="time"
                                value={eventTime}
                                onChange={(e) => setEventTime(e.target.value)}
                                className="w-full px-3 py-2 border border-pinky-200 rounded-xl text-sm"
                            />
                            <button
                                onClick={submitBooking}
                                disabled={!eventDate || !eventTime || submitting}
                                className="w-full py-3 bg-pinky-400 hover:bg-pinky-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md"
                            >
                                {submitting ? "Processing…" : "Confirm Booking"}
                            </button>
                        </div>
                    </>
                )}

                {step === "success" && (
                    <>
                        <Bubble role="ai">
                            Thank you! We sent the link to your email. Please check for payment
                            instructions. Thank you for visiting!
                        </Bubble>
                        <p className="text-xs text-gray-400 text-center pt-4">
                            (For demo: booking saved to Supabase. In production, integrate email
                            delivery.)
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

function Bubble({ role, children }: { role: "ai" | "user"; children: React.ReactNode }) {
    return (
        <div
            className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${role === "user"
                ? "bg-pinky-200 text-gray-800 ml-auto rounded-br-sm"
                : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
        >
            {children}
        </div>
    );
}