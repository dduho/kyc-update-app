"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, suffix, className = "", id, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
            {props.required && <span className="text-[#E63312] ml-1">*</span>}
          </label>
        )}
        <div
          className={`
            relative flex items-center rounded-xl border-2 transition-all duration-200 bg-white
            ${
              error
                ? "border-[#E63312] bg-red-50"
                : focused
                ? "border-[#F47920] ring-2 ring-[#F47920]/10"
                : "border-gray-200 hover:border-gray-300"
            }
          `}
        >
          {icon && (
            <span className="absolute left-3.5 text-gray-400 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              w-full bg-transparent text-gray-900 placeholder-gray-400
              focus:outline-none py-3 text-[15px]
              ${icon ? "pl-11" : "pl-4"}
              ${suffix ? "pr-12" : "pr-4"}
              ${className}
            `}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3.5">{suffix}</span>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-[#E63312] flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
