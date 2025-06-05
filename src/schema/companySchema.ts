import { z } from "zod";

const companySchema = z.object({
  companyId: z.string().min(1, "CompanyId is required"),
  companyName: z.string().min(1, "CompanyName is required"),
  contactPersonName: z.string().min(1, "ContactPersonName is required"),
  phoneNumber: z.string().min(1, "PhoneNumber is required"),
  website: z.string().url("Invalid URL"),
  email: z.string().email("Invalid email"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  status: z.string().min(1, "Status is required"),
  numberOfUsers: z.string().optional(),
  numberOfSimulations: z.string().optional(),
});

export type CompanySchemaType = z.infer<typeof companySchema>;
export default companySchema;
