"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  error = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const selectedOption = options.find((opt) => opt?.value === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const inputClass = `w-full bg-white/80 rounded-2xl px-6 py-4 text-gray-700 border transition-all outline-none shadow-md flex items-center justify-between ${
    error ? "ring-2 ring-red-500 border-red-300" : "border-gray-200 focus:border-[var(--dpink)] focus:ring-[var(--dpink)]/20"
  }`;

  return (
    <div className="relative w-full" ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((s) => !s)}
        className={inputClass}
      >
        <span className={selectedOption ? "text-gray-700" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={20} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 border border-gray-200 rounded-2xl shadow-lg z-10 overflow-hidden">
          {options.map((option, idx) => (
            <button
              key={option.value ?? idx}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-6 py-4 text-left transition-colors ${
                value === option.value
                  ? "bg-[var(--dpink)] text-white font-medium"
                  : "text-gray-700 hover:bg-[var(--dpink)]/10"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
