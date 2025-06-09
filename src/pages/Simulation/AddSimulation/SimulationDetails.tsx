import { useState, useEffect } from "react";
import { TaskForm } from "./TaskForm";
import { useToast } from "@/hooks/use-toast";
import { X, Save } from "lucide-react";
import { initialTaskCounts } from "@/constants/simulationConstants";
import { Task, SoftwareSection, TaskCounts, SoftwareType } from "@/types";

export const SimulationDetails = () => {
  const { toast } = useToast();
  const [sections, setSections] = useState<SoftwareSection[]>([]);
  const [selectedSoftware, setSelectedSoftware] = useState<string>("");

  const [taskCounts, setTaskCounts] = useState<TaskCounts>(initialTaskCounts);

  // Effect to dispatch task c ount updates
  useEffect(() => {
    const event = new CustomEvent("simulationTaskCountsUpdated", {
      detail: taskCounts,
    });
    window.dispatchEvent(event);
  }, [taskCounts]);

  const softwareOptions = [
    { value: "MS Excel", label: "MS Excel" },
    { value: "MS Word", label: "MS Word" },
    { value: "Google Sheets", label: "Google Sheets" },
    { value: "Google Docs", label: "Google Docs" },
    { value: "MS Powerpoint", label: "MS Powerpoint" },
    { value: "Google Slides", label: "Google Slides" },
  ];

  // Prevent duplicate section for the same software
  const handleCreateSection = () => {
    if (!selectedSoftware) {
      toast({
        title: "Error",
        description: "Please select a software first",
        variant: "destructive",
      });
      return;
    }

    if (sections.some((section) => section.software === selectedSoftware)) {
      toast({
        title: "Error",
        description: `A section for ${selectedSoftware} already exists`,
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

      updatedSections[sectionIndex] = {
        ...section,
        tasks: [...section.tasks, task],
      };

      setSections(updatedSections);

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

        {/* FLEX-NOWRAP for single line, gap for spacing */}
        <div className="self-stretch flex flex-nowrap items-center gap-6 font-normal mt-[30px]">
          <div className="flex-1 min-w-[220px] max-w-[250px]">
            <SelectField
              label="Select Software"
              required
              className="w-full"
              value={selectedSoftware}
              onChange={(value: string) =>
                setSelectedSoftware(value as SoftwareType)
              }
              options={softwareOptions}
            />
          </div>
          <div className="flex-1 min-w-[220px] max-w-[250px]">
            <UploadField
              label="Upload Student File"
              required
              icon="https://cdn.builder.io/api/v1/image/assets/d6885eedf052436eac8c331fe6a68cb8/1c304427fca5f42895e6397e016eaaa454443eed82724c05d714aaa887b33e39?placeholderIfAbsent=true"
              placeholder="Upload"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              className="w-full"
            />
          </div>
          <div className="flex-1 min-w-[220px] max-w-[250px]">
            <UploadField
              label="Upload Master JSON"
              required
              icon="https://cdn.builder.io/api/v1/image/assets/d6885eedf052436eac8c331fe6a68cb8/35e4a924501edc645cf40e324b54fd6d577032055217641815c1e0737c31f635?placeholderIfAbsent=true"
              placeholder="Upload JSON"
              accept=".json"
              className="w-full"
            />
          </div>
        </div>

        <button
          type="button"
          className="bg-[rgba(6,178,225,1)] gap-2.5 text-xl text-white font-semibold text-start tracking-[0.38px] leading-none mt-[30px] px-8 py-4 rounded-[48px] w-[215px]"
          onClick={handleCreateSection}
        >
          Create Section
        </button>

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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
