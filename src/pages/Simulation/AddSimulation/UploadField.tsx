import {
  ChangeEvent,
  InputHTMLAttributes,
  forwardRef,
  useRef,
  useState,
} from "react";
import { useToast } from "@/hooks/use-toast";

interface UploadFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  label: string;
  required?: boolean;
  icon: string;
  placeholder?: string;
  className?: string;
  error?: string;
  accept?: string; // File types to accept, default is image files
  value?: string | null; // External controlled value (base64)
  onChange?: (base64: string | null) => void;
}

export const UploadField = forwardRef<HTMLInputElement, UploadFieldProps>(
  (
    {
      label,
      required = false,
      icon,
      placeholder = "Upload",
      className = "",
      error,
      value,
      onChange,
      accept = "image/*", // Default to image files
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { toast } = useToast();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        resetField();
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive",
        });
        resetField();
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewUrl(base64);
        onChange?.(base64);
      };
      reader.readAsDataURL(file);

      toast({
        variant: "success",
        title: "File selected",
        description: `${file.name} has been selected`,
      });

      // Allow re-selecting the same file
      if (inputRef.current) inputRef.current.value = "";
    };

    const resetField = () => {
      setPreviewUrl(null);
      onChange?.(null);
      if (inputRef.current) inputRef.current.value = "";
    };

    const currentPreview = previewUrl || value;

    return (
      <div className={`flex flex-col items-stretch ${className}`}>
        <div className="flex items-center gap-1">
          <label className="text-[#444446] text-[15px] leading-none tracking-[-0.24px]">
            {label}
          </label>
          {required && <span className="text-[#FF3A3A] text-sm">*</span>}
        </div>

        <label className="cursor-pointer mt-2">
          <div
            className={`flex items-center gap-2 rounded border px-4 py-3.5 min-h-12 text-base text-[#7C7C80] hover:bg-gray-50 transition-colors ${
              error
                ? "border-destructive"
                : "border-[color:var(--grey-grey-00,#E5E5EA)]"
            }`}
          >
            <img
              src={icon}
              alt=""
              className="w-5 aspect-square object-contain shrink-0 my-auto"
            />
            <span className="flex-1 truncate">
              {currentPreview ? "Image selected" : placeholder}
            </span>
            {currentPreview && (
              <div className="w-8 h-8 rounded overflow-hidden">
                <img
                  src={currentPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <input
            accept={accept}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            ref={ref || inputRef}
            {...props}
          />
        </label>

        {error && <span className="text-[#FF3A3A] text-xs mt-1">{error}</span>}
      </div>
    );
  },
);

UploadField.displayName = "UploadField";
