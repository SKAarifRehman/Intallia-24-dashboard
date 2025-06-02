import { getScreen, addSection } from "@/http/api.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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



//Section Queries
export function useAddSection() {
  return useMutation({
    mutationFn: async (data) => {
        const result = await addSection(data);
        return result;
    },
    onError: (error: unknown) => {
      // Handle error globally (e.g., show toast)
      console.error("Add section failed:", error);
      toast.error("Add section failed")
    },
  });
}


//Software Queries
export function useSoftware() {
  return useQuery({
    queryKey: ["Software"],
    queryFn: () =>
      getScreen({
        ScreenName: "Software",
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
