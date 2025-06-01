import { z } from "zod";

const simulationSchema = z.object({
  plane: z.string().min(1, "Plane is required"),
  simulationName: z.string().min(1, "Simulation Name is required"),
  cardDescription: z.string().min(1, "Card Description is required"),
  bannerImage: z.any(),
  ctaImage: z.any(),
  cardImage: z.any(),
  difficultyLevel: z.string().min(1, "Difficulty Level is required"),
  software: z.string().min(1, "Software is required"),
  tags: z.string().min(1, "Tags are required"),
  description: z.string().min(1, "Description is required"),
});

export type SimulationSchemaType = z.infer<typeof simulationSchema>;
export default simulationSchema;
