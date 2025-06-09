import { Simulation } from "@/types";
import React from "react";
import { useNavigate } from "react-router-dom";

export const SimulationCard: React.FC<Simulation> = ({
  SimulationId: id,
  CompanyId,
  Name: name,
  Description: description,
  CreateDate: createdDate,
  Guided: isGuided = false,
  Paid: isPaid = false,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/simulation/${id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="text-left shadow-[0px_3.5px_5.5px_0px_rgba(0,0,0,0.04)] bg-white flex flex-col items-stretch justify-center w-[225px] h-[260px] px-4 py-[30px] rounded-[15px]"
    >
      <div className="flex flex-col items-stretch h-full">
        <div className="w-full">
          <div className="text-[22px] font-medium leading-[28px] tracking-[0.36px] bg-clip-text bg-[linear-gradient(90deg,#0DAFDC_0%,#22E9A2_100%)] text-center font-plusJakarta text-[#06B2E1] ">
            <h1 className="bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
              {name}
            </h1>
          </div>
          <div className="text-[#7C7C80] tracking-[-0.32px] mt-[12px] text-center leading-[16px] font-regular">
            {description}
          </div>
        </div>
        <div className="self-center w-full max-w-full text-sm text-[#242426] font-normal tracking-[-0.32px] leading-none mt-auto text-center font-regular">
          <div>
            Created On:{" "}
            {new Date(createdDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="mt-[10px]">{isGuided ? "Guided" : "Unguided"}</div>
          {isPaid && <div className="mt-[10px]">Paid</div>}
        </div>
      </div>
    </button>
  );
};
