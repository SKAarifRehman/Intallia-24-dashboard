import { useState, useEffect, useMemo } from "react";
import { ContentSection } from "@/pages/Simulation/AddSimulation/ContentSection";
import {
  SimulationDetails,
  TaskCounts,
  getInitialTaskCounts,
} from "@/pages/Simulation/AddSimulation/SimulationDetails";
import { SimulationForm } from "@/pages/Simulation/AddSimulation/SimulationForm";
import { MainLayout } from "@/components/layout/MainLayout";
import { useSoftware } from "@/queries/simulationQueries";

const AddSimulation = () => {
  const { data: Software, isLoading, isError, isSuccess } = useSoftware();
  const [taskCounts, setTaskCounts] =
    useState<TaskCounts>(getInitialTaskCounts);

  const softwareOptions = useMemo(() => {
    if (isSuccess && Software?.LookupData) {
      return Software.LookupData.map((item) => ({
        value: item.SoftwareId,
        label: item.Name,
      }));
    }
    return [];
  }, [isSuccess, Software]);

  // Listen for task count changes
  useEffect(() => {
    // Function to handle updates from SimulationDetails
    const handleTaskCountUpdate = (event: CustomEvent<TaskCounts>) => {
      if (event.detail) {
        setTaskCounts(event.detail);

        // Dispatch a custom event to notify ContentSection about task count changes
        const contentEvent = new CustomEvent("taskCountsUpdated", {
          detail: event.detail,
        });
        window.dispatchEvent(contentEvent);
      }
    };

    // Listen for updates from SimulationDetails
    window.addEventListener(
      "simulationTaskCountsUpdated",
      handleTaskCountUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        "simulationTaskCountsUpdated",
        handleTaskCountUpdate as EventListener,
      );
    };
  }, []);

  return (
    <MainLayout>
      <div className="bg-[#F8F9FA] flex items-start gap-[35px] overflow-hidden flex-wrap p-8 ">
        <div className="grow shrink-0 basis-0 w-fit max-md:max-w-full">
          <div className="flex items-stretch flex-wrap justify-between w-full">
            <h1 className="page-heading">Create New Simulation</h1>

            <div className="flex gap-1.5 flex-wrap max-md:max-w-full">
              <div className="flex items-center gap-[19px] text-[17px] text-[#06B2E1] font-medium text-center tracking-[-0.41px] leading-none flex-wrap grow shrink basis-auto max-md:max-w-full">
                <button className="bg-[rgba(6,178,225,1)] self-stretch text-white font-semibold my-auto px-4 py-2 rounded-[48px]">
                  Add New Simulation
                </button>
                <button className="border self-stretch my-auto px-4 py-2 rounded-[48px] border-[rgba(6,178,225,1)] border-solid">
                  Save & Exit
                </button>
                <button className="border self-stretch whitespace-nowrap my-auto px-4 py-2 rounded-[48px] border-[rgb(6,178,225)] border-solid">
                  Save
                </button>
                <button className="border border-[color:var(--alerts-red,#FF3A3A)] self-stretch text-[#FF3A3A] whitespace-nowrap my-auto px-4 py-2 rounded-[48px] border-solid">
                  Delete
                </button>
              </div>

              <div className="border border-[color:var(--Primary-Pallet-grey-00,#E5E5EA)] flex flex-col items-stretch text-[15px] text-[#7C7C80] font-normal whitespace-nowrap tracking-[-0.24px] leading-none justify-center grow shrink-0 basis-0 w-fit p-px rounded-lg border-solid">
                <div className="bg-white flex items-stretch gap-3 px-2 py-2.5 rounded-lg">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/d6885eedf052436eac8c331fe6a68cb8/8e486221a3aa872ac6493495dbd34cf8ae8115ffbb9b58307261e5e928976bf0?placeholderIfAbsent=true"
                    className="aspect-[1] object-contain w-4 shrink-0"
                    alt="Search"
                  />
                  <input
                    type="text"
                    placeholder="Search"
                    className="grow shrink w-[280px] basis-auto my-auto bg-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full max-md:flex-wrap justify-between mt-16 max-md:mt-10">
            <div className="w-full lg:w-1/4">
              <ContentSection />
            </div>

            <div className="mt-1.5  lg:w-3/4  ">
              <SimulationForm softwareOptions={softwareOptions} />
              <SimulationDetails softwareOptions={softwareOptions} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddSimulation;
