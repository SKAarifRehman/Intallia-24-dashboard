import { create } from "zustand";

// Define more explicit types for better maintainability
type SimulationItem = Record<string, any>;
type Section = Record<string, any>;
type Task = Record<string, any>;

interface SimulationState {
  simulations: SimulationItem[];
  section: Section | null;
  task: Task | null;
  setSection: (section: Section | null) => void;
  setTask: (task: Task | null) => void;
  addSimulation: (simulation: SimulationItem) => void;
  removeSimulation: (index: number) => void;
  clearSimulations: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  simulations: [],
  section: null,
  task: null,

  setSection: (section) => set({ section }),
  setTask: (task) => set({ task }),

  addSimulation: (simulation) =>
    set((state) => ({
      simulations: [...state.simulations, simulation],
    })),

  removeSimulation: (index) =>
    set((state) => ({
      simulations: state.simulations.filter((_, i) => i !== index),
    })),

  clearSimulations: () => set({ simulations: [] }),
}));
