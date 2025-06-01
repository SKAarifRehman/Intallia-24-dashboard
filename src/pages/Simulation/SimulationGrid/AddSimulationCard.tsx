import React from "react";
import { useNavigate } from "react-router-dom";

export const AddSimulationCard: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/simulation/new-simulation");
  };

  return (
    <button
      onClick={handleClick}
      className="shadow-[0px_3.5px_5.5px_0px_rgba(0,0,0,0.04)] bg-white flex flex-col items-center justify-center text-[22px] text-[#242426] font-medium tracking-[0.36px] leading-[28px] w-[225px] h-[260px] px-3 py-4 rounded-[15px]"
    >
      <div className="bg-[#06B2E1] flex w-[100px] shrink-0 h-[100px] rounded-[2500px]">
        <svg
          className="m-auto text-[#444446] "
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5V19M5 12H19"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="mt-8">Add a New Simulation</div>
    </button>
  );
};
