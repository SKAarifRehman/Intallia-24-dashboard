import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAddTask } from "@/queries/simulationQueries";
import { TaskFormExcelSheets } from "./TaskForms/TaskFormExcelSheets";
import { TaskFormWordDocs } from "./TaskForms/TaskFormWordDocs";
import { TaskFormPowerpointSlides } from "./TaskForms/TaskFormPowerpointSlides";
import { X, Save } from "lucide-react";

interface TaskFormProps {
  simulationId: string;
  sectionId: string;
  software: string;
  taskNumber: number;
  onAddTask: (task: any) => void;
  onRemove: () => void;
  softwareOptions: { value: string; label: string }[];
  setTaskCount: (count: number) => void;
}

export const TaskForm = ({
  simulationId,
  sectionId,
  software,
  taskNumber,
  onAddTask,
  onRemove,
  softwareOptions,
  setTaskCount,
}: TaskFormProps) => {
  const addTaskMutation = useAddTask();
  const storageKey = `taskCounts_${simulationId}`;

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

  useEffect(() => {
    if (setTaskCount) {
      setTaskCount(taskNumber);
    }
  }, [taskNumber, setTaskCount]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const buildPayload = () => {
    const now = new Date().toISOString();
    let header: any = {
      TaskId: "",
      SectionId: sectionId || undefined,
      Order: taskNumber,
      Description: form.description,
      CompanyId: "Intallia24",
      CreateBy: "Admin",
      CreateDate: now,
      ModifyBy: "Admin",
      ModifyDate: now,
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

      if (onAddTask) {
        const taskWithId = {
          ...payload,
          id: Date.now().toString(),
        };
        onAddTask(taskWithId);
      }

      // ✅ Use simulation-specific key
      const existingCounts = JSON.parse(localStorage.getItem(storageKey) || "{}");
      const currentCount = existingCounts[software] || 0;
      const updatedCounts = {
        ...existingCounts,
        [software]: currentCount + 1,
      };
      localStorage.setItem(storageKey, JSON.stringify(updatedCounts));

      // ✅ Dispatch scoped event
      const event = new CustomEvent("simulationTaskCountsUpdated", {
        detail: {
          simulationId,
          counts: updatedCounts,
        },
      });
      window.dispatchEvent(event);

      toast.success("Task saved successfully");

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
      toast.error("Failed to save task.");
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-[#E5E5EA] mb-4 relative">
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
          taskNumber={taskNumber}
        />
      ) : mappedSoftware === "Word" || mappedSoftware === "GoogleDoc" ? (
        <TaskFormWordDocs
          values={form}
          onChange={handleChange}
          taskNumber={taskNumber}
        />
      ) : mappedSoftware === "PPT" || mappedSoftware === "GoogleSlides" ? (
        <TaskFormPowerpointSlides
          values={form}
          onChange={handleChange}
          taskNumber={taskNumber}
        />
      ) : (
        <div className="text-red-500">
          Unsupported software type: {mappedSoftware}
        </div>
      )}

      <button
        className="bg-[#06B2E1] text-white flex rounded-full px-6 py-3 mt-6 items-center gap-2"
        onClick={handleSubmit}
      >
        <Save size={16} />
        Save Task
      </button>
    </div>
  );
};
