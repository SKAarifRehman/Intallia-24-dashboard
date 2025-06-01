import React, { useRef } from "react";
import CompanyForm from "./CompanyForm";
import { MainLayout } from "../../components/layout/MainLayout";
import SidebarActions from "../../components/users/SidebarActions";
import { useParams } from "react-router-dom";
import { useDeleteCompany } from "@/queries/companyQueries";

const AddNewCompany: React.FC = () => {
  const { companyId } = useParams();
  const companyFormRef = useRef<{ submit: () => void }>(null);
  const deleteCompanyMutation = useDeleteCompany();

  const handleAddNewCompany = () => {
    companyFormRef.current?.submit();
  };

  const handleSave = () => {
    console.log("Save clicked");
  };

  const baseActions = !companyId
    ? [
        {
          variant: "primary" as const,
          text: "Add New Company",
          onClick: handleAddNewCompany,
        },
      ]
    : [];

  const editActions = companyId
    ? [
        {
          variant: "outline" as const,
          text: "Save & Exit",
          onClick: handleAddNewCompany,
        },
        {
          variant: "outline" as const,
          text: "Save",
          onClick: handleSave,
        },
        {
          variant: "danger" as const,
          text: "Delete",
          onClick: () => { if (companyId) deleteCompanyMutation.mutate(companyId); },
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
          <h1 className="page-heading">Add New Company</h1>

          <div className="shadow-[0px_3.5px_5.5px_0px_rgba(0,0,0,0.02)] bg-white flex items-stretch gap-5 flex-wrap justify-between mt-[30px] px-[45px] py-[31px] rounded-[15px]  h-[88vh] sticky top-0 overflow-y-scroll">
            <CompanyForm ref={companyFormRef} companyId={companyId} />
            <SidebarActions actions={actions} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default AddNewCompany;
