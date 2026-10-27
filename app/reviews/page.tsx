"use client";

import { useEffect, useState } from "react";
import type { Review } from "@/lib/types";

function Avatar({ name, imageUrl }: { name: string; imageUrl: string | null }) {
  const [failed, setFailed] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const isValidUrl = !!imageUrl && /^https?:\/\//i.test(imageUrl) && !failed;

  const hue = (name.charCodeAt(0) * 47) % 360;
  const bg = `hsl(${hue}, 70%, 88%)`;
  const fg = `hsl(${hue}, 45%, 35%)`;

  if (isValidUrl) {
    return (
      <img
        src={imageUrl!}
        alt={name}
        className="w-12 h-12 rounded-full bg-pinky-100 shrink-0 object-cover"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-semibold text-lg select-none"
      style={{ backgroundColor: bg, color: fg }}
      aria-label={name}
    >
      {initial}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.text())
      .then((text) => (text.trim() ? JSON.parse(text) : []))
      .then(setReviews)
      .catch(() => setReviews([]));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !username || !review) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          image_url: imageUrl.trim() || null,
          review,
        }),
      });
      const newReview = await res.json();
      setReviews((prev) => [newReview, ...prev]);
      setName("");
      setUsername("");
      setImageUrl("");
      setReview("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">Reviews</h1>

      {/* FORM FIRST */}
      <form
        onSubmit={submit}
        className="bg-white border border-pinky-200 rounded-2xl p-6 shadow-sm space-y-3 mb-10"
      >
        <h2 className="font-semibold text-gray-800">Leave a Review</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="reviewer-name" className="block text-xs text-gray-500 mb-1">
              Your name
            </label>
            <input
              id="reviewer-name"
              name="reviewer-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full px-3 py-2 border border-pinky-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label htmlFor="reviewer-username" className="block text-xs text-gray-500 mb-1">
              Username
            </label>
            <input
              id="reviewer-username"
              name="reviewer-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@username"
              required
              className="w-full px-3 py-2 border border-pinky-200 rounded-xl text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="reviewer-image-url" className="block text-xs text-gray-500 mb-1">
            Image URL (optional)
          </label>
          <input
            id="reviewer-image-url"
            name="reviewer-image-url"
            type="url"
            autoComplete="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL (optional — leave blank for auto avatar)"
            className="w-full px-3 py-2 border border-pinky-200 rounded-xl text-sm"
          />
        </div>

        <div>
          <label htmlFor="reviewer-feedback" className="block text-xs text-gray-500 mb-1">
            Your review
          </label>
          <textarea
            id="reviewer-feedback"
            name="reviewer-feedback"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Your review…"
            required
            rows={3}
            className="w-full px-3 py-2 border border-pinky-200 rounded-xl text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-pinky-400 hover:bg-pinky-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md"
        >
          {submitting ? "Submitting…" : "Submit Review"}
        </button>
      </form>

      {/* REVIEWS BELOW */}
      <h2 className="font-semibold text-gray-800 mb-3">What people are saying</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white border border-pinky-200 rounded-2xl p-4 shadow-sm flex gap-3"
          >
            <Avatar name={r.name} imageUrl={r.image_url} />
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-sm">{r.name}</p>
              <p className="text-xs text-gray-500 mb-1">{r.username}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{r.review}</p>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-sm text-gray-500 text-center col-span-2">
            No reviews yet. Be the first to share!
          </p>
        )}
      </div>
    </div>
  );
}
