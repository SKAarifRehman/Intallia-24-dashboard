import { InputHTMLAttributes, forwardRef } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  className?: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, required, className = "", error, ...props }, ref) => {
    return (
      <div className={`flex flex-col items-stretch ${className}`}>
        <div className="flex items-center gap-1">
          <label className="text-[#444446] text-[15px] leading-none tracking-[-0.24px]">
            {label}
          </label>
          {required && (
            <span className="text-[#FF3A3A] text-sm leading-none">*</span>
          )}
        </div>
        <input
          className={`self-stretch flex-1 shrink basis-[0%] rounded border ${
            error
              ? "border-destructive"
              : "border-[color:var(--grey-grey-00,#E5E5EA)]"
          } bg-white min-h-12 w-full gap-2 text-base text-[#7C7C80] tracking-[-0.32px] leading-none mt-2 px-4 py-3.5 border-solid outline-none`}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? "textfield-error" : undefined}
          {...props}
        />
        {error && (
          <span id="textfield-error" className="text-[#FF3A3A] text-xs mt-1">
            {error}
          </span>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";
