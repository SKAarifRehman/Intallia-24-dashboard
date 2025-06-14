// import { v4 as uuid } from "uuid"; // Ensure you import uuid
import { SoftwareSection, Task, TaskCounts, SoftwareType } from "@/types";
import { toast } from "sonner";

interface Props {
  sections: SoftwareSection[];
  setSections: React.Dispatch<React.SetStateAction<SoftwareSection[]>>;
  taskCounts: TaskCounts;
  setTaskCounts: React.Dispatch<React.SetStateAction<TaskCounts>>;
  selectedSoftware: { label: string; value: string };
  setSelectedSoftware: (value: { label: string; value: string } | null) => void;
}

export const useSectionHandlers = ({
  sections,
  setSections,
  taskCounts,
  setTaskCounts,
  selectedSoftware,
  setSelectedSoftware,
}: Props) => {

const handleCreateSection = () => {
  if (!selectedSoftware || !selectedSoftware.value) {
    return toast.error("Please select a software first");
  }

  const softwareId = selectedSoftware.value;

  if (sections.some((s) => s.software === softwareId)) {
    return toast.error(`A section for ${selectedSoftware.label} already exists`);
  }

  // const newSectionId = uuid();
  const newSection: SoftwareSection = {
    // id: newSectionId,
    // SectionId: newSectionId,
    software: softwareId,
    tasks: [],
  };

  setSections([...sections, newSection]);
  setSelectedSoftware(null);
};


  const handleSectionCreated = (sectionData: any) => {
    const softwareId = sectionData?.Header?.[0]?.SoftwareId;
    const sectionId = sectionData?.Header?.[0]?.SectionId;

    if (!softwareId || !sectionId) return;

    const newSection: SoftwareSection = {
      id: sectionId,
      SectionId: sectionId,
      software: softwareId,
      tasks: [],
    };

    setSections((prev) => [...prev, newSection]);
    setSelectedSoftware("");
  };

  const handleRemoveSection = (id: string) => {
    const section = sections.find((s) => s.id === id);
    if (section) {
      const currentCount = Number(taskCounts[section.software]) || 0;
      setTaskCounts((prev) => ({
        ...prev,
        [section.software]: currentCount - section.tasks.length,
      }));
    }

    setSections(sections.filter((s) => s.id !== id));
    toast.info("Section removed successfully");
  };

  const handleAddTask = (sectionId: string, task: Task) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, tasks: [...s.tasks, task] } : s,
      ),
    );

    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      const currentCount = Number(taskCounts[section.software]) || 0;
      setTaskCounts((prev) => ({
        ...prev,
        [section.software]: currentCount + 1,
      }));

      console.log(`Incremented count for ${section.software}:`, currentCount + 1);
    }
  };

  const handleAddTaskForm = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              tasks: [...s.tasks, { id: "", description: "", temp: true }],
            }
          : s,
      ),
    );
  };

  return {
    handleCreateSection,
    handleSectionCreated,
    handleRemoveSection,
    handleAddTask,
    handleAddTaskForm,
  };
};
