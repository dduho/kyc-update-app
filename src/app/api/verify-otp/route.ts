import { NextRequest, NextResponse } from "next/server";
import { otpStore } from "../send-otp/route";

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, code } = await req.json();

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { success: false, message: "Données manquantes." },
        { status: 400 }
      );
    }

    const normalized = phoneNumber.replace(/\s+/g, "").replace(/^0+/, "");
    const entry = otpStore.get(normalized);

    if (!entry) {
      return NextResponse.json(
        {
          success: false,
          message: "Aucun code OTP trouvé. Veuillez en demander un nouveau.",
        },
        { status: 404 }
      );
    }

    if (Date.now() > entry.expiresAt) {
      otpStore.delete(normalized);
      return NextResponse.json(
        {
          success: false,
          message: "Le code OTP a expiré. Veuillez en demander un nouveau.",
        },
        { status: 410 }
      );
    }

    if (entry.code !== String(code).trim()) {
      return NextResponse.json(
        { success: false, message: "Code OTP incorrect." },
        { status: 401 }
      );
    }

    // Consume OTP
    otpStore.delete(normalized);

    return NextResponse.json({
      success: true,
      message: "Numéro vérifié avec succès.",
      token: Buffer.from(`${normalized}:${Date.now()}`).toString("base64"),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
