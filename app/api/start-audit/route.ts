import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

const scheduled = new Set<string>();

const startAuditSchema = z.object({
  url: z.url("Invalid URL format").min(1, "URL is required"),
  consent: z.boolean().refine((val) => val === true, {
    message: "Consent is required",
  }),
  email: z.email("Invalid email format").optional().or(z.literal("")),
});

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

    const { url, consent, email } = validationResult.data;

    const { data: existingPending } = await supabase
      .from("audit_requests")
      .select("id,status")
      .eq("url", url)
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
        url,
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
      return NextResponse.json(
        { success: false, error: "Failed to create audit request" },
        { status: 500 }
      );
    }

    if (!scheduled.has(auditId)) {
      scheduled.add(auditId);
      setTimeout(async () => {
        try {
          // Simulate audit completion
          const mockViolations = [
            {
              id: uuidv4(),
              type: "missing_consent",
              description: "Отсутствует четкое согласие на обработку ПДн",
              severity: "high",
              details: { location: "contact_form" },
            },
            {
              id: uuidv4(),
              type: "missing_privacy_policy",
              description: "Отсутствует политика конфиденциальности",
              severity: "medium",
              details: { location: "footer" },
            },
          ];

          await supabase
            .from("audit_requests")
            .update({
              status: "completed",
              violations: mockViolations,
              risk_level: "high",
              completed_at: new Date().toISOString(),
            })
            .eq("id", auditId);

          // Create violations records
          for (const violation of mockViolations) {
            await supabase.from("violations").insert({
              id: violation.id,
              audit_id: auditId,
              type: violation.type,
              description: violation.description,
              severity: violation.severity,
              details: violation.details,
            });
          }
          scheduled.delete(auditId);
        } catch (err) {
          console.error("Audit simulation error:", err);
        }
      }, 5000);
    }

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
