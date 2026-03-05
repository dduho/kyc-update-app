"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { KYCFormData, DOCUMENT_LABELS } from "@/lib/types";

interface ReviewConfirmProps {
  data: KYCFormData;
  token: string;
  onBack: () => void;
  onSuccess: (ref: string) => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0 w-2/5">{label}</span>
      <span className="text-sm font-semibold text-gray-800 text-right">{value || "—"}</span>
    </div>
  );
}

function Section({ title, icon, children }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.09)] overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-[#FFF3E8] flex items-center justify-center">
          <span className="text-[#F47920]">{icon}</span>
        </div>
        <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
      </div>
      <div className="px-4">{children}</div>
    </div>
  );
}

export default function ReviewConfirm({
  data,
  token,
  onBack,
  onSuccess,
}: ReviewConfirmProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  const formatDate = (d: string) => {
    if (!d) return "";
    const [year, month, day] = d.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async () => {
    if (!agreed) {
      setError("Veuillez accepter les conditions avant de soumettre.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/submit-kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          personalInfo: {
            lastName: data.lastName,
            firstName: data.firstName,
            dateOfBirth: data.dateOfBirth,
            placeOfBirth: data.placeOfBirth,
            nationality: data.nationality,
            gender: data.gender,
            profession: data.profession,
            address: data.address,
            phoneNumber: data.phoneNumber,
          },
          documentInfo: {
            documentType: data.documentType,
            documentNumber: data.documentNumber,
            documentExpiry: data.documentExpiry,
          },
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setError(json.message);
        return;
      }

      onSuccess(json.referenceNumber);
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-4"
    >
      <div className="text-center mb-4 space-y-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#FFF3E8] to-[#FFE4CC] flex items-center justify-center mx-auto shadow-md shadow-orange-100"
        >
          <svg className="w-8 h-8 text-[#F47920]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Révision finale</h2>
        <p className="text-gray-500 text-sm">
          Vérifiez vos informations avant la soumission définitive.
        </p>
      </div>

      {/* Phone */}
      <Section
        title="Téléphone"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        }
      >
        <InfoRow label="Numéro" value={`+228 ${data.phoneNumber}`} />
        <InfoRow label="Statut" value="✓ Vérifié" />
      </Section>

      {/* Personal info */}
      <Section
        title="Informations personnelles"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        }
      >
        <InfoRow label="Nom" value={data.lastName} />
        <InfoRow label="Prénoms" value={data.firstName} />
        <InfoRow label="Date de naissance" value={formatDate(data.dateOfBirth)} />
        <InfoRow label="Lieu de naissance" value={data.placeOfBirth} />
        <InfoRow label="Nationalité" value={data.nationality} />
        <InfoRow label="Sexe" value={data.gender === "M" ? "Masculin" : "Féminin"} />
        <InfoRow label="Profession" value={data.profession} />
        <InfoRow label="Adresse" value={data.address} />
      </Section>

      {/* Document */}
      <Section
        title="Pièce d'identité"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"
            />
          </svg>
        }
      >
        <InfoRow
          label="Type"
          value={DOCUMENT_LABELS[data.documentType] || data.documentType}
        />
        <InfoRow label="Numéro" value={data.documentNumber} />
        <InfoRow
          label="Expiration"
          value={formatDate(data.documentExpiry)}
        />
        <InfoRow label="Vérification" value="✓ IA validée" />
      </Section>

      {/* Consent */}
      <label className="flex items-start gap-3 cursor-pointer bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.09)] p-4">
        <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${agreed ? "bg-[#F47920] border-[#F47920]" : "border-gray-300 bg-white"}`}>
          {agreed && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => {
            setAgreed(e.target.checked);
            setError("");
          }}
          className="sr-only"
        />
        <span className="text-xs text-gray-600 leading-relaxed">
          Je certifie que les informations fournies sont exactes et je consens au
          traitement de mes données personnelles par Moov Africa Togo conformément
          à la{" "}
          <span className="text-[#F47920] font-semibold">politique de confidentialité</span>.
        </span>
      </label>

      {error && (
        <p className="text-xs text-[#E63312] text-center">{error}</p>
      )}

      <div className="flex gap-3 pt-1">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          Retour
        </Button>
        <Button
          onClick={handleSubmit}
          loading={loading}
          className="flex-2"
          style={{ flex: 2 }}
        >
          Soumettre ma demande
        </Button>
      </div>
    </motion.div>
  );
}
