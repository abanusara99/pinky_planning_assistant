import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const {
      plan_type,
      plan_price,
      event_date,
      event_time,
      main_name,
      preferences,
    } = await req.json();

    if (!plan_type || !plan_price || !event_date || !event_time) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Block Wednesdays server-side
    const day = new Date(event_date + "T00:00:00").getDay();
    if (day === 3) {
      return NextResponse.json(
        { error: "Wednesdays are company holidays. Please pick another day." },
        { status: 400 }
      );
    }

    // Block already-busy dates
    const { data: existing } = await supabase
      .from("availability")
      .select("status")
      .eq("date", event_date)
      .maybeSingle();

    if (existing?.status === "busy") {
      return NextResponse.json(
        { error: "This date is already booked. Please pick another day." },
        { status: 409 }
      );
    }

    const { error } = await supabase.from("bookings").insert([
      {
        plan_type,
        plan_price,
        event_date,
        event_time,
        main_name: main_name || null,
        preferences: preferences || null,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}