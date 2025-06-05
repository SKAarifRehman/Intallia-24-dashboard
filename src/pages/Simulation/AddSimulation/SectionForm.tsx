import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectField from "@/components/common/SelectField";
import { UploadField } from "./UploadField";
import { useAuthStore } from "@/store/authStore";
import { useSimulationStore } from "@/store/simulationStore";
import { useAddSection } from "@/queries/simulationQueries";

// Define your zod schema
const schema = z.object({
  software: z.string().min(1, "Select software"),
  studentFile: z.any().refine((file) => !!file, "Student file is required"),
  masterJson: z.any().refine((file) => !!file, "Master JSON is required"),
});

type FormData = z.infer<typeof schema>;

export function SectionForm({ softwareOptions }) {
  const { userID, companyId } = useAuthStore((state) => state);
  const { simulation } = useSimulationStore((state) => state);
  const addSection = useAddSection();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      software: "",
      studentFile: null,
      masterJson: null,
    },
  });

  const onSubmit = async (formData: FormData) => {
    // handle form data here
    const payload = {
      JSON: JSON.stringify({
        Header: [
          {
            SectionId: "",
            SimulationId: simulation?.SimulationId || "",
            SoftwareId: formData.software,
            Title: formData.software ? softwareOptions[formData.software]?.label : "",
            Order: "1",
            Link: "",
            StudentFile: formData.studentFile,
            JsonFile: formData.masterJson,
            CompanyId: companyId,
            CreateBy: userID,
            CreateDate: new Date().toISOString(),
            ModifyBy: userID,
            ModifyDate: new Date().toISOString(),
            ...Array.from({ length: 15 }, (_, i) => ({
              [`Intallia${i + 1}`]: null,
            })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
          },
        ],
        Response: [
          {
            ResponseText: "",
            ErrorCode: "",
          },
        ],
      }),
    };
    await addSection.mutateAsync(payload)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="self-stretch flex items-center gap-[40px_41px] font-normal flex-wrap mt-[30px]">
        <SelectField
          label="Select Software"
          required
          className="w-[250px]"
          value={watch("software") || ""}
          onChange={(val) => setValue("software", val)}
          options={softwareOptions}
          error={errors.software?.message}
        />

        <Controller
          name="studentFile"
          control={control}
          render={({ field, fieldState }) => (
            <UploadField
              label="Upload Student File"
              required
              icon="https://cdn.builder.io/api/v1/image/assets/d6885eedf052436eac8c331fe6a68cb8/1c304427fca5f42895e6397e016eaaa454443eed82724c05d714aaa887b33e39?placeholderIfAbsent=true"
              placeholder="Upload"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              className="w-[247px]"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="masterJson"
          control={control}
          render={({ field, fieldState }) => (
            <UploadField
              label="Upload Master JSON"
              required
              icon="https://cdn.builder.io/api/v1/image/assets/d6885eedf052436eac8c331fe6a68cb8/35e4a924501edc645cf40e324b54fd6d577032055217641815c1e0737c31f635?placeholderIfAbsent=true"
              placeholder="Upload JSON"
              accept=".json"
              className="w-[247px]"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <button
        type="submit"
        className="bg-[rgba(6,178,225,1)] gap-2.5 text-xl text-white font-semibold text-start tracking-[0.38px] leading-none mt-[30px] px-8 py-4 rounded-[48px] w-[215px]"
      >
        Create Section
      </button>
    </form>
  );
}
