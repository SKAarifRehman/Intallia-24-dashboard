import { getScreen } from "@/http/api.js";
import { useQuery } from "@tanstack/react-query";

export function useJobSimulation() {
  return useQuery({
    queryKey: ["JobSimulations"],
    queryFn: () =>
      getScreen({
        ScreenName: "JobSimulation",
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
