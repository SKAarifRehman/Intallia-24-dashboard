import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "./TextField";
import SelectField from "@/components/common/SelectField";
import { UploadField } from "./UploadField";
import { RichTextEditorField } from "./RichTextEditor";
import simulationSchema, {
  SimulationSchemaType as SimulationFormValues,
} from "@/schema/simulationSchema";
import { Loader2Icon } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAddJobSimulation } from "@/queries/simulationQueries";
import { useNavigate } from "react-router-dom";
import { Simulation } from "@/types";

interface SimulationFormProps {
  simulation?: Simulation;
}

export const SimulationForm = ({ simulation }: SimulationFormProps) => {
  const navigate = useNavigate();
  const [simulationType, setSimulationType] = useState<"guided" | "unguided">(
    "unguided"
  );
  const { userID, companyId } = useAuthStore((state) => state);
  const addJobSimulation = useAddJobSimulation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SimulationFormValues>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      plane: "",
      simulationName: "",
      cardDescription: "",
      bannerImage: "",
      ctaImage: "",
      cardImage: "",
      difficultyLevel: "",
      priorityLevel: "",
      tags: "",
      description: "",
    },
  });

  // difficultyLevel options
  const difficultyLevelOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  const priorityLevelOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

useEffect(() => {
  if (simulation) {
    setValue("simulationName", simulation.Name || "");
    setValue("cardDescription", simulation.CardDescription || "");
    setValue("bannerImage", simulation.BannerImage || "");
    setValue("ctaImage", simulation.CTAImage || "");
    setValue("cardImage", simulation.CardImage || "");
    setValue("difficultyLevel", simulation.DefficultyLevel || "");
    setValue("plane", simulation.Plane || "");
    setValue("priorityLevel", simulation.PriorityLevel || "");
    setValue("tags", simulation.Tags || "");
    setValue("description", simulation.Description || "");
    // Handle both boolean and string for Guided
    if (typeof simulation.Guided === "boolean") {
      setSimulationType(simulation.Guided ? "guided" : "unguided");
    } else if (simulation.Guided === "guided" || simulation.Guided === "unguided") {
      setSimulationType(simulation.Guided);
    }
  }
}, [simulation, setValue]);

  const onSubmit = async (formData: SimulationFormValues) => {
    const payload = {
      JSON: JSON.stringify({
        Header: [
          {
            SimulationId: "",
            CompanyId: companyId,
            Name: formData.simulationName,
            CardDescription: formData.cardDescription,
            BannerImage: formData.bannerImage,
            CTAImage: formData.ctaImage,
            CardImage: formData.cardImage,
            DefficultyLevel: formData.difficultyLevel,
            Plane: formData.plane,
            PriorityLevel: formData.priorityLevel,
            Tags: formData.tags,
            Description: formData.description,
            Guided: simulationType === "guided",
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

    console.log("Submitting simulation form with payload:", payload);

    // Call the mutation to add the job simulation
    const res = await addJobSimulation.mutateAsync(payload);
    if (res.ErrorCode === "0") {
      navigate(`/simulation/${res.Header[0].SimulationId}`);
    }
  };

  const priorityLevelOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

 useEffect(() => {
    if (simulation) {
      setValue("simulationName", simulation.Name || "");
      setValue("cardDescription", simulation.CardDescription || "");
      setValue("bannerImage", simulation.BannerImage || "");
      setValue("ctaImage", simulation.CTAImage || "");
      setValue("cardImage", simulation.CardImage || "");
      setValue("difficultyLevel", simulation.DefficultyLevel || "");
      setValue("plane", simulation.Plane || "");
      setValue("priorityLevel", simulation.PriorityLevel || "");
      setValue("tags", simulation.Tags || "");
      setValue("description", simulation.Description || "");
    }

 }, [simulation, setValue])




  return (
    <div className="shadow-[0px_3.5px_5.5px_0px_rgba(0,0,0,0.04)] bg-white w-[93%] pt-[50px] pb-[27px] px-[37px] rounded-[15px] ">
      <div className="flex items-stretch gap-5 flex-wrap justify-between mr-[26px] ">
        <h2 className="text-[#242426] text-[28px] font-medium leading-none tracking-[0.36px] my-auto">
          Simulation Details
        </h2>
        <div className="flex items-center gap-[35px] flex-wrap">
          <div className="self-stretch flex items-center gap-4 text-[20px] text-[#444446] font-normal tracking-[0.38px] leading-none my-auto">
            <button
              type="button"
              className={`border flex items-center justify-center w-6 h-6 rounded-[32px] ${
                simulationType === "guided"
                  ? "bg-[rgba(6,178,225,1)] border-[rgba(6,178,225,1)]"
                  : "border-[#AEAEB2] bg-white"
              }`}
              onClick={() => setSimulationType("guided")}
              aria-pressed={simulationType === "guided"}
            >
              {simulationType === "guided" && (
                <div className="bg-white w-2 h-2 rounded-[50%]" />
              )}
            </button>
            <span>Guided</span>
          </div>
          <div className="self-stretch flex items-center gap-4 my-auto">
            <button
              type="button"
              className={`border flex items-center justify-center w-6 h-6 rounded-[32px] ${
                simulationType === "unguided"
                  ? "bg-[rgba(6,178,225,1)] border-[rgba(6,178,225,1)]"
                  : "border-[#AEAEB2] bg-white"
              }`}
              onClick={() => setSimulationType("unguided")}
              aria-pressed={simulationType === "unguided"}
            >
              {simulationType === "unguided" && (
                <div className="bg-white w-2 h-2 rounded-[50%] border-[color:var(--grey-grey-04,#444446)]" />
              )}
            </button>
            <span className="text-[#444446] text-[20px] font-normal leading-none tracking-[0.38px]">
              Unguided
            </span>
          </div>
          <SelectField
            label=""
            className="text-[17px] text-[#444446] font-medium text-center tracking-[-0.41px] leading-none pl-4 pr-2 py-2 rounded-[48px] border-solid min-w-[180px]"
            options={[
              { value: "plane1", label: "Plane 1" },
              { value: "plane2", label: "Plane 2" },
              { value: "plane3", label: "Plane 3" },
            ]}
            placeholder="Select Plane"
            value={watch("plane") || ""}
            onChange={(val) => setValue("plane", val)}
            error={
              typeof errors?.plane?.message === "string"
                ? errors.plane.message
                : undefined
            }
          />
        </div>
      </div>

      <form
        className="flex w-full flex-col items-stretch mt-[38px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          label="Simulation Name"
          required
          placeholder=""
          {...register("simulationName")}
          error={
            typeof errors.simulationName?.message === "string"
              ? errors.simulationName.message
              : undefined
          }
        />

        <TextField
          label="Card Description"
          required
          placeholder=""
          className="mt-5"
          {...register("cardDescription")}
          error={
            typeof errors.cardDescription?.message === "string"
              ? errors.cardDescription.message
              : undefined
          }
        />

        <div className="flex w-full items-center gap-3 flex-wrap mt-5">
          <div className="flex-1 min-w-[200px]">
            <UploadField
              label="Banner Image"
              required
              icon="https://cdn.builder.io/api/v1/image/assets/d6885eedf052436eac8c331fe6a68cb8/4f4c37bf79ac39c63cfd3f17512a0d4b2cc7f5dd8775a1f5e2820849e33251f4?placeholderIfAbsent=true"
              placeholder="Upload Image"
              accept="image/*"
              className="w-full"
              {...register("bannerImage")}
              error={
                typeof errors.bannerImage?.message === "string"
                  ? errors.bannerImage.message
                  : undefined
              }
              onChange={(file) => setValue("bannerImage", file)}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <UploadField
              label="CTA Image"
              required
              icon="https://cdn.builder.io/api/v1/image/assets/d6885eedf052436eac8c331fe6a68cb8/09e525f7fd5c650a63b5a7eb7cf1817612637b63dbbb02ff315c1de45ce98861?placeholderIfAbsent=true"
              placeholder="Upload Image"
              accept="image/*"
              className="w-full"
              {...register("ctaImage")}
              error={
                typeof errors.ctaImage?.message === "string"
                  ? errors.ctaImage.message
                  : undefined
              }
              onChange={(file) => setValue("ctaImage", file)}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <UploadField
              label="Card Image"
              required
              icon="https://cdn.builder.io/api/v1/image/assets/d6885eedf052436eac8c331fe6a68cb8/bed87d6a4dc002519dad27c2456b96bf200e2c334181b0911b2f0b69d2941a8f?placeholderIfAbsent=true"
              placeholder="Upload Image"
              accept="image/*"
              className="w-full"
              {...register("cardImage")}
              error={
                typeof errors.cardImage?.message === "string"
                  ? errors.cardImage.message
                  : undefined
              }
              onChange={(file) => setValue("cardImage", file)}
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-3 flex-wrap mt-5">
          <div className="flex-1 w-1/3">
            <SelectField
              label="Difficulty Level"
              required
              className="w-full"
              options={difficultyLevelOptions}
              value={watch("difficultyLevel") || ""}
              onChange={(val) => setValue("difficultyLevel", val)}
              error={
                typeof errors.difficultyLevel?.message === "string"
                  ? errors.difficultyLevel.message
                  : undefined
              }
            />
          </div>
          <div className="flex-1 w-1/3">
            <SelectField
              label="Priority Level"
              required
              className="w-full"
              options={priorityLevelOptions}
              value={watch("priorityLevel") || ""}
              onChange={(val) => setValue("priorityLevel", val)}
              error={
                typeof errors.priorityLevel?.message === "string"
                  ? errors.priorityLevel.message
                  : undefined
              }
            />
          </div>
        </div>

        <TextField
          label="Tags"
          required
          defaultValue="English, Communication"
          className="mt-5 "
          {...register("tags")}
          error={
            typeof errors.tags?.message === "string"
              ? errors.tags.message
              : undefined
          }
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <RichTextEditorField
              label="Description"
              required
              onChange={(val) => {
                // Remove HTML tags (e.g., <p>...</p>)
                const plainText = val.replace(/<[^>]+>/g, "").trim();
                field.onChange(plainText);
              }}
              error={
                typeof fieldState.error?.message === "string"
                  ? fieldState.error.message
                  : undefined
              }
            />
          )}
        />

        <button
          type="submit"
          className="bg-[rgba(6,178,225,1)] gap-2.5 text-xl text-white font-semibold  text-start tracking-[0.38px] leading-none mt-5 px-8 py-4 rounded-[48px] w-[113px] h-[57px] flex items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2Icon className="animate-spin mr-2" />}
          Save
        </button>
      </form>
    </div>
  );
};
