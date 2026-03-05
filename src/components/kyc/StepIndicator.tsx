"use client";

import { motion } from "framer-motion";
import { KYCStep } from "@/lib/types";

interface Step {
  id: KYCStep;
  label: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    id: "phone",
    label: "Téléphone",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
  },
  {
    id: "personal",
    label: "Informations",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    id: "document",
    label: "Document",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"
        />
      </svg>
    ),
  },
  {
    id: "review",
    label: "Révision",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

interface StepIndicatorProps {
  currentStep: KYCStep;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  if (currentStep === "success") return null;

  return (
    <div className="w-full px-4 py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress bar background */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 mx-8" />

        {/* Animated progress */}
        <motion.div
          className="absolute top-4 left-8 h-0.5 bg-[#F47920] origin-left"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: currentIndex / (STEPS.length - 1),
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ right: "2rem", left: "2rem" }}
        />

        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.id} className="relative flex flex-col items-center z-10">
              <motion.div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-[#F47920] text-white"
                      : isCurrent
                      ? "bg-[#F47920] text-white ring-4 ring-[#F47920]/20"
                      : "bg-white border-2 border-gray-200 text-gray-400"
                  }
                `}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon
                )}
              </motion.div>
              <span
                className={`
                  mt-1.5 text-[10px] font-medium whitespace-nowrap
                  ${isCurrent ? "text-[#F47920]" : isCompleted ? "text-gray-600" : "text-gray-400"}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
