import { useState } from "react";
import { toast } from "sonner";
import { useAddTask } from "@/queries/simulationQueries";
import { TaskFormExcelSheets } from "./TaskForms/TaskFormExcelSheets";
import { TaskFormWordDocs } from "./TaskForms/TaskFormWordDocs";
import { TaskFormPowerpointSlides } from "./TaskForms/TaskFormPowerpointSlides";
import { X } from "lucide-react";

interface TaskFormProps {
  sectionId: string;
  software: string; // this is something like 'S1'
  taskNumber: number;
  onAddTask: (task: any) => void;
  onRemove: () => void;
  softwareOptions: { value: string; label: string }[];
}

export const TaskForm = ({
  sectionId,
  software,
  taskNumber,
  onAddTask,
  onRemove,
  softwareOptions,
}: TaskFormProps) => {
  const addTaskMutation = useAddTask();

  const mappedSoftware =
    softwareOptions.find((opt) => opt.value === software)?.label || software;

  const [form, setForm] = useState({
    description: "",
    hint: "",
    skillName: "",
    skillScore: "",
    sheetName: "",
    selectType: "Cell",
    cellLocation: "",
    fromRange: "",
    toRange: "",
    taskLocation: "",
    slideName: "",
    objectName: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const buildPayload = () => {
    const now = new Date().toISOString();
    let header: any = {
      TaskId: "",
      SectionId: sectionId,
      Order: taskNumber,
      Description: form.description,
      CompanyId: "Intallia24",
      CreateBy: "Admin",
      CreateDate: now,
      ModifyBy: "Admin",
      ModifyDate: now,
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
      SkillName: form.skillName,
      SkillScore: form.skillScore,
      Hint: form.hint,
    };

    if (mappedSoftware === "Excel" || mappedSoftware === "GoogleSheets") {
      header = {
        ...header,
        SheetName: form.sheetName,
        SelectType: form.selectType,
        ...(form.selectType === "Cell"
          ? { CellLocation: form.cellLocation }
          : { FromRange: form.fromRange, ToRange: form.toRange }),
      };
    } else if (mappedSoftware === "Word" || mappedSoftware === "GoogleDoc") {
      header = {
        ...header,
        TaskLocation: form.taskLocation,
      };
    } else if (mappedSoftware === "PPT" || mappedSoftware === "GoogleSlides") {
      header = {
        ...header,
        SlideName: form.slideName,
        ObjectName: form.objectName,
      };
    }

    return {
      JSON: JSON.stringify({
        Header: [header],
        Response: [{ ResponseText: "", ErrorCode: "" }],
      }),
    };
  };

  const handleSubmit = async () => {
    if (!form.description || !form.skillName || !form.skillScore) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (
      (mappedSoftware === "Excel" || mappedSoftware === "GoogleSheets") &&
      (!form.sheetName ||
        (form.selectType === "Cell" && !form.cellLocation) ||
        (form.selectType === "Range" && (!form.fromRange || !form.toRange)))
    ) {
      toast.error("Please fill all required Excel fields.");
      return;
    }

    if (
      (mappedSoftware === "Word" || mappedSoftware === "GoogleDoc") &&
      !form.taskLocation
    ) {
      toast.error("Please fill all required Word fields.");
      return;
    }

    if (
      (mappedSoftware === "PPT" || mappedSoftware === "GoogleSlides") &&
      (!form.slideName || !form.objectName)
    ) {
      toast.error("Please fill all required PPT fields.");
      return;
    }

    try {
      const payload = buildPayload();
      await addTaskMutation.mutateAsync(payload);
      toast.success("Task added successfully");

      onAddTask({ ...form, id: Date.now().toString() });

      setForm({
        description: "",
        hint: "",
        skillName: "",
        skillScore: "",
        sheetName: "",
        selectType: "Cell",
        cellLocation: "",
        fromRange: "",
        toRange: "",
        taskLocation: "",
        slideName: "",
        objectName: "",
      });
    } catch (err) {
      toast.error("Failed to add task.");
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-[#E5E5EA] mb-4 relative">
      {/* Remove button (top-right) */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        title="Remove this task"
      >
        <X size={18} />
      </button>

      <h5 className="font-medium mb-4">Task {taskNumber}</h5>

      {mappedSoftware === "Excel" || mappedSoftware === "GoogleSheets" ? (
        <TaskFormExcelSheets
          values={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          taskNumber={taskNumber}
          softwareOptions={softwareOptions}
        />
      ) : mappedSoftware === "Word" || mappedSoftware === "GoogleDoc" ? (
        <TaskFormWordDocs
          values={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          taskNumber={taskNumber}
          softwareOptions={softwareOptions}
        />
      ) : mappedSoftware === "PPT" || mappedSoftware === "GoogleSlides" ? (
        <TaskFormPowerpointSlides
          values={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          taskNumber={taskNumber}
          softwareOptions={softwareOptions}
        />
      ) : (
        <div className="text-red-500">
          Unsupported software type: {mappedSoftware}
        </div>
      )}
    </div>
  );
};
