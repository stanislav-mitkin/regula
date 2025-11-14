import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { freeAuditRunner } from "@/lib/freeAuditRunner";
import { auditProgressMap } from "../audit-state";
import { normalizeUrl } from "@/lib/audit";

const scheduled = new Set<string>();

const startAuditSchema = z.object({
  url: z.url("Invalid URL format").min(1, "URL is required"),
  consent: z.boolean().refine((val) => val === true, {
    message: "Consent is required",
  }),
  email: z.email("Invalid email format").optional().or(z.literal("")),
  captchaToken: z.string().min(1, "Captcha token required"),
});

async function verifyCaptcha(token: string, ip?: string) {
  const secret = process.env.YANDEX_CAPTCHA_SECRET;
  if (!secret) return { ok: true };
  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("token", token);
  if (ip) params.append("ip", ip);
  const res = await fetch("https://captcha-api.yandex.ru/validate", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const data = await res.json().catch(() => null);
  if (!data || data.status !== "ok") return { ok: false };
  return { ok: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = startAuditSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          validationErrors: validationResult.error.message,
        },
        { status: 400 }
      );
    }

    const { url, consent, email, captchaToken } = validationResult.data;
    const ip = request.headers.get("x-forwarded-for") || undefined;
    const v = await verifyCaptcha(captchaToken, ip);
    if (!v.ok) {
      return NextResponse.json({ success: false, error: "Captcha validation failed" }, { status: 403 });
    }
    const canonUrl = normalizeUrl(url);

    const { data: existingPending } = await supabase
      .from("audit_requests")
      .select("id,status")
      .eq("url", canonUrl)
      .eq("status", "pending")
      .limit(1);

    if (existingPending && existingPending.length > 0) {
      return NextResponse.json({
        success: true,
        auditId: existingPending[0].id,
        status: "pending",
      });
    }

    const auditId = uuidv4();

    // Create audit request in database
    const { data, error } = await supabase
      .from("audit_requests")
      .insert({
        id: auditId,
        url: canonUrl,
        status: "pending",
        violations: [],
        risk_level: "unknown",
        email: email || null,
        consent_given: consent,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
    }

    if (!scheduled.has(auditId)) {
      scheduled.add(auditId);
      auditProgressMap.set(auditId, { status: "pending", progress: 0, checks: [] });
      console.log("AUDIT_START", { auditId, url: canonUrl });
      freeAuditRunner(auditId, canonUrl)
        .catch((err) => {
          console.error("AUDIT_ERROR", { auditId, error: String(err) });
        })
        .finally(() => {
          console.log("AUDIT_SCHEDULE_DONE", { auditId });
          scheduled.delete(auditId);
        });
    }

    console.log("AUDIT_CREATED", { auditId, url: canonUrl });
    return NextResponse.json({
      success: true,
      auditId: auditId,
      status: "pending",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
