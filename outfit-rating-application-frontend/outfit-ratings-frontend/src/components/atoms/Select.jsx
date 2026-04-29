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
  className = "",
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
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Default style used in create post, className can be used for custom styles in pages
  const defaultInputClass = `w-full bg-white/80 rounded-2xl px-6 py-4 text-gray border transition-all outline-none shadow-md flex items-center justify-between border-lgray focus:border-(--dpink) focus:ring-(--dpink)/20`;

  const inputClass = className
    ? `${className} ${error ? "ring-2 ring-red-500 border-red-300" : ""}`
    : defaultInputClass;

  return (
    <div className="relative w-full" ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-gray mb-2">
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
        <span className={selectedOption ? "text-gray" : "text-gray"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={20}
          className={`transition-transform text-gray ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 rounded-2xl shadow-lg z-10 overflow-hidden">
          {options.map((option, idx) => (
            <button
              key={option.value ?? idx}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-6 py-4 text-left transition-colors ${
                value === option.value
                  ? "bg-(--dpink) text-white font-medium"
                  : "text-gray hover:bg-(--dpink)/10"
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
