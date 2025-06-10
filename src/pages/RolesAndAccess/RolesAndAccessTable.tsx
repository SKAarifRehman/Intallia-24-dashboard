import { Link, useNavigate } from "react-router-dom";
import { DataTable, Column } from "@/components/common/DataTable";
import ActionMenu from "@/components/common/ActonModal";
import { Roles } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteRole } from "@/queries/rolesAndAccessQueries";
import { toast } from "sonner";

const userColumns: Column<Roles>[] = [
  {
    key: "UserGroupId",
    header: "User Group ID",
    render: (user) => (
      <Link
        to={`/user-role-&-access/${user.UserGroupId}`}
        className="text-blue-600 hover:underline"
      >
        {user.UserGroupId}
      </Link>
    ),
  },
  { key: "CompanyId", header: "Company ID", render: (user) => user.CompanyId },
  {
    key: "Description",
    header: "Description",
    render: (user) => user.Description,
  },
];

interface RolesAndAccessTableProps {
  startIndex: number;
  endIndex: number;
  searchQuery: string;
  users?: Roles[];
}

const RolesAndAccessTable = ({
  startIndex,
  endIndex,
  searchQuery,
  users = [],
}: RolesAndAccessTableProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteUserGroupMutation = useDeleteRole({
    onSuccess: () => {
      toast.success("User group deleted");
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
    },
    onError: () => {
      toast.error("Failed to delete user group");
    },
  });

  const handleEdit = (userGroupId: string) => {
    navigate(`/user-role-&-access/${userGroupId}`);
  };

  const getRowActions = (user: Roles) => {
    if (!user || !user.UserGroupId) return null;
    return (
      <ActionMenu
        actions={[
          {
            label: "Edit",
            onClick: () => handleEdit(user.UserGroupId),
          },
          {
            label: "Delete",
            onClick: () =>
              deleteUserGroupMutation.mutate({
                userGroupId: user.UserGroupId,
                companyId: user.CompanyId,
              }),
            className: "text-red-600 hover:bg-red-50",
          },
        ]}
      />
    );
  };

  return (
    <DataTable
      data={users}
      columns={userColumns}
      rowKey={(user) => user.UserGroupId}
      selectable
      actions={getRowActions}
    />
  );
};

export default RolesAndAccessTable;
