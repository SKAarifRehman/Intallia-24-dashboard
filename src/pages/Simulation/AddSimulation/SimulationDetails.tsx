import { useState, useEffect, useMemo } from "react";
import { TaskForm } from "./TaskForm";
import { useToast } from "@/hooks/use-toast";
import { X, Save } from "lucide-react";
import { SectionForm } from "./SectionForm";
import { useSoftware } from "@/queries/simulationQueries";
import { initialTaskCounts } from "@/constants/simulationConstants";
import { Task, SoftwareSection, TaskCounts, SoftwareType } from "@/types";


export const SimulationDetails = () => {
  const { data: Software, isSuccess } = useSoftware();
  const { toast } = useToast();
  const [sections, setSections] = useState<SoftwareSection[]>([]);
  const [selectedSoftware, setSelectedSoftware] = useState<string>("");

  const [taskCounts, setTaskCounts] =
    useState<TaskCounts>(initialTaskCounts);

  // Effect to dispatch task c ount updates
  useEffect(() => {
    // Dispatch the event to notify Index component
    const event = new CustomEvent("simulationTaskCountsUpdated", {
      detail: taskCounts,
    });
    window.dispatchEvent(event);
  }, [taskCounts]);

    const softwareOptions = useMemo(() => {
      if (isSuccess && Software?.LookupData) {
        return Software.LookupData.map((item) => ({
          value: item.SoftwareId,
          label: item.Name,
        }));
      }
      return [];
    }, [isSuccess, Software]);

  const handleCreateSection = () => {
    if (!selectedSoftware) {
      toast({
        title: "Error",
        description: "Please select a software first",
        variant: "destructive",
      });
      return;
    }

    const newSection: SoftwareSection = {
      id: Date.now().toString(),
      software: selectedSoftware as SoftwareType,
      tasks: [],
    };

    setSections([...sections, newSection]);
    setSelectedSoftware("");

    toast({
      title: "New section created",
      description: `A new ${selectedSoftware} section has been created successfully`,
    });
  };

  const handleRemoveSection = (id: string) => {
    const sectionToRemove = sections.find((section) => section.id === id);

    if (sectionToRemove) {
      // Update task counts when removing a section
      const updatedCounts = {
        ...taskCounts,
        [sectionToRemove.software]:
          taskCounts[sectionToRemove.software] - sectionToRemove.tasks.length,
      };
      setTaskCounts(updatedCounts);
    }

    setSections(sections.filter((section) => section.id !== id));

    toast({
      title: "Section removed",
      description: "The section has been removed successfully",
    });
  };

  const handleAddTask = (sectionId: string, task: Task) => {
    const sectionIndex = sections.findIndex((s) => s.id === sectionId);

    if (sectionIndex !== -1) {
      const updatedSections = [...sections];
      const section = updatedSections[sectionIndex];

      // Add task to this section
      updatedSections[sectionIndex] = {
        ...section,
        tasks: [...section.tasks, task],
      };

      setSections(updatedSections);

      // Update the overall task counts for this software type
      const updatedCounts = {
        ...taskCounts,
        [section.software]: taskCounts[section.software] + 1,
      };
      setTaskCounts(updatedCounts);

      toast({
        title: "Task added",
        description: `A new task has been added to ${section.software} section`,
      });
    }
  };

  return (
    <div className="shadow-[0px_3.5px_5.5px_0px_rgba(0,0,0,0.04)] bg-white w-[90%] flex flex-col items-stretch justify-center mt-10 px-[37px] py-[46px] rounded-[15px]">
      <div className="flex w-full flex-col">
        <div className="w-full">
          <h2 className="text-[#242426] text-[28px] font-medium leading-none tracking-[0.36px] ">
            Simulation Details
          </h2>
          <p className="text-[#7C7C80] text-[17px] font-normal leading-[22px] tracking-[-0.41px] mt-5">
            Lorem ipsum dolor sit amet consectetur. Nunc eget velit ac tincidunt
            sodales condimentum. Quis integer commodo facilisi ac faucibus
            nulla. Congue parturient a mus nulla pretium mi massa fringilla mi.
            Urna a amet dis tristique suscipit. Vulputate.
          </p>
        </div>
        <SectionForm
          softwareOptions={softwareOptions}
          setSelectedSoftware={setSelectedSoftware}
          setSections={handleCreateSection}
        />
        {sections.length > 0 && (
          <div className="mt-8 space-y-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className="rounded-lg overflow-hidden bg-[#F8F8F8] border border-[#E5E5EA]"
              >
                <div className="px-4 py-3 bg-[#EFEFEF] flex justify-between items-center">
                  <h4 className="text-[#242426] text-lg font-medium">
                    {section.software}
                  </h4>
                  <button
                    onClick={() => handleRemoveSection(section.id)}
                    className="text-[#FF3A3A] hover:bg-red-50 p-1 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6">
                  {section.tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="bg-white mb-4 p-4 rounded-lg border border-[#E5E5EA]"
                    >
                      <h5 className="font-medium">Task {index + 1}</h5>
                      <p className="text-sm text-[#7C7C80] mt-2 ">
                        {task.description}
                      </p>
                    </div>
                  ))}

                  <TaskForm
                    sectionId={section.id}
                    software={section.software}
                    taskNumber={section.tasks.length + 1}
                    onAddTask={(task) => handleAddTask(section.id, task)}
                  />
                </div>

                <div className="px-6 py-4 flex justify-between">
                  <button
                    onClick={() => {
                      toast({
                        title: "Section saved",
                        description: `The ${section.software} section has been saved`,
                      });
                    }}
                    className="bg-[#06B2E1] text-white px-8 py-3 rounded-full flex items-center gap-2"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>

                  <button
                    onClick={() => {
                      // Add a new section with the same software type
                      const newSection: SoftwareSection = {
                        id: Date.now().toString(),
                        software: section.software,
                        tasks: [],
                      };
                      setSections([...sections, newSection]);

                      toast({
                        title: "Section added",
                        description: `A new ${section.software} section has been added`,
                      });
                    }}
                    className="border border-[#06B2E1] text-[#06B2E1] px-8 py-3 rounded-full"
                  >
                    Add Section
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
