import { forwardRef, useImperativeHandle, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCompany, getCompanyById, updateCompany } from "@/http/api.js";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import companySchema, {CompanySchemaType as CompanyFormValues} from "@/schema/companySchema";

const defaultValues: CompanyFormValues = {
  companyId: "",
  companyName: "",
  contactPersonName: "",
  phoneNumber: "",
  website: "",
  email: "",
  address: "",
  city: "",
  state: "",
  country: "",
  status: "",
  numberOfUsers: "",
  numberOfSimulations: "",
};

const updateCompanyPayload = (companyId: string | number) => {
  if (!companyId) {
    throw new Error("Invalid companyId provided to updateCompanyPayload");
  }
  return {
    JSON: JSON.stringify({
      Header: [{ CompanyId: companyId }],
      Response: [{ ResponseText: "", ErrorCode: "" }],
    }),
  };
};

const mapCompanyDataToForm = (data): CompanyFormValues => ({
  companyId: data?.CompanyId || "",
  companyName: data?.CompanyName || "",
  contactPersonName: data?.ContactPersonName || "",
  phoneNumber: data?.PhoneNumber || "",
  website: data?.Website || "",
  email: data?.Email || "",
  address: data?.Address || "",
  city: data?.City || "",
  state: data?.State || "",
  country: data?.Country || "",
  status: data?.Status || "",
  numberOfUsers: data?.NumberOfUsers || "",
  numberOfSimulations: data?.NumberOfSimulations || "",
});

interface CompanyFormProps {
  companyId?: string;
}

export interface CompanyFormRef {
  submit: () => void;
}

