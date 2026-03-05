import { NextRequest, NextResponse } from "next/server";

// Simulate AI-powered document verification
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, documentType } = body;

    if (!image || !documentType) {
      return NextResponse.json(
        { success: false, message: "Image ou type de document manquant." },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 1500));

    // Simulate verification result (in production, call a real AI service
    // like Jumio, Onfido, AWS Rekognition, or Google Vision API)
    const confidence = 0.85 + Math.random() * 0.14; // 85-99%
    const passed = confidence > 0.87;

    const result = {
      status: passed ? "verified" : "rejected",
      confidence: Math.round(confidence * 100),
      checks: {
        quality: confidence > 0.80,
        authenticity: confidence > 0.85,
        faceMatch: confidence > 0.88,
        expiry: true,
      },
      message: passed
        ? "Document vérifié avec succès. Les informations correspondent."
        : "La vérification a échoué. Veuillez reprendre une photo plus nette.",
      extractedData: passed
        ? {
            documentNumber: `TG${Math.floor(Math.random() * 9000000 + 1000000)}`,
            issuingCountry: "TG",
            documentType,
          }
        : undefined,
    };

    return NextResponse.json({ success: true, result });
  } catch {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la vérification." },
      { status: 500 }
    );
  }
}
