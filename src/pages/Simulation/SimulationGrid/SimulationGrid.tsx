import React, { useEffect } from "react";
import { SimulationCard } from "./SimulationCard";
import { AddSimulationCard } from "./AddSimulationCard";
import { useJobSimulation } from "@/queries/simulationQueries";

// const simulationData = Array(14)
//   .fill(null)
//   .map((_, index) => ({
//     id: index + 1,
//     title: "Microsoft Excel",
//     description: "Lorem ipsum dolor sit amet consectetur.",
//     createdDate: "14 Jan 2024",
//     isGuided: true,
//     isPaid: true,
//   }));

export const SimulationGrid: React.FC = () => {
  // Get the simulation data
  const {
    data: Simulation,
    isLoading,
    isError,
    isSuccess,
  } = useJobSimulation();
  console.log("Simulation:", Simulation);

  const cardsPerRow = 5;

  // Clone the simulation data to avoid modifying the original
  const allCards = (Simulation && [...Simulation.LookupData]) || [];

  // Create chunks of 5 cards each
  const chunks: JSX.Element[] = [];

  // First chunk will have the AddSimulationCard and 4 simulation cards
  chunks.push(
    <div
      key="row-0"
      className="flex items-start gap-[1rem] flex-wrap mt-5 max-md:max-w-full"
    >
      <AddSimulationCard />
      {allCards.slice(0, 4).map((simulation, index) => (
        <SimulationCard key={`first-row-${index}`} {...simulation} />
      ))}
    </div>,
  );

  // Process the remaining cards in chunks of 5
  for (let i = 4; i < allCards.length; i += cardsPerRow) {
    const rowCards = allCards.slice(i, i + cardsPerRow);

    // If we have fewer than 5 cards for the last row, add dummy cards to maintain layout
    const rowIndex = Math.floor(i / cardsPerRow) + 1;

    chunks.push(
      <div
        key={`row-${rowIndex}`}
        className="flex items-start gap-[1rem] flex-wrap max-md:max-w-full"
      >
        {rowCards.map((simulation, index) => (
          <SimulationCard
            key={`row-${rowIndex}-card-${index}`}
            {...simulation}
          />
        ))}

        {/* Add empty space fillers if needed to maintain 5 cards per row */}
        {rowCards.length < cardsPerRow &&
          Array(cardsPerRow - rowCards.length)
            .fill(null)
            .map((_, index) => (
              <div
                key={`filler-${index}`}
                className="w-[225px] h-[225px] invisible"
              />
            ))}
      </div>,
    );
  }

  useEffect(() => {
    console.log("Rendering SimulationGrid with data:", allCards);
  }, [allCards]);

  return <div className="flex flex-col gap-[1rem]">{chunks}</div>;
};
