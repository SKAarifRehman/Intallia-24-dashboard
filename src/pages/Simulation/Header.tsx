import { SearchBar } from "@/components/common/SearchBar";
import React from "react";

export const Header: React.FC = () => {
  const buttonStyle = `justify-center items-center border border-[#06B2E1] flex gap-2 pl-4 pr-2 py-2 rounded-[48px] border-[#06B2E1] ring-1 ring-[#06B2E1] w-full xl:w-[164px] text-[#06B2E1]`;
  return (
    <div className="flex w-full items-start gap-5 flex-wrap justify-between max-md:max-w-full">
      <div className="flex items-stretch gap-5 w-full">
        <div className="flex flex-col items-stretch grow shrink-0 basis-0 w-full">
          <h1 className="page-heading">Simulation</h1>
          <div className="flex w-full items-center justify-between mt-7">
            <div className="flex items-center gap-5 text-base font-normal text-center tracking-[-0.32px] leading-none w-3/5">
              <button className={buttonStyle}>
                <span className="bg-clip-text bg-[linear-gradient(90deg,#0DAFDC_0%,#22E9A2_100%)] self-stretch my-auto">
                  Download PDF
                </span>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/4e93f2d3d72f4b58b47d979bd758d34a/ca3792439d7ace5d2af94c01af8c2633ce1b60e02de082499065ccfcb2b30be8?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                  alt=""
                />
              </button>
              <button className={buttonStyle}>
                <span className="bg-clip-text bg-[linear-gradient(90deg,#0DAFDC_0%,#22E9A2_100%)] self-stretch my-auto">
                  Export To Excel
                </span>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/4e93f2d3d72f4b58b47d979bd758d34a/e0b63f09b850ef592e93dbca4b752a2bf6d1b93246dcdccd8797515bdcb20bbb?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                  alt=""
                />
              </button>
              {/* <button className="justify-center items-center border border-[color:var(--grey-grey-04,#444446)] flex gap-2 text-base text-[#444446] font-normal text-center tracking-[-0.32px] leading-none pl-4 pr-2 py-2 rounded-[48px] border-solid w-auto">
                <span className="self-stretch my-auto">Filter By</span>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/4e93f2d3d72f4b58b47d979bd758d34a/970ab183fc63bec3816f49b36d23e1e5829a592da154f33540e313ef9cc4f59a?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                  alt=""
                />
              </button> */}
            </div>
            <div className="2/5">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
