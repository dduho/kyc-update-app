"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import { KYCFormData, DOCUMENT_LABELS, DocumentType, DocumentVerificationResult } from "@/lib/types";

interface DocumentUploadProps {
  data: KYCFormData;
  onUpdate: (data: Partial<KYCFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

type UploadSlot = "front" | "back" | "selfie";

interface VerificationState {
  status: "idle" | "processing" | "done";
  result: DocumentVerificationResult | null;
}

const DOC_TYPE_OPTIONS = (Object.keys(DOCUMENT_LABELS) as DocumentType[]).map(
  (k) => ({ value: k, label: DOCUMENT_LABELS[k] })
);

// Image upload slot – declared outside the parent to avoid re-creation on render
interface ImageSlotProps {
  slot: UploadSlot;
  label: string;
  image: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  hint?: string;
  icon?: React.ReactNode;
  onFileChange: (slot: UploadSlot, file: File) => void;
}

function ImageSlot({ slot, label, image, inputRef, hint, icon, onFileChange }: ImageSlotProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</p>
      <motion.button
        type="button"
        onClick={() => inputRef.current?.click()}
        whileTap={{ scale: 0.98 }}
        className={`
          relative w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center
          overflow-hidden cursor-pointer
          ${image
            ? "border-[#F47920] bg-[#FFF9F5]"
            : "border-gray-200 bg-gray-50/80 hover:bg-white hover:border-[#F47920]/40 hover:shadow-sm"
          }
        `}
      >
        {image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-end justify-center pb-3">
              <div className="bg-white/95 text-[#F47920] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Modifier la photo
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2.5 text-gray-400 p-4">
            {icon || (
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            )}
            <div className="text-center">
              <span className="text-sm font-semibold text-gray-600 block">
                Appuyez pour photographier
              </span>
              {hint && <span className="text-xs text-gray-400 mt-0.5 block">{hint}</span>}
            </div>
          </div>
        )}
      </motion.button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileChange(slot, f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// Check indicator row
function CheckRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
          ok ? "bg-green-500" : "bg-red-400"
        }`}
      >
        {ok ? (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>
      <span className={ok ? "text-gray-700" : "text-red-600"}>{label}</span>
    </div>
  );
}

// Processing animation
function ProcessingIndicator() {
  const checks = [
    "Analyse de la qualité d'image...",
    "Détection du document...",
    "Vérification de l'authenticité...",
    "Correspondance biométrique...",
    "Validation finale...",
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => {
        if (c >= checks.length - 1) {
          clearInterval(interval);
          return c;
        }
        return c + 1;
      });
    }, 400);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 py-8">
      <div className="relative w-20 h-20">
        <svg className="animate-spin w-20 h-20 text-[#F47920]" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" strokeOpacity="0.15" />
          <path
            d="M40 4 a36 36 0 0 1 36 36"
            stroke="url(#spinGrad)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="spinGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F47920" />
              <stop offset="100%" stopColor="#E63312" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFF3E8] to-[#FFE4CC] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#F47920]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="text-center space-y-1.5">
        <p className="font-bold text-gray-900 text-base">Vérification en cours</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-sm text-gray-500"
          >
            {checks[current]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="flex gap-1.5 items-center">
        {checks.map((_, i) => (
          <motion.div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-400 ${
              i <= current ? "bg-gradient-to-r from-[#F47920] to-[#E63312]" : "bg-gray-200"
            }`}
            style={{ width: i <= current ? 24 : 8 }}
          />
        ))}
      </div>
    </div>
  );
}

