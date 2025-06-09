import { ActionButton } from "@/components/common/ActionButton";
import Pagination from "@/components/common/Pagination";
import { MainLayout } from "@/components/layout/MainLayout";
import { UserTable } from "@/components/users/UserTable";
import { UserTableActions } from "@/components/users/UserTableActions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { exportToExcel, exportToPDF } from "@/utils";
import { useUser } from "@/queries/userQueries";

const UserManagement = () => {
  const navigate = useNavigate();
  const { data: users = [] } = useUser();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const usersPerPage = 8;
  const totalPages = Math.ceil(users?.LookupData?.length / usersPerPage); // Ensure correct pagination

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = Math.min(startIndex + usersPerPage);

  //Export and Download User Data
  const columns = ["UserId", "UserGroupId", "Email", "Phone"];
  const body = users?.LookupData?.map((user) => ({
    UserId: user.UserId ?? "",
    UserGroupId: user.UserGroupId ?? "",
    Email: user.Email ?? "",
    Phone: user.Phone ?? "",
  }));

  return (
    <MainLayout>
      <div className="flex min-h-screen bg-background">
        <main className="flex-1 p-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="page-heading">User Management (Users)</h1>
            </div>

            <UserTableActions
              onSearch={setSearchQuery}
              handleDownload={() => exportToPDF(columns, body, "UserList")}
              exportInExcel={() => exportToExcel(columns, body, "UserList")}
              buttonLink={() => navigate("/user/add-new-user")}
              buttonLabel="Add New User"
            />

            <div className="bg-white p-6 rounded-lg">
              <UserTable
                startIndex={startIndex}
                endIndex={endIndex}
                searchQuery={searchQuery}
                users={users?.LookupData}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default UserManagement;
