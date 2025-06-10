import {
  ChangeEvent,
  InputHTMLAttributes,
  forwardRef,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

// SVG icons with centered text and smaller font for longer words
const getFileTypeIcon = (fileType: string) => {
  if (fileType.includes("pdf")) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#F87171" />
        <text
          x="50%"
          y="50%"
          fill="white"
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          PDF
        </text>
      </svg>
    );
  }
  if (fileType.includes("json")) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#FBBF24" />
        <text
          x="50%"
          y="50%"
          fill="white"
          fontSize="11"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          JSON
        </text>
      </svg>
    );
  }
  if (fileType.includes("spreadsheet") || fileType.includes("excel")) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#34D399" />
        <text
          x="50%"
          y="50%"
          fill="white"
          fontSize="13"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          XLS
        </text>
      </svg>
    );
  }
  // Generic file SVG
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#E5E7EB" />
      <text
        x="50%"
        y="50%"
        fill="#6B7280"
        fontSize="13"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        FILE
      </text>
    </svg>
  );
};

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

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string>("");

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        resetField();
        return;
      }

      setFileType(file.type);

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please select a file smaller than 5MB",
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

      toast.success("File uploaded", {
        description: `${file.name} has been uploaded successfully`,
      });

      // Allow re-selecting the same file
      if (inputRef.current) inputRef.current.value = "";
    };

    const resetField = () => {
      setPreviewUrl(null);
      setFileType("");
      onChange?.(null);
      if (inputRef.current) inputRef.current.value = "";
    };

    const currentPreview = previewUrl || value;

    // Determine if the file is an image
    const isImage = fileType.startsWith("image/") && currentPreview;

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
            className={`flex items-center justify-between gap-2 rounded border px-4 py-3.5 min-h-12 text-base text-[#7C7C80] hover:bg-gray-50 transition-colors ${
              error
                ? "border-destructive"
                : "border-[color:var(--grey-grey-00,#E5E5EA)]"
            }`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <img
                src={icon}
                alt=""
                className="w-5 aspect-square object-contain shrink-0 my-auto"
              />
              <span className="truncate">
                {currentPreview ? "File Uploaded" : placeholder}
              </span>
            </div>
            {/* File type icon for non-image files */}
            {currentPreview && !isImage && (
              <span className="flex items-center justify-center h-8 w-8 ml-2">
                {getFileTypeIcon(fileType)}
              </span>
            )}
            {/* Image preview */}
            {currentPreview && isImage && (
              <div className="w-8 h-8 rounded overflow-hidden ml-2">
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
