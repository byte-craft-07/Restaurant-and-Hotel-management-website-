import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export const FieldError = ({ children }) => {
  if (!children) return null;

  return <p className="mt-2 text-sm font-semibold text-red-500">{children}</p>;
};

export const fieldClass = (error, extra = "") =>
  `premium-input w-full p-4 ${
    error ? "border-red-200 bg-red-50/60" : ""
  } ${extra}`.trim();

export const SegmentedControl = ({ options, value, onChange, error }) => {
  return (
    <div
      className={`rounded-[1.4rem] border bg-white p-1.5 shadow-sm ${
        error ? "border-red-200 bg-red-50/60" : "border-slate-200"
      }`}
    >
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => {
          const Icon = option.icon;
          const active = value === option.value;

          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex items-center justify-center gap-2 rounded-[1.1rem] px-4 py-3 font-black transition ${
                active
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "text-slate-500 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {Icon && <Icon size={18} />}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const PremiumSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select option",
  error,
}) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-2xl border bg-white p-4 text-left font-semibold shadow-sm transition ${
          error
            ? "border-red-200 bg-red-50/60 text-red-500"
            : "border-slate-200 text-slate-700 hover:border-orange-200"
        }`}
      >
        <span className={selected ? "text-slate-900" : "text-slate-400"}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-orange-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-2xl border border-white bg-white/95 p-2 shadow-2xl backdrop-blur-2xl">
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-bold transition ${
                  active
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {option.label}
                {active && <Check size={16} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
