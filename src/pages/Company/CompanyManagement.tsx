import { ActionButton } from "@/components/common/ActionButton";
import Pagination from "@/components/common/Pagination";
import { MainLayout } from "@/components/layout/MainLayout";
import { CTable } from "@/pages/Company/CTable";
import { UserTableActions } from "@/components/users/UserTableActions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Company } from "@/types";
import { useCompanies } from "@/queries/companyQueries";
import { exportToExcel, exportToPDF } from "@/utils";

const CompanyManagement = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch companies
  const { data: companies, isLoading, isError } = useCompanies();

  // Filter companies by search query
  const filteredCompanies =
    companies?.LookupData?.filter((company: Company) => {
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

  const displayedCompanies: Company[] = filteredCompanies.slice(
    startIndex,
    endIndex,
  );

  const headers = [
    "CompanyId",
    "CompanyName",
    "Email",
    "PhoneNumber",
    "Status",
    "Website",
  ];

  const body = filteredCompanies.map((company: Company) => ({
    CompanyId: company.CompanyId ?? "",
    CompanyName: company.CompanyName ?? "",
    Email: company.Email ?? "",
    PhoneNumber: company.PhoneNumber ?? "",
    Status: company.Status ?? "",
    Website: company.Website ?? "",
  }));

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
              exportInExcel={() => exportToExcel(headers, body, "companies")}
              handleDownload={() => exportToPDF(headers, body, "companies")}
              buttonLink={() => navigate("/company/add-new-company")}
              buttonLabel="Add New Company"
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
