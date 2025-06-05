import { create } from "zustand";
import {
  SimulationSchemaType as SimulationFormValues,
} from "@/schema/simulationSchema";
// Define more explicit types for better maintainability
type SimulationItem = Record<string, SimulationFormValues>;
type Section = Record<string, unknown>;
type Task = Record<string, unknown>;

interface SimulationState {
  simulation: SimulationItem | null;
  section: Section | null;
  task: Task | null;
  setSection: (section: Section | null) => void;
  setTask: (task: Task | null) => void;
  setSimulation: (simulation: SimulationItem | null) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  simulation: null,
  section: null,
  task: null,

  setSection: (section) => set({ section }),
  setTask: (task) => set({ task }),
  setSimulation: (simulation) => set({ simulation }),
}));
