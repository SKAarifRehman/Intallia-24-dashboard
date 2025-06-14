import { SimulationGrid } from '@/pages/Simulation/SimulationGrid/SimulationGrid';
import { Simulation } from '@/types';
import { getScreen, addSection, addJobSimulation, getJobSimulationById, addTask } from "@/http/api.js";
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
    refetchOnMount: true,           // Refetch every time component mounts
    refetchOnWindowFocus: true,
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

// get Simulation data by SimulationId
export function useSimulationData(SimulationId: string, CompanyId: string) {
  return useQuery({
    queryKey: ["JobSimulations", SimulationId],
    queryFn: () =>
      getJobSimulationById({
        JSON: JSON.stringify({
          Header: [{ SimulationId, CompanyId }],
          Response: [{ ResponseText: "", ErrorCode: "" }],
        }),
      }),
    enabled: !!(SimulationId && CompanyId),
    retry: 2,
  });
}



//Section Queries
export function useAddSection() {
  return useMutation({
    mutationFn: async (payload: { JSON: string }) => {
      const result = await addSection(payload);
      return result;
    },
    onSuccess: (data) => {
      console.log("Section added successfully:", data);
      // toast.success("Section added successfully");
    },
    onError: (error: unknown) => {
      // Handle error globally (e.g., show toast)
      console.error("Add section failed:", error);
      toast.error("Add section failed")
    },
  });
}


export function useAddTask() {
  return useMutation({
    mutationFn: async (payload: { JSON: string }) => {
      const { data } = await addTask(payload);
      return data;
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
