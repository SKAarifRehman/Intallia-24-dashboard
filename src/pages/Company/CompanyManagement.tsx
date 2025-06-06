import { ActionButton } from "@/components/common/ActionButton";
import Pagination from "@/components/common/Pagination";
import { MainLayout } from "@/components/layout/MainLayout";
import { CTable } from "@/pages/Company/CTable";
import { UserTableActions } from "@/components/users/UserTableActions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Company } from "@/types";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useCompanies } from "@/queries/companyQueries";

const CompanyManagement = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch companies
  const {
    data: companies,
    isLoading,
    isError,
  } = useCompanies();

  // Filter companies by search query
  const filteredCompanies = companies?.LookupData?.filter((company: Company) => {
    const searchStr = searchQuery.toLowerCase();
    return (
      company.CompanyId?.toLowerCase().includes(searchStr) ||
      company.CompanyName?.toLowerCase().includes(searchStr) ||
      company.Email?.toLowerCase().includes(searchStr) ||
      company.PhoneNumber?.toLowerCase().includes(searchStr)
    );
  }) || [];

  const rowPerPage = 8;
  const totalPages = Math.ceil(filteredCompanies.length / rowPerPage);
  const startIndex = (currentPage - 1) * rowPerPage;
  const endIndex = startIndex + rowPerPage;

  const displayedCompanies: Company[] = filteredCompanies.slice(startIndex, endIndex);

  const exportInExcel = () => {
    const headers = [
      "CompanyId",
      "CompanyName",
      "Email",
      "Phone Number",
      "Status",
      "Website",
    ];

    const data = filteredCompanies.map((company: Company) => ({
      CompanyId: company.CompanyId ?? "",
      CompanyName: company.CompanyName ?? "",
      Email: company.Email ?? "",
      "Phone Number": company.PhoneNumber ?? "",
      Status: company.Status ?? "",
      Website: company.Website ?? "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");
    XLSX.writeFile(workbook, "companies.xlsx");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const headers = [
      "CompanyId",
      "CompanyName",
      "Email",
      "Phone Number",
      "Status",
      "Website",
    ];

    const body = filteredCompanies.map((company: Company) => [
      company.CompanyId ?? "",
      company.CompanyName ?? "",
      company.Email ?? "",
      company.PhoneNumber ?? "",
      company.Status ?? "",
      company.Website ?? "",
    ]);

    autoTable(doc, {
      head: [headers],
      body,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [13, 175, 220] },
    });

    doc.save("companies.pdf");
  };

  return (
    <MainLayout>
      <div className="flex p-8 min-h-screen bg-background">
        <main className="flex-1">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="page-heading">User Management (Company)</h1>
            </div>
            <UserTableActions
              onSearch={setSearchQuery}
              exportInExcel={exportInExcel}
              handleDownload={handleDownloadPDF}
            />
            <div className="bg-white p-6 rounded-lg">
              {isLoading && <div>Loading...</div>}
              {isError && <div>Error loading companies.</div>}
              {!isLoading && !isError && (
                <>
                  <CTable
                    searchQuery={searchQuery}
                    companies={displayedCompanies}
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

export default CompanyManagement;
