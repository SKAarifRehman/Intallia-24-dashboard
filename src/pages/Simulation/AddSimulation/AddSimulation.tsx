import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ContentSection } from "@/pages/Simulation/AddSimulation/ContentSection";
import { SimulationDetails } from "@/pages/Simulation/AddSimulation/SimulationDetails/SimulationDetails";
import { SimulationForm } from "@/pages/Simulation/AddSimulation/SimulationForm";
import { initialTaskCounts } from "@/constants/simulationConstants";
import type { TaskCounts } from "@/types";
import { useSimulationData } from "@/queries/simulationQueries";
import { useAuthStore } from "@/store/authStore";

const AddSimulation = () => {
  const { simulationId } = useParams<{ simulationId?: string }>();
  const location = useLocation();
  const { companyId } = useAuthStore((state) => state);
  const [taskCounts, setTaskCounts] = useState<TaskCounts>(initialTaskCounts);
  const [softwareOptions, setSoftwareOptions] = useState<{ label: string; value: string }[]>([]);

  const { data: simulationData } = useSimulationData(simulationId, companyId);
  const isNewSimulation = location.pathname === "/simulation/new-simulation";

  return (
    <MainLayout>
      <div className="bg-[#F8F9FA] flex flex-wrap items-start gap-[35px] overflow-hidden p-8">
        <div className="grow shrink-0 basis-0 w-fit max-md:max-w-full">
          <div className="flex flex-wrap items-stretch justify-between w-full">
            <h1 className="page-heading">Create New Simulation</h1>
            <div className="flex gap-1.5 flex-wrap max-md:max-w-full">
              <div className="flex items-center gap-[19px] text-[17px] text-[#06B2E1] font-medium text-center tracking-[-0.41px] leading-none flex-wrap grow shrink basis-auto max-md:max-w-full">
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

          <div className="flex w-full justify-between mt-16 max-md:mt-10 max-md:flex-wrap">
            <div className="w-full lg:w-1/4">
              <ContentSection
                taskCounts={taskCounts}
                softwareOptions={softwareOptions}
              />
            </div>
            <div className="mt-1.5 lg:w-3/4">
              <SimulationForm simulation={simulationData?.Header[0]} />
              {!isNewSimulation && (
                <SimulationDetails
                  setSoftwareOptions={setSoftwareOptions}
                  taskCounts={taskCounts}
                  setTaskCounts={setTaskCounts}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddSimulation;
