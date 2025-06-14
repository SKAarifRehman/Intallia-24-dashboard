  import { useState, useEffect, useMemo } from "react";
  import { TaskForm } from "./TaskForm";
  import { X, Save, Plus } from "lucide-react";
  import { initialTaskCounts } from "@/constants/simulationConstants";
  import { Task, SoftwareSection, TaskCounts, SoftwareType } from "@/types";
  import { SectionForm } from "./SectionForm";
  import { toast } from "sonner";
  import { useSoftware } from "@/queries/simulationQueries";

  export const SimulationDetails = () => {
    const { data: Software, isSuccess } = useSoftware();
    const [sections, setSections] = useState<SoftwareSection[]>([]);
    const [selectedSoftware, setSelectedSoftware] = useState<string>("");
    const [taskCounts, setTaskCounts] = useState<TaskCounts>(initialTaskCounts);

    useEffect(() => {
      const event = new CustomEvent("simulationTaskCountsUpdated", {
        detail: taskCounts,
      });
      window.dispatchEvent(event);
    }, [taskCounts]);

    console.log("Software Data:", Software);

    const softwareOptions = useMemo(() => {
      if (isSuccess && Software?.LookupData) {
        return Software.LookupData.map((item) => ({
          value: item.SoftwareId,
          label: item.Name,
        }));
      }
      return [];
    }, [isSuccess, Software]);


    console.log("Software Options:", softwareOptions);

    const handleCreateSection = () => {
      if (!selectedSoftware) {
        toast.error("Please select a software first");
        return;
      }

      if (sections.some((section) => section.software === selectedSoftware)) {
        toast.error(`A section for ${selectedSoftware} already exists`);
        return;
      }

      // Generate SectionId here or get from API response after creation
      const newSectionId = Date.now().toString();

      const newSection: SoftwareSection = {
        id: newSectionId,
        software: selectedSoftware as SoftwareType,
        tasks: [],
        SectionId: newSectionId, // Add SectionId property
      };

      setSections([
        ...sections,
        {
          ...newSection,
          tasks: [],
        },
      ]);

      setSelectedSoftware("");
    };

    const handleSectionCreated = (sectionData: any) => {
    const softwareId = sectionData?.Header?.[0]?.SoftwareId;
    const sectionId = sectionData?.Header?.[0]?.SectionId;

    console.log("Section created with data:", sectionData);

    if (!softwareId || !sectionId) return;

    const newSection: SoftwareSection = {
      id: sectionId,
      SectionId: sectionId,
      software: softwareId,
      tasks: [],
    };

    setSections((prev) => [...prev, newSection]);
    setSelectedSoftware(""); // Clear software after adding
  };



    const handleRemoveSection = (id: string) => {
      const sectionToRemove = sections.find((section) => section.id === id);

      if (sectionToRemove) {
        const updatedCounts = {
          ...taskCounts,
          [sectionToRemove.software]:
            taskCounts[sectionToRemove.software] - sectionToRemove.tasks.length,
        };
        setTaskCounts(updatedCounts);
      }

      setSections(sections.filter((section) => section.id !== id));
      toast.info("Section removed successfully");
    };

    const handleAddTask = (sectionId: string, task: Task) => {
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === sectionId
            ? { ...section, tasks: [...section.tasks, task] }
            : section,
        ),
      );

      const section = sections.find((s) => s.id === sectionId);
      if (section) {
        const updatedCounts = {
          ...taskCounts,
          [section.software]: taskCounts[section.software] + 1,
        };
        setTaskCounts(updatedCounts);
      }
    };

    const handleAddTaskForm = (sectionId: string) => {
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                tasks: [
                  ...section.tasks,
                  { id: "", description: "", temp: true },
                ],
              }
            : section,
        ),
      );
    };

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

        {sections.map((section) => {
          const tasksToRender = section.tasks.filter((t) => !t.id); // form entries
          const savedTasks = section.tasks.filter((t) => t.id); // saved entries

          return (
            <div
              key={section.id}
              className="bg-[#F8F8F8] border mt-8 rounded-lg overflow-hidden"
            >
              <div className="bg-[#EFEFEF] px-4 py-3 flex justify-between items-center">
                <h4 className="text-lg font-medium">
                  {
                    softwareOptions.find(
                      (option) => option.value === section.software,
                    )?.label
                  }
                </h4>
                <button
                  onClick={() => handleRemoveSection(section.id)}
                  className="text-[#FF3A3A] hover:bg-red-50 p-1 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {/* Render saved tasks summary */}
                {savedTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="bg-white mb-4 p-4 rounded-lg border border-[#E5E5EA]"
                  >
                    <h5 className="font-medium">Task {index + 1}</h5>
                    <p className="text-sm text-[#7C7C80] mt-2">
                      {task.description}
                    </p>
                  </div>
                ))}

                {/* Render form-based tasks (unsaved or new forms) */}
                {tasksToRender.map((_, i) => (
                  <TaskForm
                    key={`form-${i}`}
                    sectionId={section.id}
                    software={section.software}
                    softwareOptions={softwareOptions}
                    taskNumber={savedTasks.length + i + 1}
                    onAddTask={(task) => {
                      handleAddTask(section.id, {
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

                {/* Add new empty form */}
                <button
                  onClick={() => handleAddTaskForm(section.id)}
                  className="bg-[#06B2E1] text-white px-8 py-3 rounded-full flex items-center gap-2 mt-2"
                >
                  <Plus size={18} />
                  <span>Add Task</span>
                </button>
              </div>

              {/* <div className="px-6 py-4 flex justify-between">
                <button
                  onClick={() => {
                    toast.success(
                      `The ${section.software} section has been saved`,
                    );
                  }}
                  className="bg-[#06B2E1] text-white px-8 py-3 rounded-full flex items-center gap-2"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
              </div> */}
            </div>
          );
        })}
      </div>
    );
  };
