"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function Header() {
    return (
        <header className="bg-pinky-200 border-b border-pinky-300">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Heart size={24} fill="#ec4899" className="text-pinky-500" />
                    <h1 className="text-lg md:text-xl font-bold text-gray-800">
                        Pinky Planning Assistant
                    </h1>
                </Link>
                <nav className="flex gap-4 md:gap-6 text-sm font-medium text-gray-700">
                    <Link href="/" className="hover:text-pinky-500">Home</Link>
                    <Link href="/chat" className="hover:text-pinky-500">Book</Link>
                    <Link href="/calendar" className="hover:text-pinky-500">Calendar</Link>
                    <Link href="/reviews" className="hover:text-pinky-500">Reviews</Link>
                </nav>
            </div>
        </header>
    );
}