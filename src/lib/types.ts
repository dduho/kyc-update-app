export type KYCStep = "phone" | "personal" | "document" | "review" | "success";

export interface KYCFormData {
  // Step 1 – Phone
  phoneNumber: string;
  otpCode: string;

  // Step 2 – Personal info
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  gender: "M" | "F";
  profession: string;
  address: string;

  // Step 3 – Identity document
  documentType: "CNI" | "PASSEPORT" | "PERMIS" | "SEJOUR";
  documentNumber: string;
  documentExpiry: string;
  documentFrontImage: string | null;
  documentBackImage: string | null;
  selfieImage: string | null;
}

export interface OTPSession {
  sessionId: string;
  expiresAt: number;
}

export interface DocumentVerificationResult {
  status: "pending" | "processing" | "verified" | "rejected";
  confidence: number;
  checks: {
    quality: boolean;
    authenticity: boolean;
    faceMatch: boolean;
    expiry: boolean;
  };
  message: string;
  extractedData?: {
    name?: string;
    documentNumber?: string;
    dateOfBirth?: string;
    expiryDate?: string;
  };
}

export type DocumentType = KYCFormData["documentType"];

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  CNI: "Carte Nationale d'Identité",
  PASSEPORT: "Passeport",
  PERMIS: "Permis de conduire",
  SEJOUR: "Titre de séjour",
};

export const NATIONALITY_OPTIONS = [
  "Togolaise",
  "Béninoise",
  "Burkinabé",
  "Camerounaise",
  "Centrafricaine",
  "Comorienne",
  "Congolaise",
  "Djiboutienne",
  "Gabonaise",
  "Guinéenne",
  "Ivoirienne",
  "Malienne",
  "Mauritanienne",
  "Nigérienne",
  "Nigériane",
  "Sénégalaise",
  "Tchadienne",
  "Autre",
];
