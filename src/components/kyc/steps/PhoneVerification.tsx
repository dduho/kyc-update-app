"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { KYCFormData } from "@/lib/types";

interface PhoneVerificationProps {
  data: KYCFormData;
  onUpdate: (data: Partial<KYCFormData>) => void;
  onNext: () => void;
  onTokenReceived: (token: string) => void;
}

type Phase = "phone" | "otp";

export default function PhoneVerification({
  data,
  onUpdate,
  onNext,
  onTokenReceived,
}: PhoneVerificationProps) {
  const [phase, setPhase] = useState<Phase>("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [devCode, setDevCode] = useState<string | null>(null);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCooldown]);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
  };

  const handleSendOTP = async () => {
    const rawPhone = data.phoneNumber.replace(/\s+/g, "");
    if (rawPhone.length < 8) {
      setError("Veuillez saisir un numéro valide à 8 chiffres.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: rawPhone }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.message);
        return;
      }

      if (json.devCode) {
        setDevCode(json.devCode);
        // Auto-fill OTP in dev
        const chars = json.devCode.split("");
        setOtp(chars);
      }

      setPhase("otp");
      setResendCooldown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Veuillez saisir les 6 chiffres du code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: data.phoneNumber.replace(/\s+/g, ""),
          code,
        }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.message);
        // Shake animation – reset otp
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
        return;
      }

      onTokenReceived(json.token);
      onUpdate({ otpCode: code });
      onNext();
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
      className="flex flex-col items-center"
    >
      {/* Hero Icon */}
      <div className="w-20 h-20 rounded-3xl bg-[#FFF3E8] flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-[#F47920]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {phase === "phone" ? (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="w-full space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Confirmez votre numéro
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Saisissez le numéro de téléphone associé à votre compte Moov Africa.
              </p>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Input
                  label="Numéro de téléphone"
                  type="tel"
                  placeholder="XX XX XX XX"
                  value={data.phoneNumber}
                  onChange={(e) => {
                    onUpdate({ phoneNumber: formatPhone(e.target.value) });
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                  error={error}
                  required
                  inputMode="numeric"
                  icon={
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <span className="text-lg">🇹🇬</span>
                      <span className="text-gray-600">+228</span>
                    </div>
                  }
                  style={{ paddingLeft: "4.5rem" }}
                />
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center">
              Un code de vérification à 6 chiffres vous sera envoyé par SMS.
            </p>

            <Button
              fullWidth
              size="lg"
              loading={loading}
              onClick={handleSendOTP}
            >
              Envoyer le code
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="w-full space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Saisissez le code
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Code envoyé au{" "}
                <span className="font-semibold text-gray-700">
                  +228 {data.phoneNumber}
                </span>
              </p>
              {devCode && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-xs text-blue-700">
                  🧪 Mode développement – Code : <strong>{devCode}</strong>
                </div>
              )}
            </div>

            {/* OTP inputs */}
            <div className="flex justify-center gap-2.5" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <motion.input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className={`
                    w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-white
                    focus:outline-none transition-all duration-200 caret-transparent
                    ${
                      error
                        ? "border-[#E63312] bg-red-50 text-[#E63312]"
                        : digit
                        ? "border-[#F47920] text-[#F47920]"
                        : "border-gray-200 text-gray-900"
                    }
                    focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/10
                  `}
                  animate={error ? { x: [-4, 4, -4, 4, 0] } : {}}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>

            {error && (
              <p className="text-center text-xs text-[#E63312]">{error}</p>
            )}

            <Button
              fullWidth
              size="lg"
              loading={loading}
              onClick={handleVerifyOTP}
            >
              Vérifier
            </Button>

            <div className="text-center">
              {resendCooldown > 0 ? (
                <p className="text-sm text-gray-400">
                  Renvoyer dans{" "}
                  <span className="font-semibold text-[#F47920]">
                    {resendCooldown}s
                  </span>
                </p>
              ) : (
                <button
                  onClick={() => {
                    setOtp(["", "", "", "", "", ""]);
                    setPhase("phone");
                    setError("");
                  }}
                  className="text-sm font-medium text-[#F47920] hover:text-[#D4600A] transition-colors"
                >
                  Changer de numéro ou renvoyer
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