const CompanyForm = forwardRef<CompanyFormRef, CompanyFormProps>(
  ({ companyId }, ref) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm<CompanyFormValues>({
      resolver: zodResolver(companySchema),
      defaultValues,
    });

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(onSubmit)(),
    }));

    // Add new Company
    const addNewCompany = async (formData: CompanyFormValues) => {
      try {
        const payload = {
          JSON: JSON.stringify({
            Header: [
              {
                ...formData,
                NumberOfUsers: formData.numberOfUsers || "500",
                NumberOfSimulations: formData.numberOfSimulations || "500",
                CreateBy: "Admin",
                CreateDate: new Date().toISOString(),
                ModifyBy: "Admin",
                ModifyDate: new Date().toISOString(),
                ...Array.from({ length: 15 }, (_, i) => ({
                  [`Intallia${i + 1}`]: null,
                })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
              },
            ],
            Response: [{ ResponseText: "", ErrorCode: "" }],
          }),
        };

        await addCompany(payload);
        await queryClient.invalidateQueries({ queryKey: ["companies"] });
        toast.success("Company added successfully!");
        navigate("/company");
      } catch (error) {
        toast.error("Failed to add company");
        console.error(error);
      }
    };

    // Update Company
    const handleUpdateCompany = async (formData: CompanyFormValues) => {
      try {
        const payload = {
          JSON: JSON.stringify({
            Header: [
              {
                ...formData,
                NumberOfUsers: formData.numberOfUsers || "500",
                NumberOfSimulations: formData.numberOfSimulations || "500",
                CreateBy: "Admin",
                CreateDate: new Date().toISOString(),
                ModifyBy: "Admin",
                ModifyDate: new Date().toISOString(),
                ...Array.from({ length: 15 }, (_, i) => ({
                  [`Intallia${i + 1}`]: null,
                })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
              },
            ],
            Response: [{ ResponseText: "", ErrorCode: "" }],
          }),
        };

        await updateCompany(payload);
        await queryClient.invalidateQueries({ queryKey: ["companies"] });
        toast.success("Company updated successfully!");
        navigate("/company");
      } catch (error) {
        toast.error("Failed to update company");
        console.error(error);
      }
    };

    const onSubmit = async (formData: CompanyFormValues) => {
      if (companyId) {
        await handleUpdateCompany(formData);
      } else {
        await addNewCompany(formData);
      }
    };

    // fetch single company data based on Company ID
    const { data: companyData, isFetched } = useQuery({
      queryKey: ["company", companyId],
      queryFn: async () => {
        if (!companyId) return null;
        const response = await getCompanyById(updateCompanyPayload(companyId));
        const header = response?.Header;
        return Array.isArray(header) && header.length > 0 ? header[0] : null;
      },
      enabled: Boolean(companyId),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });

    useEffect(() => {
      if (companyData) {
        const values = mapCompanyDataToForm(companyData);
        Object.entries(values).forEach(([key, value]) =>
          setValue(key as keyof CompanyFormValues, value),
        );
      }
    }, [companyData, setValue, isFetched]);

    return (
      <form
        className="flex font-plusJakarta flex-col gap-5 overflow-y-auto"
        noValidate
      >
        <div className="w-full">
          <h2 className="text-xl font-medium tracking-[0.38px] bg-clip-text bg-[linear-gradient(90deg,#0DAFDC_0%,#22E9A2_100%)] text-transparent ">
            Personal Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1">
                <span className="text-[15px] text-[#444446] leading-5 ">
                  CompanyId
                </span>
                <span className="text-[#FF3A3A] text-sm">*</span>
              </label>
              <input
                type="text"
                {...register("companyId")}
                className="rounded border border-[#E5E5EA] bg-white min-h-12 px-4 py-3.5"
              />
              {errors.companyId && (
                <span className="text-xs text-red-500">
                  {errors.companyId.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1">
                <span className="text-[15px] text-[#444446] tracking-[-0.24px]">
                  CompanyName
                </span>
                <span className="text-[#FF3A3A] text-sm">*</span>
              </label>
              <input
                type="text"
                {...register("companyName")}
                className="rounded border border-[#E5E5EA] bg-white min-h-12 px-4 py-3.5"
              />
              {errors.companyName && (
                <span className="text-xs text-red-500">
                  {errors.companyName.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1">
                <span className="text-[15px] text-[#444446] tracking-[-0.24px]">
                  ContactPersonName
                </span>
                <span className="text-[#FF3A3A] text-sm">*</span>
              </label>
              <input
                type="text"
                {...register("contactPersonName")}
                className="rounded border border-[#E5E5EA] bg-white min-h-12 px-4 py-3.5"
              />
              {errors.contactPersonName && (
                <span className="text-xs text-red-500">
                  {errors.contactPersonName.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1">
                <span className="text-[15px] text-[#444446] tracking-[-0.24px]">
                  PhoneNumber
                </span>
                <span className="text-[#FF3A3A] text-sm">*</span>
              </label>
              <div className="flex items-center rounded border border-[#E5E5EA] bg-white min-h-12 px-4 py-3.5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/4e93f2d3d72f4b58b47d979bd758d34a/b3e578b8881e144097eda901ab80255224febf55ffe07d1428a77e2beb4c1939"
                      alt="Country flag"
                      className="w-5 h-3.5"
                    />
                    <span>+91</span>
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/4e93f2d3d72f4b58b47d979bd758d34a/610bae2bd3fec3226daeb553c69952d46dcb01bf137f75b31b35e8b80820ae1e"
                      alt="Dropdown"
                      className="w-4 h-4"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="12344568"
                    {...register("phoneNumber")}
                    className="w-full outline-none placeholder:pl-4 placeholder:text-black"
                  />
                </div>
              </div>
              {errors.phoneNumber && (
                <span className="text-xs text-red-500">
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1">
                <span className="text-[15px] text-[#444446] tracking-[-0.24px]">
                  Website
                </span>
                <span className="text-[#FF3A3A] text-sm">*</span>
              </label>
              <input
                type="url"
                {...register("website")}
                className="rounded border border-[#E5E5EA] bg-white min-h-12 px-4 py-3.5"
              />
              {errors.website && (
                <span className="text-xs text-red-500">
                  {errors.website.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1">
                <span className="text-[15px] text-[#444446] tracking-[-0.24px]">
                  Email
                </span>
                <span className="text-[#FF3A3A] text-sm">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                className="rounded border border-[#E5E5EA] bg-white min-h-12 px-4 py-3.5"
              />
              {errors.email && (
                <span className="text-xs text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-5">
            <label className="flex items-center gap-1">
              <span className="text-[15px] text-[#444446] font-normal">
                Address
              </span>
              <span className="text-[#FF3A3A] text-sm">*</span>
            </label>
            <input
              type="text"
              {...register("address")}
              placeholder="Enter address"
              className="rounded border border-[#E5E5EA] bg-white min-h-12 px-4 py-3.5"
            />
            {errors.address && (
              <span className="text-xs text-red-500">
                {errors.address.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-5">
            <label className="flex items-center gap-1">
              <span className="text-[15px] text-[#444446] font-normal">
                City
              </span>
              <span className="text-[#FF3A3A] text-sm">*</span>
            </label>
            <input
              type="text"
              {...register("city")}
              className="rounded border border-[#E5E5EA] bg-white min-h-12 px-4 py-3.5"
            />
            {errors.city && (
              <span className="text-xs text-red-500">
                {errors.city.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-5">
            <label className="flex items-center gap-1">
              <span className="text-[15px] text-[#444446] font-normal">
                State
              </span>
              <span className="text-[#FF3A3A] text-sm">*</span>
            </label>
            <input
              type="text"
              {...register("state")}
              className="rounded border border-[#E5E5EA] bg-white min-h-12 px-4 py-3.5"
            />
            {errors.state && (
              <span className="text-xs text-red-500">
                {errors.state.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-5">
            <label className="flex items-center gap-1">
              <span className="text-[15px] text-[#444446] font-normal">
                Country
              </span>
              <span className="text-[#FF3A3A] text-sm">*</span>
            </label>
            <input
              type="text"
              {...register("country")}
              className="rounded border border-[#E5E5EA] bg-white min-h-12 px-4 py-3.5"
            />
            {errors.country && (
              <span className="text-xs text-red-500">
                {errors.country.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-5">
            <label className="flex items-center gap-1">
              <span className="text-[15px] text-[#444446] font-normal">
                Status
              </span>
              <span className="text-[#FF3A3A] text-sm">*</span>
            </label>
            <input
              type="text"
              {...register("status")}
              className="rounded border border-[#E5E5EA] bg-white min-h-12 px-4 py-3.5"
            />
            {errors.status && (
              <span className="text-xs text-red-500">
                {errors.status.message}
              </span>
            )}
          </div>
        </div>
      </form>
    );
  },
);

export default CompanyForm;
