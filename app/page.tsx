import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
        Welcome to Pinky Planning Assistant
      </h2>
      <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10">
        Pinky Planning Assistant is your friendly companion for organizing weddings,
        birthdays, and community events with confidence. It brings budgets, timelines,
        vendor checklists, and availability calendars together in one simple place so
        you can focus on celebrating, not stressing. Whether you are planning an
        intimate birthday or a large community gathering, Pinky helps you stay
        organized from the first idea to the final detail. Choose a plan, pick your
        date, and let the assistant guide you through every step. Planning should feel
        joyful, and Pinky is designed to make it exactly that.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/chat"
          className="px-6 py-3 bg-pinky-400 hover:bg-pinky-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition"
        >
          Start Chat & Book a Plan
        </Link>
        <Link
          href="/calendar"
          className="px-6 py-3 bg-white border-2 border-pinky-300 text-pinky-500 hover:bg-pinky-50 font-semibold rounded-xl shadow-md hover:shadow-lg transition"
        >
          View Availability Calendar
        </Link>
        <Link
          href="/reviews"
          className="px-6 py-3 bg-white border-2 border-pinky-300 text-pinky-500 hover:bg-pinky-50 font-semibold rounded-xl shadow-md hover:shadow-lg transition"
        >
          Read Reviews
        </Link>
      </div>
    </div>
  );
}