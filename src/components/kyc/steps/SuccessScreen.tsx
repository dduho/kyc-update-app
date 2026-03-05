"use client";

import { motion } from "framer-motion";

interface SuccessScreenProps {
  phoneNumber: string;
  referenceNumber: string;
}

export default function SuccessScreen({
  phoneNumber,
  referenceNumber,
}: SuccessScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
      className="flex flex-col items-center text-center py-8 space-y-6"
    >
      {/* Animated checkmark */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-28 h-28 rounded-full bg-gradient-to-br from-[#F47920] to-[#E63312] flex items-center justify-center shadow-xl shadow-orange-200"
        >
          <motion.svg
            className="w-14 h-14 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />
          </motion.svg>
        </motion.div>

        {/* Ripple effect */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-[#F47920]"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.5 + i * 0.5, opacity: 0 }}
            transition={{
              duration: 1.5,
              delay: 0.5 + i * 0.3,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">
          Dossier soumis avec succès !
        </h2>
        <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
          Votre demande de mise à jour KYC a été reçue. Elle sera traitée dans
          les{" "}
          <strong className="text-gray-700">24 à 48 heures ouvrables</strong>.
        </p>
      </div>

      {/* Reference card */}
      <div className="w-full bg-[#FFF3E8] rounded-2xl p-4 space-y-2 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Numéro de téléphone</span>
          <span className="font-semibold text-gray-900">+228 {phoneNumber}</span>
        </div>
        <div className="border-t border-[#F47920]/20" />
        <div className="flex justify-between items-start text-sm">
          <span className="text-gray-500">Référence</span>
          <span className="font-mono font-semibold text-[#F47920] text-right break-all">
            {referenceNumber}
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="w-full space-y-2 text-left">
        {[
          { icon: "📋", text: "Votre dossier est en cours de révision" },
          { icon: "🔔", text: "Vous recevrez un SMS de confirmation" },
          { icon: "✅", text: "Votre compte sera mis à jour automatiquement" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.15 }}
            className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm text-gray-700">{item.text}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-xs text-gray-400 text-center"
      >
        Pour toute question, contactez notre support au{" "}
        <a href="tel:+22870000000" className="text-[#F47920] font-medium">
          70 00 00 00
        </a>
      </motion.div>
    </motion.div>
  );
}
