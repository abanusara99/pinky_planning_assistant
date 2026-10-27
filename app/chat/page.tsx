"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { PlanType } from "@/lib/types";

type Step = "greeting" | "details" | "dateTime" | "payment" | "done";

const plans: { type: PlanType; label: string; price: number; nameLabel: string }[] = [
    { type: "wedding", label: "Wedding", price: 220, nameLabel: "Couple name" },
    { type: "birthday", label: "Birthday", price: 170, nameLabel: "Special person name" },
    { type: "community", label: "Community Event", price: 500, nameLabel: "Event name" },
    { type: "big", label: "Big Event (out of house)", price: 1000, nameLabel: "Event name" },
];

function ChatPageInner() {
    const params = useSearchParams();
    const presetDate = params.get("date") || "";
    const closed = params.get("closed") === "1";
    const busy = params.get("busy") === "1";

    const [step, setStep] = useState<Step>("greeting");
    const [greeting, setGreeting] = useState("Hello, how can I help you?");
    const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[0] | null>(null);
    const [mainName, setMainName] = useState("");
    const [preferences, setPreferences] = useState("");
    const [eventDate, setEventDate] = useState(presetDate);
    const [eventTime, setEventTime] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [popup, setPopup] = useState(false);
    const [paidMessage, setPaidMessage] = useState("");
    const [serverError, setServerError] = useState("");

    useEffect(() => {
        const hour = new Date().getHours();
        const part =
            hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night";
        setGreeting(`Good ${part}, how can I help you?`);
    }, []);

    function confirmPlan(plan: (typeof plans)[0]) {
        setSelectedPlan(plan);
        setPopup(true);
    }

    async function submitBooking() {
        if (!selectedPlan || !eventDate || !eventTime) return;
        setSubmitting(true);
        setServerError("");
        try {
            const res = await fetch("/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan_type: selectedPlan.type,
                    plan_price: selectedPlan.price,
                    event_date: eventDate,
                    event_time: eventTime,
                    main_name: mainName,
                    preferences,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setServerError(data.error || "Booking failed");
                return;
            }
            setStep("payment");
        } finally {
            setSubmitting(false);
        }
    }

    async function handlePayment(paid: boolean) {
        setSubmitting(true);
        try {
            await fetch("/api/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date: eventDate,
                    status: paid ? "busy" : "free",
                }),
            });
            setPaidMessage(
                paid
                    ? "Thank you for your payment! Your date is now marked as booked (pink) in the calendar."
                    : "No worries! Your date stays available (green). You can pay later from your email link."
            );
            setStep("done");
        } finally {
            setSubmitting(false);
        }
    }

    if (closed) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-10">
                <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm text-center space-y-3">
                    <h2 className="text-lg font-semibold text-red-600">Company Holiday</h2>
                    <p className="text-sm text-gray-700">
                        Wednesdays are company holidays. Please pick another day from the calendar.
                    </p>
                    <a
                        href="/calendar"
                        className="inline-block px-6 py-2 bg-pinky-400 hover:bg-pinky-500 text-white rounded-xl shadow-md"
                    >
                        Back to Calendar
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <div className="bg-white border border-pinky-200 rounded-2xl shadow-sm p-6 space-y-5">
                {busy && (
                    <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-xs rounded-xl px-3 py-2">
                        The date <b>{presetDate}</b> is already booked. You can still choose a
                        different date below.
                    </div>
                )}

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

                {popup && step === "greeting" && (
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
                                    setStep("details");
                                }}
                                className="px-6 py-2 bg-pinky-400 hover:bg-pinky-500 text-white rounded-xl shadow-md"
                            >
                                Add Details
                            </button>
                        </div>
                    </div>
                )}

                {step === "details" && selectedPlan && (
                    <>
                        <Bubble role="ai">
                            Please share a few details for your {selectedPlan.label}:
                        </Bubble>
                        <div className="space-y-3">
                            <label className="block text-xs text-gray-500">
                                {selectedPlan.nameLabel}
                            </label>
                            <input
                                value={mainName}
                                onChange={(e) => setMainName(e.target.value)}
                                placeholder={selectedPlan.nameLabel}
                                className="w-full px-3 py-2 border border-pinky-200 rounded-xl text-sm"
                            />
                            <label className="block text-xs text-gray-500">
                                Preferences (theme, colors, must-haves…)
                            </label>
                            <textarea
                                value={preferences}
                                onChange={(e) => setPreferences(e.target.value)}
                                rows={3}
                                placeholder="Tell us what you love…"
                                className="w-full px-3 py-2 border border-pinky-200 rounded-xl text-sm resize-none"
                            />
                            <button
                                onClick={() => setStep("dateTime")}
                                disabled={!mainName.trim()}
                                className="w-full py-3 bg-pinky-400 hover:bg-pinky-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md"
                            >
                                Continue to Date & Time
                            </button>
                        </div>
                    </>
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
                            {serverError && <p className="text-xs text-red-600">{serverError}</p>}
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

                {step === "payment" && (
                    <>
                        <Bubble role="ai">
                            Thank you! We sent the payment link to your email. Have you completed the
                            payment?
                        </Bubble>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => handlePayment(true)}
                                disabled={submitting}
                                className="flex-1 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md"
                            >
                                Yes, I paid
                            </button>
                            <button
                                onClick={() => handlePayment(false)}
                                disabled={submitting}
                                className="flex-1 py-3 bg-gray-400 hover:bg-gray-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md"
                            >
                                No, not yet
                            </button>
                        </div>
                    </>
                )}

                {step === "done" && (
                    <>
                        <Bubble role="ai">{paidMessage}</Bubble>
                        <p className="text-xs text-gray-400 text-center pt-4">
                            Thank you for visiting Pinky Planning Assistant.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-10 text-sm text-gray-500">Loading…</div>}>
            <ChatPageInner />
        </Suspense>
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