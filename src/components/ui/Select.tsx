"use client";

import { SelectHTMLAttributes, forwardRef, useState } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      placeholder,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase"
          >
            {label}
            {props.required && <span className="text-[#E63312] ml-1">*</span>}
          </label>
        )}
        <div
          className={`
            relative flex items-center rounded-xl border-2 transition-all duration-200
            ${
              error
                ? "border-[#E63312] bg-red-50/60"
                : focused
                ? "border-[#F47920] bg-white shadow-[0_0_0_3px_rgba(244,121,32,0.12)]"
                : "border-gray-200 bg-white hover:border-gray-300 shadow-sm"
            }
          `}
        >
          <select
            ref={ref}
            id={selectId}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              w-full appearance-none bg-transparent text-gray-900 
              focus:outline-none py-3 pl-4 pr-10 text-[15px] font-medium
              ${!props.value && !props.defaultValue ? "text-gray-400" : ""}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="absolute right-3.5 pointer-events-none text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-[#E63312] flex items-center gap-1 font-medium">
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
          <p className="mt-1.5 text-xs text-gray-400 font-medium">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
