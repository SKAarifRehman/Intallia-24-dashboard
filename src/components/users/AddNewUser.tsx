import React, { useRef } from "react";

import { SearchBar } from "../common/SearchBar";
import { ActionButton } from "../common/ActionButton";
import { UserForm } from "./UserForm";
import { MainLayout } from "../layout/MainLayout";
import SidebarActions from "./SidebarActions";
import { useParams } from "react-router-dom";
import { useDeleteUser } from "@/queries/userQueries";

export const AddNewUser: React.FC = () => {
  const { userId } = useParams();
  console.log("User ID:", userId);

  const userFormRef = useRef<{ submit: () => void }>(null);
  const { mutate: deleteUserMutation } = useDeleteUser();

  const handleAddNewUser = () => {
    userFormRef.current?.submit();
    console.log("Add New User clicked");
  };

  const handleSaveAndExit = () => {
    console.log("Save & Exit clicked");
  };

  const handleSave = () => {
    console.log("Save clicked");
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  const baseActions = !userId
    ? [
        {
          variant: "primary" as const,
          text: "Add New User",
          onClick: handleAddNewUser,
        },
      ]
    : [];

  const editActions = userId
    ? [
        {
          variant: "outline" as const,
          text: "Save & Exit",
          onClick: handleAddNewUser,
        },
        {
          variant: "outline" as const,
          text: "Save",
          onClick: handleSave,
        },
        {
          variant: "danger" as const,
          text: "Delete",
          onClick: () => {
            if (userId) deleteUserMutation(userId);
          },
        },
      ]
    : [];

  const actions: {
    variant: "primary" | "outline" | "danger";
    text: string;
    onClick?: () => void;
  }[] = [...baseActions, ...editActions];

  return (
    <MainLayout>
      <div className="bg-[#F8F9FA] flex items-start gap-[35px] overflow-hidden flex-wrap p-8">
        <div className="flex flex-col items-stretch grow shrink-0 basis-0 w-fit">
          <h1 className="page-heading">Add New User</h1>

          <div className="shadow-[0px_3.5px_5.5px_0px_rgba(0,0,0,0.02)] bg-white flex items-stretch gap-5 flex-wrap justify-between mt-[30px] px-[45px] py-[31px] rounded-[15px] h-[88vh] sticky top-0 overflow-y-scroll">
            <UserForm ref={userFormRef} userId={userId} />
            <SidebarActions actions={actions} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
