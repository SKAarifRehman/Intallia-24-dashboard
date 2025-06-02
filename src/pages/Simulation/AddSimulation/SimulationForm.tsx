import { useState} from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "./TextField";
import SelectField from "@/components/common/SelectField";
import { UploadField } from "./UploadField";
import { RichTextEditorField } from "./RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import simulationSchema, {
  SimulationSchemaType as SimulationFormValues,
} from "@/schema/simulationSchema";
import { Loader2Icon } from "lucide-react";


export const SimulationForm = ({softwareOptions}) => {
  const [simulationType, setSimulationType] = useState<"guided" | "unguided">(
    "unguided",
  );
  const { toast } = useToast();


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
      bannerImage: undefined,
      ctaImage: undefined,
      cardImage: undefined,
      difficultyLevel: "",
      software: "",
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

  const onSubmit = (data: SimulationFormValues) => {
    console.log("Form Data:", data);
    toast({
      variant: "success",
      title: "Form submitted",
      description: "Your simulation has been saved successfully",
    });
    // handle form data here
  };

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
              label="Select Software"
              required
              className="w-full"
              options={softwareOptions}
              value={watch("software") || ""}
              onChange={(val) => setValue("software", val)}
              error={
                typeof errors.software?.message === "string"
                  ? errors.software.message
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
              onChange={(val) => field.onChange(val)}
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
