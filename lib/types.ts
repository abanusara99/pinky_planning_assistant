export type PlanType = "wedding" | "birthday" | "community" | "big";

export interface Booking {
    id?: string;
    plan_type: PlanType;
    plan_price: number;
    event_date: string;
    event_time: string;
    /** Couple name / special person name / event name — depends on plan type */
    main_name?: string | null;
    /** Free-text preferences (theme, colors, must-haves) */
    preferences?: string | null;
    created_at?: string;
}

export interface Review {
    id?: string;
    name: string;
    username: string;
    image_url: string | null;
    review: string;
    created_at?: string;
}

export interface Availability {
    id?: string;
    date: string;
    status: "busy" | "free";
}