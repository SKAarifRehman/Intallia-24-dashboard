import { useEffect, useState } from "react";
import type { TaskCounts } from "@/types";
import { initialTaskCounts } from "@/constants/simulationConstants";

export const ContentSection = () => {
  const [taskCounts, setTaskCounts] = useState<TaskCounts>(
    initialTaskCounts
  );

  useEffect(() => {
    const handleStorageUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<TaskCounts>;
      if (customEvent.detail) {
        setTaskCounts(customEvent.detail);
      }
    };
    window.addEventListener("taskCountsUpdated", handleStorageUpdate);
    return () => {
      window.removeEventListener("taskCountsUpdated", handleStorageUpdate);
    };
  }, []);

  const softwareItems = Object.entries(taskCounts)
    .filter(([_, count]) => count > 0)
    .map(([software, count]) => ({
      software,
      count,
      active: true,
    }));

  return (
    <div className="flex flex-col">
      <h2 className="text-[#242426] text-[28px] font-medium leading-none tracking-[0.36px] font-plusJakarta">
        Content
      </h2>

      <div className="mt-[50px] text-xl font-medium flex gap-2 text-[#AEAEB2]">
        <p className="text-6xl">|</p>
        <div className="flex gap-2 flex-col">
          {softwareItems.length === 0 ? (
            <>
              <h2 className="bg-clip-text bg-gradient-to-r from-[#06B2E1] to-[#09CE88] text-transparent text-2xl font-bold">
                0 Task
              </h2>
              <h2>No Content</h2>
            </>
          ) : (
            softwareItems.map((item, idx) => (
              <div key={item.software} className={idx > 0 ? "mt-6" : ""}>
                <h2 className="bg-clip-text bg-gradient-to-r from-[#06B2E1] to-[#09CE88] text-transparent text-2xl font-bold">
                  {item.count} {item.count === 1 ? "Task" : "Tasks"}
                </h2>
                <h2 className="bg-clip-text bg-gradient-to-r from-[#06B2E1] to-[#09CE88] text-transparent">
                  {item.software}
                </h2>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
