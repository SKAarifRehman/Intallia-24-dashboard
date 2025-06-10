import { MainLayout } from "@/components/layout/MainLayout";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoleById, createRole, updateRole } from "@/http/api";
import SidebarActions from "@/components/users/SidebarActions";
import { AccessControl } from "./AccessControl";

const roleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  companyName: z.string().min(1, "Company Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  role: z.string().min(1, "Role is required"),
  description: z.string().optional(),
  accessControls: z.object({
    userManagement: z.boolean(),
    simulation: z.boolean(),
    package: z.boolean(),
    payment: z.boolean(),
  }),
});

type RoleFormValues = z.infer<typeof roleSchema>;

const defaultValues: RoleFormValues = {
  name: "",
  companyName: "",
  email: "",
  phone: "",
  role: "",
  description: "",
  accessControls: {
    userManagement: true,
    simulation: true,
    package: true,
    payment: false,
  },
};

export const RoleForm: FC = () => {
  const { UserGroupId: id } = useParams<{ UserGroupId: string }>();\
  const storedCompanyId = localStorage.getItem("companyId");
  console.log(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: roleData, isLoading } = useQuery({
    queryKey: ["UserGroupId", id],
    queryFn: () =>
      getRoleById({
        JSON: JSON.stringify({
          Header: [{ UserGroupId: id, CompanyId: storedCompanyId }],
          Response: [{ ResponseText: "", ErrorCode: "" }],
        }),
      }),
    enabled: false,
  });

  console.log(roleData);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues,
  });

  useEffect(() => {
    if (roleData) {
      reset({
        ...roleData,
        accessControls: {
          userManagement: roleData.accessControls?.userManagement ?? true,
          simulation: roleData.accessControls?.simulation ?? true,
          package: roleData.accessControls?.package ?? true,
          payment: roleData.accessControls?.payment ?? false,
        },
      });
    }
  }, [roleData, reset]);

  const createMutation = useMutation({
    mutationFn: (data: RoleFormValues) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      navigate("/user-role-&-access");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: RoleFormValues) => updateRole(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      navigate("/user-role-&-access");
    },
  });

  const handleAddNewRole = (data: RoleFormValues) => {
    if (id) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const accessControls = watch("accessControls");
  const setAccessControl = (
    key: keyof RoleFormValues["accessControls"],
    value: boolean,
  ) => {
    setValue(`accessControls.${key}`, value, { shouldDirty: true });
  };

  const actions = [
    {
      variant: "primary" as const,
      text: id ? "Update Role" : "Add New Role",
      onClick: handleSubmit(handleAddNewRole),
    },
    {
      variant: "outline" as const,
      text: "Save & Exit",
      onClick: handleSubmit(handleAddNewRole),
    },
    {
      variant: "outline" as const,
      text: "Save",
      onClick: handleSubmit(handleAddNewRole),
    },
    {
      variant: "danger" as const,
      text: "Delete",
      onClick: () => alert("Delete clicked"),
    },
  ];

  return (
    <MainLayout>
      <div className="bg-[#F8F9FA] flex items-start gap-[35px] overflow-hidden flex-wrap p-8">
        <div className="flex flex-col items-stretch grow shrink-0 basis-0 w-fit">
          <h1 className="page-heading">{id ? "Edit Role" : "Add New Role"}</h1>
          <div className="shadow-[0px_3.5px_5.5px_0px_rgba(0,0,0,0.02)] bg-white flex items-stretch gap-5 flex-wrap justify-between mt-[30px] p-[31px] rounded-[15px] h-[88vh] sticky top-0 overflow-y-scroll">
            <div className="max-md:max-w-full xl:w-[69%]">
              <form
                className="w-full font-normal max-md:max-w-full"
                onSubmit={handleSubmit(handleAddNewRole)}
                noValidate
              >
                <div className="flex w-full gap-10 flex-wrap max-md:max-w-full">
                  <div className="flex min-w-60 flex-col items-stretch flex-1 shrink basis-[0%] max-md:max-w-full">
                    <label className="flex items-center gap-1">
                      <span className="text-[#444446] text-[15px] leading-none tracking-[-0.24px]">
                        Name
                      </span>
                      <span className="text-[#FF3A3A] text-sm leading-none">
                        *
                      </span>
                    </label>
                    <input
                      {...register("name")}
                      className="self-stretch flex-1 shrink basis-[0%] rounded border border-[#E5E5EA] bg-white min-h-12 w-full gap-2 text-base text-[#7C7C80] tracking-[-0.32px] leading-none mt-2 px-4 py-3.5 border-solid"
                      placeholder="Enter name"
                    />
                    {errors.name && (
                      <span className="text-xs text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                  <div className="flex min-w-60 flex-col items-stretch flex-1 shrink basis-[0%] max-md:max-w-full">
                    <label className="flex items-center gap-1">
                      <span className="text-[#444446] text-[15px] leading-none tracking-[-0.24px]">
                        Company Name
                      </span>
                      <span className="text-[#FF3A3A] text-sm leading-none">
                        *
                      </span>
                    </label>
                    <input
                      {...register("companyName")}
                      className="self-stretch flex-1 shrink basis-[0%] rounded border border-[#E5E5EA] bg-white min-h-12 w-full gap-2 text-base text-[#7C7C80] tracking-[-0.32px] leading-none mt-2 px-4 py-3.5 border-solid"
                      placeholder="Enter company name"
                    />
                    {errors.companyName && (
                      <span className="text-xs text-red-500">
                        {errors.companyName.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex w-full gap-8 flex-wrap mt-[30px] max-md:max-w-full">
                  <div className="flex min-w-60 flex-col items-stretch flex-1 shrink basis-[0%] max-md:max-w-full">
                    <label className="flex items-center gap-1">
                      <span className="text-[#444446] text-[15px] leading-none tracking-[-0.24px]">
                        Email
                      </span>
                      <span className="text-[#FF3A3A] text-sm leading-none">
                        *
                      </span>
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className="self-stretch flex-1 shrink basis-[0%] rounded border border-[#E5E5EA] bg-white min-h-12 w-full gap-2 text-base text-[#7C7C80] tracking-[-0.32px] leading-none mt-2 px-4 py-3.5 border-solid"
                      placeholder="Enter email"
                    />
                    {errors.email && (
                      <span className="text-xs text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="flex min-w-60 flex-col items-stretch flex-1 shrink basis-[0%] max-md:max-w-full">
                    <label className="flex items-center gap-1">
                      <span className="text-[#444446] text-[15px] leading-none tracking-[-0.24px]">
                        Number
                      </span>
                      <span className="text-[#FF3A3A] text-sm leading-none">
                        *
                      </span>
                    </label>
                    <div className="items-center rounded border border-[#E5E5EA] bg-white flex min-h-12 w-full gap-2 text-base text-[#242426] tracking-[-0.32px] leading-none mt-2 px-4 py-3.5 border-solid">
                      <div className="self-stretch flex min-w-60 items-center gap-4 my-auto">
                        <div className="self-stretch flex items-center gap-1 whitespace-nowrap my-auto">
                          <img
                            src="https://cdn.builder.io/api/v1/image/assets/4e93f2d3d72f4b58b47d979bd758d34a/9d552e5841dec4d615e2ea3cc22656cdad4e7d4c22e72e98f2e3052e73d32803?placeholderIfAbsent=true"
                            className="aspect-[1.43] object-contain w-5"
                            alt="Flag"
                          />
                          <span>+91</span>
                          <img
                            src="https://cdn.builder.io/api/v1/image/assets/4e93f2d3d72f4b58b47d979bd758d34a/610bae2bd3fec3226daeb553c69952d46dcb01bf137f75b31b35e8b80820ae1e?placeholderIfAbsent=true"
                            className="aspect-[1] object-contain w-4"
                            alt="Arrow"
                          />
                        </div>
                        <input
                          {...register("phone")}
                          className="self-stretch w-[217px] my-auto bg-transparent outline-none"
                          placeholder="1234 4568"
                        />
                      </div>
                    </div>
                    {errors.phone && (
                      <span className="text-xs text-red-500">
                        {errors.phone.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex w-full gap-10 flex-wrap mt-[30px] max-md:max-w-full">
                  <div className="flex min-w-60 flex-col items-stretch flex-1 shrink basis-[0%]">
                    <label className="text-[15px] text-[#444446] tracking-[-0.24px] leading-none">
                      Created On
                    </label>
                    <div className="self-stretch flex-1 shrink basis-[0%] rounded bg-[rgba(242,242,247,1)] min-h-12 w-full text-base text-[#7C7C80] tracking-[-0.32px] leading-none mt-2 px-4 py-3.5">
                      DD/MM/YYYY
                    </div>
                  </div>
                  <div className="flex min-w-60 flex-col items-stretch flex-1 shrink basis-[0%]">
                    <label className="text-[15px] text-[#444446] tracking-[-0.24px] leading-none">
                      Modified On
                    </label>
                    <div className="self-stretch flex-1 shrink basis-[0%] rounded bg-[rgba(242,242,247,1)] min-h-12 w-full text-base text-[#7C7C80] tracking-[-0.32px] leading-none mt-2 px-4 py-3.5">
                      DD/MM/YYYY
                    </div>
                  </div>
                  <div className="flex min-w-60 flex-col items-stretch flex-1 shrink basis-[0%]">
                    <label className="text-[15px] text-[#444446] tracking-[-0.24px] leading-none">
                      Modified By
                    </label>
                    <div className="self-stretch flex-1 shrink basis-[0%] rounded bg-[rgba(242,242,247,1)] min-h-12 w-full text-base text-[#7C7C80] tracking-[-0.32px] leading-none mt-2 px-4 py-3.5">
                      Admin Name
                    </div>
                  </div>
                </div>
                <div className="w-full mt-[50px] max-md:max-w-full">
                  <h2 className="flex w-full items-center gap-2 text-xl font-medium tracking-[0.38px] leading-none max-md:max-w-full">
                    <span className="bg-clip-text bg-[linear-gradient(90deg,#06B2E1_0%,#22E9A2_100%)] text-transparent">
                      Role & Access
                    </span>
                  </h2>
                  <div className="w-full mt-5 max-md:max-w-full space-y-5">
                    <div className="rounded bg-white w-full p-4 border-[rgba(242,242,247,1)] border-solid border-2">
                      <div className="flex w-full items-stretch gap-3 text-[15px] text-[#242426] font-semibold whitespace-nowrap tracking-[-0.24px] leading-none flex-wrap">
                        <span className="grow shrink w-[833px]">Role</span>
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets/4e93f2d3d72f4b58b47d979bd758d34a/fbcbd31c72978e2a87cf5fccc77b06a40906cf35b9cd51ef2dbc8ce6157186d3?placeholderIfAbsent=true"
                          className="aspect-[1] object-contain w-6 shrink-0 my-auto"
                          alt="Icon"
                        />
                      </div>
                      <div className="flex w-full gap-8 font-normal flex-wrap mt-[25px]">
                        <div className="flex min-w-60 min-h-[76px] flex-col items-stretch flex-1 shrink basis-[0%]">
                          <label className="flex items-center gap-1">
                            <span className="text-[#444446] text-[15px] leading-none tracking-[-0.24px]">
                              Role
                            </span>
                            <span className="text-[#FF3A3A] text-sm leading-none">
                              *
                            </span>
                          </label>
                          <div className="items-center rounded border border-[#E5E5EA] bg-white flex min-h-12 w-full gap-2 text-base text-[#7C7C80] tracking-[-0.32px] leading-none mt-2 px-4 py-3 border-solid">
                            <input
                              {...register("role")}
                              className="self-stretch flex-1 bg-transparent outline-none"
                              placeholder="Accountant"
                            />
                            <img
                              src="https://cdn.builder.io/api/v1/image/assets/4e93f2d3d72f4b58b47d979bd758d34a/c335f7e560c8ce67b0638bcc162fadf7a2a1f41a936ff4cdfade58fd8dc56827?placeholderIfAbsent=true"
                              className="aspect-[1] object-contain w-6"
                              alt="Dropdown"
                            />
                          </div>
                          {errors.role && (
                            <span className="text-xs text-red-500">
                              {errors.role.message}
                            </span>
                          )}
                        </div>
                        <div className="flex min-w-60 min-h-[76px] flex-col items-stretch flex-1 shrink basis-[0%]">
                          <label className="text-[15px] text-[#444446] tracking-[-0.24px] leading-none">
                            Description
                          </label>
                          <input
                            {...register("description")}
                            className="self-stretch flex-1 shrink basis-[0%] rounded border border-[#E5E5EA] bg-white min-h-12 w-full gap-2 text-base text-[#7C7C80] tracking-[-0.32px] leading-none mt-2 px-4 py-3.5 border-solid"
                            placeholder="Enter description"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="rounded bg-white w-full p-4 border-[rgba(242,242,247,1)] border-solid border-2">
                      <div className="flex w-full items-stretch gap-3 text-[15px] text-[#242426] font-semibold whitespace-nowrap tracking-[-0.24px] leading-none flex-wrap">
                        <span className="grow shrink w-[833px]">Access</span>
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets/4e93f2d3d72f4b58b47d979bd758d34a/fbcbd31c72978e2a87cf5fccc77b06a40906cf35b9cd51ef2dbc8ce6157186d3?placeholderIfAbsent=true"
                          className="aspect-[1] object-contain w-6 shrink-0 my-auto"
                          alt="Icon"
                        />
                      </div>
                      <div className="space-y-[25px] mt-[25px]">
                        <AccessControl
                          title="User Management"
                          enabled={accessControls.userManagement}
                          onToggle={(enabled) =>
                            setAccessControl("userManagement", enabled)
                          }
                        />
                        <AccessControl
                          title="Simulation"
                          enabled={accessControls.simulation}
                          onToggle={(enabled) =>
                            setAccessControl("simulation", enabled)
                          }
                        />
                        <AccessControl
                          title="Package"
                          enabled={accessControls.package}
                          onToggle={(enabled) =>
                            setAccessControl("package", enabled)
                          }
                        />
                        <AccessControl
                          title="Payment"
                          enabled={accessControls.payment}
                          onToggle={(enabled) =>
                            setAccessControl("payment", enabled)
                          }
                          showActions={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <SidebarActions actions={actions} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
