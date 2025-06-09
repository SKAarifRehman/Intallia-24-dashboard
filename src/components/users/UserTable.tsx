import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import ThreeDotMenu from "@/components/common/ActonModal";
import { DataTable, Column } from "@/components/common/DataTable";
import { User } from "@/types/index";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDeleteUser } from "@/queries/userQueries";

const userColumns: Column<User>[] = [
  { key: "userID", header: "User ID", render: (user) => user.UserId },
  { key: "name", header: "Name", render: (user) => user.UserGroupId },
  { key: "email", header: "Email", render: (user) => user.Email },
  { key: "phone", header: "Phone Number" },
];

interface UserTableProps {
  startIndex: number;
  endIndex: number;
  searchQuery: string;
  users?: User[];
}

export const UserTable = ({ users = [] }: UserTableProps) => {
  const navigate = useNavigate();
  const { mutate: deleteUser } = useDeleteUser();

  const handleEdit = (userId: string | number) => {
    if (!userId) {
      toast.error("UserId is undefined");
      return;
    }
    navigate(`/user/${userId}`);
  };

  const handleDelete = (userId: string | number) => {
    if (!userId) {
      toast.error("UserId is undefined");
      return;
    }
    deleteUser(userId);
  };

  return (
    <DataTable
      data={users}
      columns={userColumns}
      rowKey={(user) => user.UserId}
      selectable
      actions={(user: User) => (
        <ThreeDotMenu
          actions={[
            {
              label: "Edit",
              onClick: () => handleEdit(user.UserId),
            },
            {
              label: "Delete",
              onClick: () => handleDelete(user.UserId),
              className: "text-red-600 hover:bg-red-50",
            },
          ]}
        />
      )}
    />
  );
};

