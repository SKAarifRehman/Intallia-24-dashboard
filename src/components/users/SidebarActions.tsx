import React from "react";
import { SearchBar } from "../common/SearchBar";
import { ActionButton } from "../common/ActionButton";

interface SidebarActionsProps {
  actions: {
    variant: "primary" | "outline" | "danger";
    text: string;
    onClick?: () => void;
  }[];
}

const SidebarActions: React.FC<SidebarActionsProps> = ({ actions }) => {
  return (
    <aside className="flex flex-col items-end font-normal sticky top-0 h-full z-10">
      {/* <SearchBar /> */}

      <div className="flex w-[202px] max-w-full flex-col items-stretch text-base text-center tracking-[-0.32px] leading-none justify-center mt-[49px] space-y-5">
        {actions.map((action, index) => (
          <ActionButton
            key={index}
            variant={action.variant}
            onClick={action.onClick}
          >
            {action.text}
          </ActionButton>
        ))}
      </div>
    </aside>
  );
};

export default SidebarActions;
