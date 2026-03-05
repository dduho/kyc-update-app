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
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Moov Africa logo mark */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F47920] to-[#E63312] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900 leading-none">Moov Africa</p>
              <p className="text-[10px] text-gray-500 leading-none mt-0.5">Togo</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 leading-none">Mise à jour</p>
            <p className="text-xs font-semibold text-[#F47920] leading-none mt-0.5">KYC</p>
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
        <footer className="max-w-md mx-auto w-full px-4 py-3 text-center">
          <p className="text-[10px] text-gray-400">
            Sécurisé par Moov Africa · Vos données sont chiffrées et protégées
          </p>
        </footer>
      )}
    </div>
  );
}