export default function DocumentUpload({
  data,
  onUpdate,
  onNext,
  onBack,
}: DocumentUploadProps) {
  const [verification, setVerification] = useState<VerificationState>({
    status: "idle",
    result: null,
  });
  const [error, setError] = useState("");

  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (slot: UploadSlot, file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner une image valide (JPG, PNG, HEIC).");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 10 Mo.");
        return;
      }

      setError("");
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (slot === "front") onUpdate({ documentFrontImage: base64 });
        if (slot === "back") onUpdate({ documentBackImage: base64 });
        if (slot === "selfie") onUpdate({ selfieImage: base64 });
      };
      reader.readAsDataURL(file);
    },
    [onUpdate]
  );

  const needsBack = data.documentType === "CNI" || data.documentType === "PERMIS";

  const canVerify =
    data.documentType &&
    data.documentNumber &&
    data.documentExpiry &&
    data.documentFrontImage &&
    (!needsBack || data.documentBackImage) &&
    data.selfieImage;

  const handleVerify = async () => {
    if (!canVerify) {
      setError("Veuillez remplir tous les champs et télécharger toutes les photos.");
      return;
    }

    setVerification({ status: "processing", result: null });
    setError("");

    try {
      const res = await fetch("/api/verify-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: data.documentFrontImage,
          documentType: data.documentType,
        }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.message);
        setVerification({ status: "idle", result: null });
        return;
      }

      setVerification({ status: "done", result: json.result });
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setVerification({ status: "idle", result: null });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="text-center mb-5 space-y-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#FFF3E8] to-[#FFE4CC] flex items-center justify-center mx-auto mb-3 shadow-md shadow-orange-100"
        >
          <svg className="w-8 h-8 text-[#F47920]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"
            />
          </svg>
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Pièce d&apos;identité</h2>
        <p className="text-gray-500 text-sm">
          Photographiez votre document dans un endroit bien éclairé.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {verification.status === "processing" ? (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ProcessingIndicator />
          </motion.div>
        ) : verification.status === "done" && verification.result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* Result card */}
            <div
              className={`rounded-2xl p-5 border-2 shadow-md ${
                verification.result.status === "verified"
                  ? "bg-green-50 border-green-200 shadow-green-100"
                  : "bg-red-50 border-red-200 shadow-red-100"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                    verification.result.status === "verified"
                      ? "bg-gradient-to-br from-green-400 to-green-600 shadow-green-200"
                      : "bg-gradient-to-br from-red-400 to-red-600 shadow-red-200"
                  }`}
                >
                  {verification.result.status === "verified" ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base">
                    {verification.result.status === "verified"
                      ? "Document vérifié ✓"
                      : "Vérification échouée"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Score de confiance : <span className="font-bold">{verification.result.confidence}%</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <CheckRow ok={verification.result.checks.quality} label="Qualité d'image satisfaisante" />
                <CheckRow ok={verification.result.checks.authenticity} label="Document authentique" />
                <CheckRow ok={verification.result.checks.faceMatch} label="Correspondance biométrique" />
                <CheckRow ok={verification.result.checks.expiry} label="Document non expiré" />
              </div>

              <p className={`mt-3 text-sm font-medium ${
                verification.result.status === "verified" ? "text-green-700" : "text-red-700"
              }`}>
                {verification.result.message}
              </p>
            </div>

            <div className="flex gap-3">
              {verification.result.status !== "verified" && (
                <Button
                  variant="secondary"
                  onClick={() => setVerification({ status: "idle", result: null })}
                  className="flex-1"
                >
                  Réessayer
                </Button>
              )}
              <Button
                onClick={onNext}
                disabled={verification.result.status !== "verified"}
                className="flex-1"
              >
                {verification.result.status === "verified" ? "Continuer" : "Non disponible"}
              </Button>
            </div>

            <Button variant="ghost" onClick={onBack} fullWidth>
              Retour
            </Button>
          </motion.div>
        ) : (
          <motion.div key="form" className="space-y-4">
            {/* Document type */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.09)] p-4">
              <Select
                label="Type de document"
                options={DOC_TYPE_OPTIONS}
                placeholder="Sélectionner..."
                value={data.documentType}
                onChange={(e) =>
                  onUpdate({ documentType: e.target.value as DocumentType })
                }
                required
              />
            </div>

            {data.documentType && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                {/* Document details */}
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.09)] p-4 space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Détails du document</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Numéro du document"
                      placeholder="Ex: TG1234567"
                      value={data.documentNumber}
                      onChange={(e) =>
                        onUpdate({ documentNumber: e.target.value.toUpperCase() })
                      }
                      required
                    />
                    <Input
                      label="Date d'expiration"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={data.documentExpiry}
                      onChange={(e) => onUpdate({ documentExpiry: e.target.value })}
                      required
                    />
                  </div>

                  {/* Tips banner */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 flex gap-3 items-start border border-blue-100">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <ul className="text-xs text-blue-700 space-y-1 font-medium">
                      <li>Photo nette, fond uni, bonne luminosité</li>
                      <li>Tous les 4 coins du document visibles</li>
                      <li>Pas de reflets ni d&apos;ombres sur la photo</li>
                    </ul>
                  </div>
                </div>

                {/* Photos section */}
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.09)] p-4 space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Photos du document</p>
                  {/* Front photo */}
                  <ImageSlot
                    slot="front"
                    label="Recto du document"
                    image={data.documentFrontImage}
                    inputRef={frontRef}
                    hint="Face principale avec votre photo"
                    onFileChange={handleFileChange}
                  />

                  {/* Back photo (only for CNI / Permis) */}
                  {needsBack && (
                    <ImageSlot
                      slot="back"
                      label="Verso du document"
                      image={data.documentBackImage}
                      inputRef={backRef}
                      hint="Face arrière du document"
                      onFileChange={handleFileChange}
                    />
                  )}

                  {/* Selfie */}
                  <ImageSlot
                    slot="selfie"
                    label="Selfie de vérification"
                    image={data.selfieImage}
                    inputRef={selfieRef}
                    hint="Photo de votre visage en tenant le document"
                    onFileChange={handleFileChange}
                    icon={
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    }
                  />
                </div>

                {error && (
                  <p className="text-xs text-[#E63312] text-center font-medium">{error}</p>
                )}

                <div className="flex gap-3 pt-1">
                  <Button variant="secondary" onClick={onBack} className="flex-1">
                    Retour
                  </Button>
                  <Button
                    onClick={handleVerify}
                    disabled={!canVerify}
                    className="flex-2"
                    style={{ flex: 2 }}
                  >
                    Vérifier le document
                  </Button>
                </div>
              </motion.div>
            )}

            {!data.documentType && (
              <div className="flex gap-3 pt-1">
                <Button variant="secondary" onClick={onBack} fullWidth>
                  Retour
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
