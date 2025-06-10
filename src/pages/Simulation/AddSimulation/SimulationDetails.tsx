import { useState, useEffect } from "react";
import { TaskForm } from "./TaskForm";
import { X, Save } from "lucide-react";
import { initialTaskCounts } from "@/constants/simulationConstants";
import SelectField from "@/components/common/SelectField";
import { Task, SoftwareSection, TaskCounts, SoftwareType } from "@/types";
import { UploadField } from "./UploadField";
import { SectionForm } from "./SectionForm";
import { toast } from "sooner";

export const SimulationDetails = () => {
  const [sections, setSections] = useState<SoftwareSection[]>([]);
  const [selectedSoftware, setSelectedSoftware] = useState<string>("");
  const [taskCounts, setTaskCounts] = useState<TaskCounts>(initialTaskCounts);

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

  const handleCreateSection = () => {
    if (!selectedSoftware) {
      toast.error("Error", "Please select a software first");
      return;
    }

    if (sections.some((section) => section.software === selectedSoftware)) {
      toast.error("Error", `A section for ${selectedSoftware} already exists`);
      return;
    }

    const newSection: SoftwareSection = {
      id: Date.now().toString(),
      software: selectedSoftware as SoftwareType,
      tasks: [],
    };

    setSections([...sections, newSection]);
    setSelectedSoftware("");

    toast.success(
      "New section created",
      `A new ${selectedSoftware} section has been created successfully`
    );
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

    toast.info("Section removed", "The section has been removed successfully");
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

      toast.success(
        "Task added",
        `A new task has been added to ${section.software} section`
      );
    }
  };

  // Unified toast for file upload (to be passed to UploadField)
  const handleFileUploadToast = (fileName: string) => {
    toast.success("File uploaded", `${fileName} has been uploaded successfully`);
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
          onFileUploadToast={handleFileUploadToast}
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
                      toast.success(
                        "Section saved",
                        `The ${section.software} section has been saved`
                      );
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
