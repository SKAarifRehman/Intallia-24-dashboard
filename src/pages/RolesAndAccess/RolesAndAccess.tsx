import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/common/Pagination";
import { MainLayout } from "@/components/layout/MainLayout";
import { UserTableActions } from "@/components/users/UserTableActions";
import RolesAndAccessTable from "./RolesAndAccessTable";
import { autoTable } from "jspdf-autotable";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

const RolesAndAccess = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const usersPerPage = 8;

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
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
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      console.log(response);

      setData(response.data.LookupData || []);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item?.UserGroupId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.Description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = filteredData.slice(startIndex, endIndex);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Define the columns you want in the PDF and their order
    const headers = ["UserGroupId", "CompanyId", "Description", "Status"];

    // Map your data to match the header order

    const body = (filteredData || []).map((usergroup: UserGroup) => [
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

  const exportInExcel = () => {
    // Define the columns you want in the Excel and their order
    const headers = ["UserGroupId", "CompanyId", "Description", "Status"];

    // Prepare data rows
    // const data = (filteredData || []).map((usergroup: UserGroup) => ({
    //   UserGroupId: usergroup.UserGroupId ?? "",
    //   CompanyId: usergroup.CompanyId ?? "",
    //   Description: usergroup.Description ?? "",
    //   Status: usergroup.Status ?? "",
    // }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserGroups");

    // Export to Excel file
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
              >v
+
                Add New Role
              </ActionButton> */}
            </div>

            {/* <UserTableActions onSearch={setSearchQuery} /> */}

            <UserTableActions
              onSearch={setSearchQuery}
              exportInExcel={exportInExcel}
              handleDownload={handleDownloadPDF}
            />
            <div className="bg-white p-6 rounded-lg">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
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
