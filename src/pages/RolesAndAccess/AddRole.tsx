import React, { useEffect, useRef, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import SidebarActions from "@/components/users/SidebarActions";
import {
  useUserGroupScreens,
  useCreateUserGroupScreens,
  ParentScreen,
} from "@/queries/rolesAndAccessQueries";

// Zod schema for permissions as an array
const roleSchema = z.object({
  userGroupId: z.string().min(1, "User Group ID is required"),
  userGroupType: z.string().min(1, "User Group Type is required"),
  companyId: z.string().min(1, "Company ID is required"),
  description: z.string().min(1, "Description is required"),
  permissions: z.array(
    z.object({
      ScreenId: z.string(),
      ReadPermission: z.boolean(),
      WritePermission: z.boolean(),
      DeletePermission: z.boolean(),
    })
  ),
});

type RoleFormValues = z.infer<typeof roleSchema>;

const AddRole: React.FC = () => {
  const storedUserGroupId = localStorage.getItem("userGroupId") || "";
  const storedCompanyId = localStorage.getItem("companyId") || "Intallia24";
  const navigate = useNavigate();
  const [enabledScreens, setEnabledScreens] = useState<{ [key: string]: boolean }>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Use the exported query hook
  const {
    data: rawScreenData,
    isLoading,
    isError,
  } = useUserGroupScreens(storedUserGroupId, storedCompanyId);

  console.log("Raw Screen Data:", rawScreenData);

  // Always use an array for screenData
  const screenData = rawScreenData || [];


  // Build default permissions state as an array
  const defaultPermissions =
    screenData.flatMap((parent) =>
      Array.isArray(parent.ScreenNameData)
        ? parent.ScreenNameData.map((child) => ({
            ScreenId: child.ScreenId,
            ReadPermission: child.ReadPermission,
            WritePermission: child.WritePermission,
            DeletePermission: child.DeletePermission,
          }))
        : []
    );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      userGroupId: storedUserGroupId,
      userGroupType: "Admin",
      companyId: storedCompanyId,
      description: "",
      permissions: defaultPermissions,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    setValue("permissions", defaultPermissions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenData.length]);

  const permissions = watch("permissions");

  // Use the exported mutation hook
  const {
    mutate,
    isPending,
    isSuccess,
    isError: isSubmitError,
    error,
  } = useCreateUserGroupScreens();

  const onSubmit = (data: RoleFormValues) => {
    const headerPayload = [
      {
        UserGroupId: data.userGroupId,
        CompanyId: data.companyId,
        Description: data.description,
        UsewrGroupType: data.userGroupType,
        CreateBy: data.userGroupId,
        CreateDate: new Date().toISOString(),
        ModifyBy: data.userGroupId,
        ModifyDate: new Date().toISOString(),
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

    // Use the permissions array directly
    const detailsPayload = data.permissions.map((perms) => ({
      UserGroupId: data.userGroupId,
      CompanyId: data.companyId,
      ScreenId: perms.ScreenId,
      ReadPermission: perms.ReadPermission,
      WritePermission: perms.WritePermission,
      DeletePermission: perms.DeletePermission,
      CreateBy: data.userGroupId,
      CreateDate: new Date().toISOString(),
      ModifyBy: data.userGroupId,
      ModifyDate: new Date().toISOString(),
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

    mutate(payload, {
      onSuccess: () => {
        navigate("/user-role-&-access");
      },
      onError: () => {
        alert("Failed to create user group.");
      },
    });
  };

  // Handler for sidebar submit button
  const handleSidebarSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  // Handler for sidebar back button
  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading screen data.</div>;

  return (
    <MainLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="page-heading mb-12">Add User Group</h1>
        <div className="flex flex-col md:flex-row gap-12">
          {/* Main Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-10 max-w-4xl flex-1"
          >
            {/* Two-column grid for form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[15px] text-[#444446] flex gap-1" htmlFor="userGroupId">
                  User Group ID <span className="text-[#FF3A3A] text-sm">*</span>
                </label>
                <Controller
                  name="userGroupId"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="userGroupId"
                      type="text"
                      placeholder="Enter User Group ID"
                      className="rounded border px-4 py-3.5 min-h-12 bg-white border-[#E5E5EA] w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  )}
                />
                {errors.userGroupId && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.userGroupId.message}
                  </span>
                )}
              </div>

              <div>
                <label className="text-[15px] text-[#444446] flex gap-1" htmlFor="companyId">
                  Company ID <span className="text-[#FF3A3A] text-sm">*</span>
                </label>
                <Controller
                  name="companyId"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="companyId"
                      type="text"
                      placeholder="Enter Company ID"
                      className="rounded border px-4 py-3.5 min-h-12 bg-white border-[#E5E5EA] w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  )}
                />
                {errors.companyId && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.companyId.message}
                  </span>
                )}
              </div>

              <div>
                <label className="text-[15px] text-[#444446] flex gap-1" htmlFor="description">
                  Description <span className="text-[#FF3A3A] text-sm">*</span>
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="description"
                      type="text"
                      placeholder="Enter Description"
                      className="rounded border px-4 py-3.5 min-h-12 bg-white border-[#E5E5EA] w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  )}
                />
                {errors.description && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div>
                <label className="text-[15px] text-[#444446] flex gap-1" htmlFor="userGroupType">
                  User Group Type <span className="text-[#FF3A3A] text-sm">*</span>
                </label>
                <Controller
                  name="userGroupType"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="userGroupType"
                      className="rounded border px-4 py-3.5 min-h-12 bg-white border-[#E5E5EA] w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      <option value="">Select User Group Type</option>
                      <option value="Admin">Admin</option>
                      <option value="B2C">B2C</option>
                    </select>
                  )}
                />
                {errors.userGroupType && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.userGroupType.message}
                  </span>
                )}
              </div>
            </div>

            {/* Screen Permissions */}
            {screenData.map((parent) => (
              <div
                key={parent.ScreenId}
                className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setEnabledScreens((prev) => ({
                      ...prev,
                      [parent.ScreenId]: !prev[parent.ScreenId],
                    }))
                  }
                >
                  <span className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${
                        enabledScreens[parent.ScreenId] ? "rotate-90" : "rotate-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    {parent.ScreenName}
                  </span>
                </div>

                {enabledScreens[parent.ScreenId] && (
                  <ul className="mt-4 space-y-3">
                    {parent.ScreenNameData.map((child) => {
                      // Find the index of this child in the permissions array
                      const idx = permissions.findIndex((p) => p.ScreenId === child.ScreenId);
                      if (idx === -1) return null;
                      return (
                        <li
                          key={child.ScreenId}
                          className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-3"
                        >
                          <span className="text-gray-700 font-medium">
                            {child.ScreenName}
                          </span>
                          <div className="flex gap-6">
                            {(
                              [
                                "ReadPermission",
                                "WritePermission",
                                "DeletePermission",
                              ] as const
                            ).map((perm) => (
                              <Controller
                                key={perm}
                                name={`permissions.${idx}.${perm}`}
                                control={control}
                                render={({ field }) => (
                                  <label className="flex items-center gap-1 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={field.value || false}
                                      onChange={() => field.onChange(!field.value)}
                                      className="cursor-pointer accent-blue-600"
                                    />
                                    <span>{perm.replace("Permission", "")}</span>
                                  </label>
                                )}
                              />
                            ))}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}

            {/* Error/Success messages */}
            {isSubmitError && (
              <div className="text-red-600 mt-2 text-sm">
                {error instanceof Error ? error.message : "Submission failed"}
              </div>
            )}
            {isSuccess && (
              <div className="text-green-600 mt-2 text-sm">
                User group created successfully!
              </div>
            )}
          </form>

          {/* Sidebar Actions */}
          <SidebarActions
            actions={[
              {
                variant: "primary",
                text: isPending ? "Submitting..." : "Add Role",
                onClick: handleSidebarSubmit,
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
    </MainLayout>
  );
};

export default AddRole;
