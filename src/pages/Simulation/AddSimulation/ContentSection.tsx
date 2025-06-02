import { useEffect, useState } from "react";
import { getInitialTaskCounts, TaskCounts } from "./SimulationDetails";

export const ContentSection = () => {
  const [taskCounts, setTaskCounts] = useState<TaskCounts>(
    getInitialTaskCounts,
  );

  // This effect listens for changes to the taskCounts in local storage
  useEffect(() => {
    // Function to update task counts when custom event is fired
    const handleStorageUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<TaskCounts>;
      if (customEvent.detail) {
        console.log("ContentSection received task counts:", customEvent.detail);
        setTaskCounts(customEvent.detail);
      }
    };

    // Listen for the custom event
    window.addEventListener("taskCountsUpdated", handleStorageUpdate);

    return () => {
      window.removeEventListener("taskCountsUpdated", handleStorageUpdate);
    };
  }, []);

  // Convert taskCounts object to array for rendering and filter out zero-count tasks
  const softwareItems = Object.entries(taskCounts)
    .filter(([_, count]) => count > 0) // Only include items with counts greater than zero
    .map(([software, count]) => ({
      software,
      count,
      active: true, // All items in the filtered list are active
    }));

  // If no tasks have counts greater than zero, show a message
  if (softwareItems.length === 0) {
    return (
      <div className="flex flex-col">
        <h2 className="text-[#242426] text-[28px] font-medium leading-none tracking-[0.36px] font-plusJakarta">
          Content
        </h2>
        <div className="mt-[50px] text-xl font-medium flex gap-2 text-[#AEAEB2] hover:text-transparent hover:bg-gradient-to-r hover:from-[#06B2E1] hover:to-[#09CE88] hover:bg-clip-text transition duration-300">
          <p className=" text-6xl  ">|</p>
          <div className="flex gap-2 flex-col">
            <h2 className=" Gradient">1 Task</h2>
            <h2>Microsoft Excel</h2>
          </div>
        </div>

        <div className="mt-[50px] text-xl font-medium flex gap-2 text-[#AEAEB2] hover:text-transparent hover:bg-gradient-to-r hover:from-[#06B2E1] hover:to-[#09CE88] hover:bg-clip-text transition duration-300">
          <p className="   text-6xl  ">|</p>
          <div className="flex gap-2 flex-col">
            <h2 className=" Gradient">1 Task</h2>
            <h2>Microsoft Excel</h2>
          </div>
        </div>

        <div className="mt-[50px] text-xl font-medium flex gap-2 text-[#AEAEB2] hover:text-transparent hover:bg-gradient-to-r hover:from-[#06B2E1] hover:to-[#09CE88] hover:bg-clip-text transition duration-300">
          <p className="   text-6xl  ">|</p>
          <div className="flex gap-2 flex-col">
            <h2 className=" Gradient">1 Task</h2>
            <h2>Microsoft Excel</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-stretch ">
      <h2 className="text-[#242426] text-[28px] font-medium leading-none tracking-[0.36px]  ">
        Content
      </h2>
      <div className="flex items-stretch gap-3 mt-[50px] ">

        <div>
          {softwareItems.map((item, index) => (
            <div
              key={item.software}
              className={`flex shrink-0 h-[57px] ${
                index > 0 ? "mt-7" : ""
              } bg-[rgba(6,178,225,0.1)]`}
            />
          ))}
        </div>
        <div className="flex flex-col items-stretch text-xl font-medium tracking-[0.38px] leading-none ">
          {softwareItems.map((item, index) => (
            <div key={item.software}>
              <div className={index > 0 ? "mt-[27px]" : ""}>
                <div className="bg-clip-text bg-[linear-gradient(90deg,#06B2E1_0%,#09CE88_100%)]">
                  {item.count} {item.count === 1 ? "Task" : "Tasks"}
                </div>
                <div className="bg-clip-text bg-[linear-gradient(90deg,#06B2E1_0%,#09CE88_100%)] mt-2">
                  {item.software}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
