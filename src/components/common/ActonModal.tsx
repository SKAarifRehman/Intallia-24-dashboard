import React, { useState, useRef, useEffect } from "react";

export interface ActionMenuAction {
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

interface ActionMenuProps {
  actions?: ActionMenuAction[];
  icon?: React.ReactNode;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ actions, icon }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="text-gray-600 hover:text-black text-2xl px-2 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {icon || "⋮"}
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {actions.map((action, idx) => (
              <button
                key={action.label + idx}
                type="button"
                onClick={() => {
                  action.onClick();
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${action.className || "text-gray-700 hover:bg-gray-100"}`}
                disabled={action.disabled}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
