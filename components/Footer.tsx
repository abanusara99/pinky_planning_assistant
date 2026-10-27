import { MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-pinky-200 border-t border-pinky-300">
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-sm text-gray-700">
                <span className="flex items-center gap-2">
                    <MapPin size={18} className="text-pinky-500" /> USA
                </span>
                <span className="flex items-center gap-2">
                    <Phone size={18} className="text-pinky-500" /> +1 000-000-0000
                </span>
            </div>
        </footer>
    );
}