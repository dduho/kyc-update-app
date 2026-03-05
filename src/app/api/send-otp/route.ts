import { NextRequest, NextResponse } from "next/server";

// In-memory OTP store (use Redis/DB in production)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber || typeof phoneNumber !== "string") {
      return NextResponse.json(
        { success: false, message: "Numéro de téléphone invalide." },
        { status: 400 }
      );
    }

    // Normalize: remove spaces and leading zeros
    const normalized = phoneNumber.replace(/\s+/g, "").replace(/^0+/, "");
    if (!/^\d{8}$/.test(normalized)) {
      return NextResponse.json(
        {
          success: false,
          message: "Le numéro doit comporter 8 chiffres.",
        },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore.set(normalized, { code, expiresAt });

    // In production: call SMS gateway here (e.g., Africa's Talking, Twilio)
    // For now we return the code in non-production environments
    const isDev = process.env.NODE_ENV !== "production";

    console.log(`[OTP] ${normalized} → ${code}`);

    return NextResponse.json({
      success: true,
      message: "Code OTP envoyé avec succès.",
      sessionId: Buffer.from(normalized).toString("base64"),
      ...(isDev && { devCode: code }),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

// Export the store so verify-otp can access it (same process only)
export { otpStore };
