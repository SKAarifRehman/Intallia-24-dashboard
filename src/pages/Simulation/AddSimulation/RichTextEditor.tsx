import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
interface RichTextEditorProps {
  label: string;
  required?: boolean;
  onChange?: (value: string) => void;
  defaultValue?: string;
}

// Toolbar configuration (updated)
const toolbarConfig = [
  [{ header: [1, 2, 3, false] }], // Heading options
  ["bold", "italic", "underline", "strike"], // Inline styles
  [{ list: "ordered" }, { list: "bullet" }], // Lists
  [{ align: [] }], // Alignment buttons
  ["blockquote", "code-block"], // Quote & Code
  ["link", "image"], // Link and Image
  ["undo", "redo"], // History
];

export const RichTextEditorField = ({
  label,
  required,
  onChange,
  defaultValue = "",
}: RichTextEditorProps) => {
  const [value, setValue] = useState(defaultValue || "");

  // Call onChange when the value changes
  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  return (
    <div className="w-full mt-5">
      <div className="flex items-center gap-1 mb-2">
        <label className="text-[#444446] text-[15px] leading-none tracking-[-0.24px]">
          {label}
        </label>
        {required && (
          <span className="text-[#FF3A3A] text-sm leading-none">*</span>
        )}
      </div>
      <div className="rte-wrapper">
        <ReactQuill
          value={value}
          onChange={setValue}
          className="rte-editor"
          placeholder="Tell a story..."
          modules={{ toolbar: toolbarConfig }}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "strike",
            "list",
            "bullet",
            "align",
            "blockquote",
            "code-block",
            "link",
            "image",
          ]}
        />
      </div>
      <style>{`
        .rte-editor .ql-editor {
          min-height: 150px;
          padding: 0.5rem;
        }
        .rte-wrapper .ql-toolbar {
          border-bottom: 1px solid #E5E5EA;
          margin-bottom: 0.5rem;
        }
        .rte-wrapper {
          border: 1px solid #E5E5EA;
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
};
