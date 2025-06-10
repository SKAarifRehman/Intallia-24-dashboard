import React, { useEffect, useState, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getScreen, getRoleById } from "@/http/api";
import { useUpdateRole } from "@/queries/rolesAndAccessQueries";
import SidebarActions from "@/components/users/SidebarActions";
import { toast } from "sonner";

interface ChildScreen {
  ScreenId: string;
  ScreenName: string;
  ParentName: string;
  UserGroupId: string;
  ReadPermission: boolean;
  WritePermission: boolean;
  DeletePermission: boolean;
  CreateBy?: string;
  CreateDate?: string;
  ModifyBy?: string;
  ModifyDate?: string;
  [key: string]: any;
}

interface ParentScreen {
  ScreenId: string;
  ScreenName: string;
  ParentName: string;
  ScreenNameData: ChildScreen[];
}

const UserGroupDetails: React.FC = () => {
  const { UserGroupId } = useParams<{ UserGroupId: string }>();
  const storedCompanyId = localStorage.getItem("CompanyId");
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const [enabledScreens, setEnabledScreens] = useState<{ [key: string]: boolean }>({});
  const [formValues, setFormValues] = useState({
    UserGroupId: "",
    CompanyId: "",
    Description: "",
    UserGroupType: "",
  });

  const payload = {
    JSON: JSON.stringify({
      Header: [{ UserGroupId: UserGroupId, CompanyId: storedCompanyId }],
      Response: [{ ResponseText: "", ErrorCode: "" }],
    }),
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userGroupDetails", UserGroupId],
    queryFn: async () => {
      const [screenData, permissionData] = await Promise.all([
        getScreen(payload!),
        getRoleById(payload!),
      ]);
      return {
        screenData: screenData || [],
        permissionData: permissionData?.Details || [],
        header: permissionData?.Header?.[0] || {},
      };
    },
    enabled: !!UserGroupId,
    staleTime: 0,
  });

  function mergeScreenDataWithPermissions(screenData: ParentScreen[], permissionDetails: any[]) {
    if (!Array.isArray(screenData) || !Array.isArray(permissionDetails)) return [];
    const permMap = new Map(permissionDetails.map((p: any) => [p.ScreenId, p]));
    return screenData.map((parent) => ({
      ...parent,
      ScreenNameData: parent.ScreenNameData.map((child) => ({
        ...child,
        ...(permMap.get(child.ScreenId) || {}),
      })),
    }));
  }

  const [permissions, setPermissions] = useState<{ [screenId: string]: ChildScreen }>({});

  useEffect(() => {
    if (!data) return;
    const merged = mergeScreenDataWithPermissions(data.screenData, data.permissionData);
    const flat: { [screenId: string]: ChildScreen } = {};
    merged.forEach((parent) => {
      parent.ScreenNameData.forEach((child) => {
        flat[child.ScreenId] = { ...child };
      });
    });
    setPermissions(flat);
  }, [data]);

  const mergedScreenData = mergeScreenDataWithPermissions(
    data?.screenData || [],
    data?.permissionData || []
  );

  useEffect(() => {
    if (!mergedScreenData.length) return;
    setEnabledScreens((prev) => {
      const newEnabled: { [key: string]: boolean } = {};
      mergedScreenData.forEach((parent) => {
        if (!(parent.ScreenId in prev)) {
          newEnabled[parent.ScreenId] = true;
        }
      });
      if (Object.keys(newEnabled).length === 0) return prev;
      return { ...prev, ...newEnabled };
    });
  }, [mergedScreenData.length]);

  const handlePermissionChange = (
    screenId: string,
    perm: "ReadPermission" | "WritePermission" | "DeletePermission"
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [screenId]: {
        ...prev[screenId],
        [perm]: !prev[screenId][perm],
      },
    }));
  };

  const {
    mutate: updatePermissions,
    isPending,
    isError: isSubmitError,
    error,
  } = useUpdateRole({
    onSuccess: () => {
      toast.success("Permissions updated successfully!");
      navigate(-1);
      // Optionally: navigate("/user-role-&-access");
    },
    onError: () => {
      toast.error("Failed to update permissions.");
    },
  });

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const headerData = data?.header || formValues;
    const createDate = headerData.CreateDate;
    const modifyDate = new Date().toISOString();

    const headerPayload = [
      {
        UserGroupId: headerData.UserGroupId || formValues.UserGroupId,
        CompanyId: headerData.CompanyId || formValues.CompanyId,
        Description: headerData.Description || formValues.Description,
        UsewrGroupType: headerData.UsewrGroupType || formValues.UserGroupType,
        CreateBy: headerData.CreateBy || formValues.UserGroupId,
        CreateDate: createDate,
        ModifyBy: formValues.UserGroupId || headerData.ModifyBy,
        ModifyDate: modifyDate,
        Intallia1: null,
        Intallia2: null,
        Intallia3: null,
        Intallia4: null,
        Intallia5: null,
        Intallia6: null,
        Intallia7: null,
        Intallia8: null,
        Intallia9: null,
        Intallia10: null,
        Intallia11: null,
        Intallia12: null,
        Intallia13: null,
        Intallia14: null,
        Intallia15: null,
      },
    ];

    const detailsPayload = Object.values(permissions).map((child) => ({
      UserGroupId: headerData.UserGroupId || formValues.UserGroupId,
      CompanyId: headerData.CompanyId || formValues.CompanyId,
      ScreenId: child.ScreenId,
      ReadPermission: !!child.ReadPermission,
      WritePermission: !!child.WritePermission,
      DeletePermission: !!child.DeletePermission,
      CreateBy: child.CreateBy || headerData.UserGroupId || formValues.UserGroupId,
      CreateDate: createDate,
      ModifyBy: formValues.UserGroupId || headerData.ModifyBy,
      ModifyDate: modifyDate,
      Intallia1: null,
      Intallia2: null,
      Intallia3: null,
      Intallia4: null,
      Intallia5: null,
      Intallia6: null,
      Intallia7: null,
      Intallia8: null,
      Intallia9: null,
      Intallia10: null,
      Intallia11: null,
      Intallia12: null,
      Intallia13: null,
      Intallia14: null,
      Intallia15: null,
    }));

    const responsePayload = [
      {
        ResponseText: "",
        ErrorCode: "",
      },
    ];

    const payload = {
      JSON: JSON.stringify({
        Header: headerPayload,
        Details: detailsPayload,
        Response: responsePayload,
      }),
    };

    updatePermissions(payload);
  };

  const handleSidebarEdit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <MainLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="page-heading mb-12">User Group Permissions</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-10 max-w-4xl flex-1"
          >
            {isLoading ? (
              <div>Loading...</div>
            ) : isError ? (
              <div className="text-red-600">Error loading permissions.</div>
            ) : (
              mergedScreenData.map((parent) => (
                <div
                  key={parent.ScreenId}
                  className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-lg font-semibold text-gray-800 flex items-center gap-2 cursor-pointer"
                      onClick={() =>
                        setEnabledScreens((prev) => ({
                          ...prev,
                          [parent.ScreenId]: !prev[parent.ScreenId],
                        }))
                      }
                    >
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${
                          enabledScreens[parent.ScreenId] ? "rotate-90" : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                      </svg>
                      {parent.ScreenName}
                    </span>
                  </div>

                  {enabledScreens[parent.ScreenId] && (
                    <ul className="mt-4 space-y-3">
                      {parent.ScreenNameData.map((child) => (
                        <li
                          key={child.ScreenId}
                          className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <span className="text-gray-700 font-medium">{child.ScreenName}</span>
                          <div className="flex gap-6">
                            {(["ReadPermission", "WritePermission", "DeletePermission"] as const).map(
                              (perm) => (
                                <label key={perm} className="flex items-center gap-1 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!permissions[child.ScreenId]?.[perm]}
                                    onChange={() => handlePermissionChange(child.ScreenId, perm)}
                                    className="cursor-pointer"
                                  />
                                  <span>{perm.replace("Permission", "")}</span>
                                </label>
                              )
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}

            {isSubmitError && (
              <div className="text-red-600 mt-2">
                {error instanceof Error ? error.message : "Submission failed"}
              </div>
            )}
          </form>

          {/* Sidebar Actions */}
          <div className="w-full md:w-[202px] max-w-full flex flex-col items-end">
            <SidebarActions
              actions={[
                {
                  variant: "primary",
                  text: isPending ? "Saving..." : "Edit Role",
                  onClick: handleSidebarEdit,
                },
                {
                  variant: "outline",
                  text: "Back",
                  onClick: handleBack,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserGroupDetails;
