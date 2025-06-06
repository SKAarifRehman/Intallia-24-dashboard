import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/common/Pagination";
import { MainLayout } from "@/components/layout/MainLayout";
import { UserTable } from "@/components/users/UserTable";
import { UserTableActions } from "@/components/users/UserTableActions";
import { users } from "@/data/users";

const Packages: React.FC = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const usersPerPage = 8;

  // NOTE: If you're fetching companies from an API, don't use users.length for total pages
  const totalPages = Math.ceil(users.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;

  return (
    <MainLayout>
      <div className="flex min-h-screen bg-background p-8">
        <main className="flex-1 p-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="page-heading">Packages</h1>
            </div>

            <UserTableActions
              onSearch={setSearchQuery}
              buttonLabel="Add New Package"
              buttonLink={() => navigate("/packages/add-new-package")}
            />

            <div className="bg-white p-6 rounded-lg shadow">
              <UserTable
                startIndex={startIndex}
                endIndex={endIndex}
                searchQuery={searchQuery}
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

export default Packages;
