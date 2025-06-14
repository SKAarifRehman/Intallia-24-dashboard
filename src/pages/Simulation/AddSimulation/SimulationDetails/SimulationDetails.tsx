import { useEffect, useState, useMemo } from "react";
import type { TaskCounts, SoftwareSection } from "@/types";
import { useSoftware } from "@/queries/simulationQueries";
import { SectionForm } from "../SectionForm";
import { SectionCard } from "./SectionCard";
import { useSectionHandlers } from "./useSectionHandlers";
import { initialTaskCounts } from "@/constants/simulationConstants";

interface SimulationDetailsProps {
  setSoftwareOptions: React.Dispatch<
    React.SetStateAction<{ label: string; value: string }[]>
  >;
  taskCounts: TaskCounts;
  setTaskCounts: React.Dispatch<React.SetStateAction<TaskCounts>>;
}

export const SimulationDetails = ({
  setSoftwareOptions,
  taskCounts,
  setTaskCounts,
}: SimulationDetailsProps) => {
  const { data: Software, isSuccess } = useSoftware();
  const [sections, setSections] = useState<SoftwareSection[]>([]);
  const [selectedSoftware, setSelectedSoftware] = useState<string>("");

  const softwareOptions = useMemo(() => {
    return isSuccess && Software?.LookupData
      ? Software.LookupData.map((item) => ({
          value: item.SoftwareId,
          label: item.Name,
        }))
      : [];
  }, [isSuccess, Software]);

  useEffect(() => {
    if (softwareOptions.length > 0) {
      setSoftwareOptions(softwareOptions);
    }
  }, [softwareOptions, setSoftwareOptions]);

  const {
    handleCreateSection,
    handleSectionCreated,
    handleRemoveSection,
    handleAddTask,
    handleAddTaskForm,
  } = useSectionHandlers({
    sections,
    setSections,
    taskCounts,
    setTaskCounts,
    selectedSoftware,
    setSelectedSoftware,
  });

  return (
    <div className="shadow bg-white w-[90%] flex flex-col mt-10 px-[37px] py-[46px] rounded-[15px]">
      <h2 className="text-[28px] font-medium">Simulation Details</h2>
      <p className="text-[#7C7C80] text-[17px] mt-5">
        Configure your simulation by adding sections and tasks.
      </p>

      <SectionForm
        softwareOptions={softwareOptions}
        setSelectedSoftware={setSelectedSoftware}
        onCreateSection={handleCreateSection}
        onSectionCreated={handleSectionCreated}
        existingSoftwareIds={sections.map((s) => s.software)}
      />

      {sections.map((section) => (
        <SectionCard
          key={section.id}
          section={section}
          softwareOptions={softwareOptions}
          onRemove={handleRemoveSection}
          onAddTask={handleAddTask}
          onAddTaskForm={handleAddTaskForm}
          setSections={setSections}
        />
      ))}
    </div>
  );
};
