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
      className="flex flex-col items-center text-center py-6 space-y-6"
    >
      {/* Animated success badge */}
      <div className="relative">
        {/* Ripple rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(244,121,32,0.3), rgba(230,51,18,0.2))",
            }}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.8 + i * 0.6, opacity: 0 }}
            transition={{
              duration: 1.8,
              delay: 0.4 + i * 0.35,
              repeat: Infinity,
              repeatDelay: 1.2,
            }}
          />
        ))}

        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 15 }}
          className="w-28 h-28 rounded-full flex items-center justify-center shadow-2xl shadow-orange-300/50"
          style={{
            background: "linear-gradient(135deg, #F47920 0%, #E63312 100%)",
          }}
        >
          <motion.svg
            className="w-14 h-14 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            />
          </motion.svg>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Dossier soumis avec succès !
        </h2>
        <p className="text-gray-500 text-sm max-w-xs leading-relaxed mx-auto">
          Votre demande de mise à jour KYC a été reçue. Elle sera traitée dans les{" "}
          <strong className="text-gray-700">24 à 48 heures ouvrables</strong>.
        </p>
      </motion.div>

      {/* Reference card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full rounded-2xl overflow-hidden shadow-md shadow-orange-100/80"
        style={{
          background: "linear-gradient(135deg, #FFF3E8 0%, #FFE8CC 100%)",
          border: "1px solid rgba(244,121,32,0.15)",
        }}
      >
        <div className="px-4 py-3 flex justify-between items-center border-b border-[#F47920]/10">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Numéro de téléphone</span>
          <span className="font-bold text-gray-800 text-sm">+228 {phoneNumber}</span>
        </div>
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Référence</span>
          <span className="font-mono font-bold text-[#F47920] text-sm break-all text-right max-w-[60%]">
            {referenceNumber}
          </span>
        </div>
      </motion.div>

      {/* Next steps */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full space-y-2.5"
      >
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Prochaines étapes</p>
        {[
          {
            icon: (
              <svg className="w-5 h-5 text-[#F47920]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            ),
            text: "Votre dossier est en cours de révision",
          },
          {
            icon: (
              <svg className="w-5 h-5 text-[#F47920]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            ),
            text: "Vous recevrez un SMS de confirmation",
          },
          {
            icon: (
              <svg className="w-5 h-5 text-[#F47920]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            text: "Votre compte sera mis à jour automatiquement",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.12 }}
            className="flex items-center gap-3 bg-white rounded-xl p-3.5 shadow-sm border border-gray-100"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFF3E8] flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <span className="text-sm font-medium text-gray-700">{item.text}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2.5"
      >
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <p className="text-xs text-gray-500">
          Support :{" "}
          <a href="tel:+22870000000" className="text-[#F47920] font-bold hover:underline">
            70 00 00 00
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}
