import { getScreen } from "@/http/api.js";
import { useQuery } from "@tanstack/react-query";

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () =>
      getScreen({
        ScreenName: "CompanyMaster",
        LookUpKey: "GetList",
        Filter1: "",
        Filter2: "",
        Filter3: "",
        Filter4: "",
        Filter5: "",
      }),
    retry: 2,
  });
}



