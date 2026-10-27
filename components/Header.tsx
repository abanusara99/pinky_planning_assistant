"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Menu, X } from "lucide-react";

export default function Header() {
    const [open, setOpen] = useState(false);

    const links = [
        { href: "/", label: "Home" },
        { href: "/chat", label: "Book" },
        { href: "/calendar", label: "Calendar" },
        { href: "/reviews", label: "Reviews" },
    ];

    return (
        <header className="bg-pinky-200 border-b border-pinky-300 relative z-30">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo + title */}
                <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setOpen(false)}
                >
                    <Heart size={24} fill="#ec4899" className="text-pinky-500" />
                    <h1 className="text-lg md:text-xl font-bold text-gray-800">
                        Pinky Planning Assistant
                    </h1>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex gap-4 md:gap-6 text-sm font-medium text-gray-700">
                    {links.map((l) => (
                        <Link key={l.href} href={l.href} className="hover:text-pinky-500">
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile hamburger (three black bars → X) */}
                <button
                    className="md:hidden p-1 rounded-md text-black"
                    onClick={() => setOpen((o) => !o)}
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                >
                    {open ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* Mobile vertical dropdown */}
            {open && (
                <nav className="md:hidden border-t border-pinky-300 bg-pinky-100">
                    <ul className="flex flex-col">
                        {links.map((l) => (
                            <li key={l.href}>
                                <Link
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className="block px-4 py-3 text-sm font-medium text-gray-800 border-b border-pinky-200 last:border-b-0 hover:bg-pinky-200"
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    );
}