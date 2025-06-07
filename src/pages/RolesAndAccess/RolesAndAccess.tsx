import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/common/Pagination";
import { MainLayout } from "@/components/layout/MainLayout";
import { UserTableActions } from "@/components/users/UserTableActions";
import RolesAndAccessTable from "./RolesAndAccessTable";
import { autoTable } from "jspdf-autotable";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const fetchRolesAndAccess = async () => {
  const payload = {
    ScreenName: "UserGroup",
    LookUpKey: "GetList",
    Filter1: "",
    Filter2: "",
    Filter3: "",
    Filter4: "",
    Filter5: "",
  };

  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/GETLookupData`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.LookupData || [];
};

const usersPerPage = 8;

const RolesAndAccess = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Use React Query for data fetching
  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userGroups"],
    queryFn: fetchRolesAndAccess,
  });

  // Filtering
  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item?.UserGroupId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.Description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = filteredData.slice(startIndex, endIndex);

  // Export PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const headers = ["UserGroupId", "CompanyId", "Description", "Status"];
    const body = (filteredData || []).map((usergroup) => [
      usergroup.UserGroupId ?? "",
      usergroup.CompanyId ?? "",
      usergroup.Description ?? "",
      usergroup.Status ?? "",
    ]);
    autoTable(doc, {
      head: [headers],
      body,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [13, 175, 220] },
    });
    doc.save("usergroup.pdf");
  };

  // Export Excel
  const exportInExcel = () => {
    const headers = ["UserGroupId", "CompanyId", "Description", "Status"];
    const worksheet = XLSX.utils.json_to_sheet(filteredData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserGroups");
    XLSX.writeFile(workbook, "usergroups.xlsx");
  };

  return (
    <MainLayout>
      <div className="flex min-h-screen bg-background">
        <main className="flex-1 p-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="page-heading">Roles And Access</h1>
              {/* <ActionButton
                variant="primary"
                onClick={() => navigate("/add-role")}
              >
                Add New Role
              </ActionButton> */}
            </div>

            <UserTableActions
              onSearch={setSearchQuery}
              exportInExcel={exportInExcel}
              handleDownload={handleDownloadPDF}
            />

            <div className="bg-white p-6 rounded-lg">
              {isLoading ? (
                <p>Loading...</p>
              ) : isError ? (
                <p className="text-red-500">
                  {error instanceof Error ? error.message : "Failed to fetch data."}
                </p>
              ) : (
                <>
                  <RolesAndAccessTable
                    users={paginatedUsers}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    searchQuery={searchQuery}
                  />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default RolesAndAccess;
