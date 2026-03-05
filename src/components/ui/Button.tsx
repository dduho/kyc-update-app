"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      children,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const base =
      "relative inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 select-none";

    const variants = {
      primary:
        "bg-gradient-to-r from-[#F47920] to-[#E8600A] hover:from-[#E06910] hover:to-[#D4550A] active:from-[#C85D08] active:to-[#B84C07] text-white focus:ring-[#F47920] shadow-lg shadow-orange-200/60",
      secondary:
        "bg-white border-2 border-[#F47920]/70 text-[#F47920] hover:bg-[#FFF3E8] hover:border-[#F47920] active:bg-[#FFE4CC] focus:ring-[#F47920] shadow-sm",
      ghost:
        "bg-transparent text-[#F47920] hover:bg-[#FFF3E8] active:bg-[#FFE4CC] focus:ring-[#F47920]",
      danger:
        "bg-gradient-to-r from-[#E63312] to-[#c42a0e] hover:from-[#d02e10] hover:to-[#b0260c] text-white focus:ring-[#E63312] shadow-lg shadow-red-200/60",
    };

    const sizes = {
      sm: "text-sm px-4 py-2 h-9",
      md: "text-base px-6 py-3 h-12",
      lg: "text-lg px-8 py-4 h-14",
    };

    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        whileTap={!isDisabled ? { scale: 0.97 } : undefined}
        className={`
          ${base}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? "w-full" : ""}
          ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${className}
        `}
        disabled={isDisabled}
        {...(props as Record<string, unknown>)}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
