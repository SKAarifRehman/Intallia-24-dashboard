import { X, Plus } from "lucide-react";
import { SoftwareSection, SoftwareType, Task } from "@/types";
import { TaskForm } from "../TaskForm";

interface Props {
  section: SoftwareSection;
  softwareOptions: { value: string; label: string }[];
  onRemove: (id: string) => void;
  onAddTask: (sectionId: string, task: Task) => void;
  onAddTaskForm: (sectionId: string) => void;
  setSections: React.Dispatch<React.SetStateAction<SoftwareSection[]>>;
}

export const SectionCard = ({
  section,
  softwareOptions,
  onRemove,
  onAddTask,
  onAddTaskForm,
  setSections,
}: Props) => {
  const savedTasks = section.tasks.filter((t) => t.id);
  const tasksToRender = section.tasks.filter((t) => !t.id);

  return (
    <div className="bg-[#F8F8F8] border mt-8 rounded-lg overflow-hidden">
      <div className="bg-[#EFEFEF] px-4 py-3 flex justify-between items-center">
        <h4 className="text-lg font-medium">
          {softwareOptions.find((opt) => opt.value === section.software)?.label}
        </h4>
        <button
          onClick={() => onRemove(section.id)}
          className="text-[#FF3A3A] hover:bg-red-50 p-1 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6">
        {savedTasks.map((task, index) => (
          <div
            key={task.id}
            className="bg-white mb-4 p-4 rounded-lg border border-[#E5E5EA]"
          >
            <h5 className="font-medium">Task {index + 1}</h5>
            <p className="text-sm text-[#7C7C80] mt-2">{task.description}</p>
          </div>
        ))}

        {tasksToRender.map((_, i) => (
          <TaskForm
            key={`form-${i}`}
            sectionId={section.id}
            software={section.software}
            softwareOptions={softwareOptions}
            taskNumber={savedTasks.length + i + 1}
            onAddTask={(task) => {
              onAddTask(section.id, {
                ...task,
                id: Date.now().toString(),
              });
              setSections((prev) =>
                prev.map((s) =>
                  s.id === section.id
                    ? { ...s, tasks: s.tasks.filter((t) => !t.temp) }
                    : s,
                ),
              );
            }}
            onRemove={() => {
              setSections((prev) =>
                prev.map((s) =>
                  s.id === section.id
                    ? {
                        ...s,
                        tasks: s.tasks.filter((_, index) => index !== i),
                      }
                    : s,
                ),
              );
            }}
          />
        ))}

        <button
          onClick={() => onAddTaskForm(section.id)}
          className="bg-[#06B2E1] text-white px-8 py-3 rounded-full flex items-center gap-2 mt-2"
        >
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
};
