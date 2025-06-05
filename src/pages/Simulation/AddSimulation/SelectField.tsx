import { forwardRef, SelectHTMLAttributes } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
  className?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      required,
      options = [],
      error,
      placeholder = "Select",
      className = "",
      ...props
    },
    ref,
  ) => (
    <div className={`flex flex-col items-stretch `}>
      {(label || required) && (
        <div className="flex items-center gap-1">
          {label && (
            <label className="text-[#444446] text-[15px] leading-none tracking-[-0.24px]">
              {label}
            </label>
          )}
          {required && (
            <span className="text-[#FF3A3A] text-sm leading-none">*</span>
          )}
        </div>
      )}
      <div
        className={`items-center rounded border ${
          error
            ? "border-destructive"
            : "border-[color:var(--grey-grey-00,#E5E5EA)]"
        } bg-white flex min-h-12 w-full gap-2 text-base text-[#7C7C80] whitespace-nowrap tracking-[-0.32px] leading-none mt-2 px-4 py-3 border-solid ${className}`}
      >
        <select
          className={`flex-1 bg-white outline-none border-none shadow-none w-full text-base text-[#444446] leading-none tracking-[-0.24px]`}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? "select-error" : undefined}
          {...props}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <span id="select-error" className="text-[#FF3A3A] text-xs mt-1">
          {error}
        </span>
      )}
    </div>
  ),
);

SelectField.displayName = "SelectField";
