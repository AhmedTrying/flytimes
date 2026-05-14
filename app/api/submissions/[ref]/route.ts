import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseEnabled } from "@/lib/supabase";
import { isAdminAuthed } from "@/lib/adminAuth";

type Params = { params: { ref: string } };

/* ------------------------------------------------------------------ */
/* PATCH /api/submissions/:ref — update status                         */
/* ------------------------------------------------------------------ */
export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseEnabled || !supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const body = await req.json();

  // Accept either { status } or { adminNotes } or both
  const patch: Record<string, unknown> = {};
  if (body.status !== undefined) patch.status = body.status;
  if (body.adminNotes !== undefined) patch.admin_notes = body.adminNotes;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { error } = await supabase
    .from("submissions")
    .update(patch)
    .eq("ref", params.ref);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

/* ------------------------------------------------------------------ */
/* DELETE /api/submissions/:ref — remove submission                    */
/* ------------------------------------------------------------------ */
export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseEnabled || !supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { error } = await supabase
    .from("submissions")
    .delete()
    .eq("ref", params.ref);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
