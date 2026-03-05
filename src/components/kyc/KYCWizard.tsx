"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import StepIndicator from "./StepIndicator";
import PhoneVerification from "./steps/PhoneVerification";
import PersonalInfo from "./steps/PersonalInfo";
import DocumentUpload from "./steps/DocumentUpload";
import ReviewConfirm from "./steps/ReviewConfirm";
import SuccessScreen from "./steps/SuccessScreen";
import { KYCFormData, KYCStep } from "@/lib/types";

const EMPTY_FORM: KYCFormData = {
  phoneNumber: "",
  otpCode: "",
  lastName: "",
  firstName: "",
  dateOfBirth: "",
  placeOfBirth: "",
  nationality: "Togolaise",
  gender: "M",
  profession: "",
  address: "",
  documentType: "CNI",
  documentNumber: "",
  documentExpiry: "",
  documentFrontImage: null,
  documentBackImage: null,
  selfieImage: null,
};

export default function KYCWizard() {
  const [step, setStep] = useState<KYCStep>("phone");
  const [formData, setFormData] = useState<KYCFormData>(EMPTY_FORM);
  const [token, setToken] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  const updateForm = (partial: Partial<KYCFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const goNext = () => {
    const order: KYCStep[] = ["phone", "personal", "document", "review", "success"];
    const idx = order.indexOf(step);
    if (idx < order.length - 1) setStep(order[idx + 1]);
  };

  const goBack = () => {
    const order: KYCStep[] = ["phone", "personal", "document", "review", "success"];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/90 border-b border-gray-100/80 shadow-sm">
        <div className="max-w-md mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Moov Africa logo mark */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F47920] to-[#E63312] flex items-center justify-center shadow-md shadow-orange-200">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight tracking-tight">Moov Africa</p>
              <p className="text-[10px] text-gray-400 leading-none font-medium">Togo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#FFF3E8] px-3 py-1.5 rounded-full">
              <p className="text-xs font-bold text-[#F47920] leading-none">Mise à jour KYC</p>
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <StepIndicator currentStep={step} />
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          {step === "phone" && (
            <PhoneVerification
              key="phone"
              data={formData}
              onUpdate={updateForm}
              onNext={goNext}
              onTokenReceived={setToken}
            />
          )}

          {step === "personal" && (
            <PersonalInfo
              key="personal"
              data={formData}
              onUpdate={updateForm}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === "document" && (
            <DocumentUpload
              key="document"
              data={formData}
              onUpdate={updateForm}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === "review" && (
            <ReviewConfirm
              key="review"
              data={formData}
              token={token}
              onBack={goBack}
              onSuccess={(ref) => {
                setReferenceNumber(ref);
                setStep("success");
              }}
            />
          )}

          {step === "success" && (
            <SuccessScreen
              key="success"
              phoneNumber={formData.phoneNumber}
              referenceNumber={referenceNumber}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      {step !== "success" && (
        <footer className="max-w-md mx-auto w-full px-4 py-4 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-[10px] text-gray-400 font-medium">
              Sécurisé par Moov Africa · Données chiffrées et protégées
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
