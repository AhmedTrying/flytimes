import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseEnabled } from "@/lib/supabase";
import type { Submission } from "@/lib/submissions";
import { isAdminAuthed } from "@/lib/adminAuth";

/* ------------------------------------------------------------------ */
/* GET /api/submissions — list all (admin)                             */
/* ------------------------------------------------------------------ */
export async function GET() {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseEnabled || !supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map snake_case DB columns → camelCase Submission type
  const submissions: Submission[] = (data ?? []).map(dbToSubmission);
  return NextResponse.json(submissions);
}

/* ------------------------------------------------------------------ */
/* POST /api/submissions — create new submission                       */
/* ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  if (!supabaseEnabled || !supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  const body: Submission = await req.json();

  const { error } = await supabase.from("submissions").insert([
    submissionToDb(body),
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, ref: body.ref }, { status: 201 });
}

/* ------------------------------------------------------------------ */
/* Helpers: map between TS type (camelCase) and DB columns (snake_case)*/
/* ------------------------------------------------------------------ */
function submissionToDb(s: Submission) {
  return {
    ref: s.ref,
    created_at: s.createdAt,
    status: s.status,
    dest: s.dest,
    dest_id: s.destId,
    trip: s.trip ?? null,
    hotel: s.hotel ?? null,
    addons: s.addons ?? [],
    duration: s.duration ?? null,
    date: s.date,
    adults: s.adults,
    children: s.children,
    name: s.name,
    phone: s.phone,
    email: s.email,
    channel: s.channel ?? null,
    city: s.city,
    notes: s.notes,
    estimate: s.estimate,
    service: s.service,
    admin_notes: s.adminNotes ?? null,
  };
}

function dbToSubmission(row: Record<string, unknown>): Submission {
  return {
    ref: row.ref as string,
    createdAt: row.created_at as string,
    status: row.status as Submission["status"],
    dest: row.dest as string,
    destId: row.dest_id as string,
    trip: row.trip as Submission["trip"],
    hotel: row.hotel as Submission["hotel"],
    addons: (row.addons as string[]) ?? [],
    duration: row.duration as string,
    date: row.date as string,
    adults: row.adults as string,
    children: row.children as string,
    name: row.name as string,
    phone: row.phone as string,
    email: row.email as string,
    channel: row.channel as Submission["channel"],
    city: row.city as string,
    notes: row.notes as string,
    estimate: row.estimate as string,
    service: row.service as string,
    adminNotes: row.admin_notes as string | undefined,
  };
}
