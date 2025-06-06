import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  required?: boolean;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  required,
  options,
  value,
  onChange,
  placeholder = "Select...",
  error,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-stretch ${className}`}>
      {(label || required) && (
        <div className="flex items-center gap-1 mb-2">
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
      <Select value={value} onValueChange={onChange} disabled={!options.length}>
        <SelectTrigger className={`items-center rounded border ${
          error
            ? "border-destructive"
            : "border-[color:var(--grey-grey-00,#E5E5EA)]"
        } bg-white flex min-h-12 w-full gap-2 text-base text-[#242426] whitespace-nowrap tracking-[-0.32px] mt-2 px-4 py-3 border-solid  ${className}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={`bg-gradient hover:text-white ${value === option.value ? "bg-gradient1" : ""}`}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <span className="text-[#FF3A3A] text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

export default SelectField;
