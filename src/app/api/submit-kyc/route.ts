import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      token,
      personalInfo,
      documentInfo,
    } = body;

    if (!token || !personalInfo || !documentInfo) {
      return NextResponse.json(
        { success: false, message: "Données incomplètes." },
        { status: 400 }
      );
    }

    // In production, validate the token and forward to the mobile money API
    // e.g., call the Moov Africa internal KYC service

    // Simulate processing
    await new Promise((r) => setTimeout(r, 1000));

    const referenceNumber = `KYC-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    return NextResponse.json({
      success: true,
      message:
        "Votre dossier KYC a été soumis avec succès. Il sera traité sous 24 à 48 heures ouvrables.",
      referenceNumber,
      submittedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la soumission." },
      { status: 500 }
    );
  }
}
