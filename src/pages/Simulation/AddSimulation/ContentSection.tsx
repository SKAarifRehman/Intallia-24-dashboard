/*************  ✨ Windsurf Command 🌟  *************/
// import { useMemo } from "react";
// import type { TaskCounts } from "@/types";

// interface ContentSectionProps {
//   taskCounts: TaskCounts;
//   softwareOptions: { label: string; value: string }[];
// }

// export const ContentSection = ({ taskCounts, softwareOptions }: ContentSectionProps) => {

//   console.log("Task Counts:", taskCounts);
//   console.log("Software Options:", softwareOptions);

//   const softwareItems = useMemo(() => {
//     return Object.entries(taskCounts)
//       .filter(([_, count]) => count > 0)
//       .map(([software, count]) => ({
//         software,
//         count,
//       }));
//   }, [taskCounts]);

//   console.log("Software Items:", softwareItems);

//   return (
//     <div className="flex flex-col">
//       <h2 className="text-[#242426] text-[28px] font-medium leading-none tracking-[0.36px] font-plusJakarta">
//         Content
//       </h2>

//       <div className="mt-[50px] text-xl font-medium flex gap-2 text-[#AEAEB2]">
//         <p className="text-6xl">|</p>
//         <div className="flex gap-2 flex-col">
//           {softwareItems.length === 0 ? (
//             <>
//               <h2 className="bg-clip-text bg-gradient-to-r from-[#06B2E1] to-[#09CE88] text-transparent text-2xl font-bold">
//                 0 Task
//               </h2>
//               <h2>No Content</h2>
//             </>
//           ) : (
//             softwareItems.map((item, idx) => (
//               <div key={item.software} className={idx > 0 ? "mt-6" : ""}>
//                 <h2 className="bg-clip-text bg-gradient-to-r from-[#06B2E1] to-[#09CE88] text-transparent text-2xl font-bold">
//                   {item.count} {item.count === 1 ? "Task" : "Tasks"}
//                 </h2>
//                 <h2>
//                   {
//                     softwareOptions.find((opt) => opt.value === item.software)
//                       ?.label || item.software
//                   }
//                 </h2>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

import { useMemo } from "react";
import type { TaskCounts } from "@/types";

interface ContentSectionProps {
  taskCounts: TaskCounts;
  softwareOptions: { label: string; value: string }[];
}

export const ContentSection = ({
  taskCounts,
  softwareOptions,
}: ContentSectionProps) => {
  console.log("Task Counts:", taskCounts);
  console.log("Software Options:", softwareOptions);

  const softwareItems = useMemo(() => {
    return Object.entries(taskCounts)
      .filter(([_, count]) => count > 0)
      .map(([software, count]) => ({
        software,
        count,
      }));
  }, [taskCounts]);

  console.log("Software Items:", softwareItems);

  return (
    <div className="flex flex-col">
      <h2 className="text-[#242426] text-[28px] font-medium leading-none tracking-[0.36px] font-plusJakarta">
        Content
      </h2>

      <div className="mt-[50px] text-xl font-medium flex gap-2 text-[#AEAEB2]">
        {/* Always-visible vertical bar */}

        <div className="flex gap-2 flex-col">
          {softwareItems.length === 0 ? (
            <div className="flex items-center">
              <p className="text-6xl leading-none">|</p>
              <div>
                <h2 className="bg-clip-text bg-gradient-to-r from-[#06B2E1] to-[#09CE88] text-transparent text-2xl font-bold">
                  0 Task
                </h2>
                <h2>No Content</h2>
              </div>
            </div>
          ) : (
            softwareItems.map((item, idx) => (
              <div key={item.software} className={idx > 0 ? "mt-6" : ""}>
                <div className="flex items-center">
                  <p className="text-6xl leading-none">|</p>
                  <div>
                    <h2 className="bg-clip-text bg-gradient-to-r from-[#06B2E1] to-[#09CE88] text-transparent text-2xl font-bold">
                      {item.count} {item.count === 1 ? "Task" : "Tasks"}
                    </h2>
                    <h2>
                      {softwareOptions.find(
                        (opt) => opt.value === item.software,
                      )?.label || item.software}
                    </h2>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/*******  ae92208d-0389-49b7-b14f-213c09cca0d4  *******/
