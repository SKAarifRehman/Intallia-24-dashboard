import { getScreen, addSection, addJobSimulation } from "@/http/api.js";
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

export function useAddJobSimulation() {
  return useMutation({
    mutationFn: async (payload: { JSON: string }) => {
      return await addJobSimulation(payload);
    },
    onSuccess: (data) => {
      console.log("Job simulation added successfully:", data);
      toast.success("Job simulation added successfully");
    },
    onError: (error: unknown) => {
      console.error("Add job simulation failed:", error);
      toast.error("Failed to add job simulation");
    },
  });
}


//Section Queries
export function useAddSection() {
  return useMutation({
    mutationFn: async (data) => {
        const result = await addSection(data);
        return result;
    },
    onSuccess: (data) => {
      // Handle success (e.g., show toast)
      console.log("Section added successfully:", data);
      toast.success("Section added successfully");
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
