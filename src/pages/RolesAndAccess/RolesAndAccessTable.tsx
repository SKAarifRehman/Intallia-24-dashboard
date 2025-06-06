import { Badge } from "@/components/ui/badge";
import ThreeDotMenu from "@/components/common/ActonModal";
import { DataTable, Column } from "@/components/common/DataTable";
import { Roles } from "@/types";
import { Link, useLocation } from "react-router-dom";

const RolesAndAccessTable = ({
  startIndex,
  endIndex,
  searchQuery,
  users = [],
}: {
  startIndex: number;
  endIndex: number;
  searchQuery: string;
  users?: Roles[];
}) => {
  const location = useLocation();
  const isUserRoleAccessRoute = location.pathname === "/user-role-&-access";

  const userColumns: Column<Roles>[] = [
    {
      key: "UserGroupId",
      header: "User Group ID",
      render: (user) =>
        isUserRoleAccessRoute ? (
          <Link to={`/user-role-&-access/${user.UserGroupId}`} className="text-blue-600 hover:underline">
            {user.UserGroupId}
          </Link>
        ) : (
          user.UserGroupId
        ),
    },
    { key: "CompanyId", header: "Company ID", render: (user) => user.CompanyId },
    { key: "Description", header: "Description", render: (user) => user.Description },
  ];

  return (
    <DataTable
      data={users}
      columns={userColumns}
      rowKey={(user) => user.UserGroupId}
      selectable
      actions={() => <ThreeDotMenu />}
    />
  );
};

export default RolesAndAccessTable;
