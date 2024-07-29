import { z } from "zod";

// TODO: placeholder types
export enum VesselType {
  Container = "Container",
  Bulk = "Bulk",
  Tanker = "Tanker",
  RoRo = "RoRo",
  Reefer = "Reefer",
  Other = "Other",
}

const operatorSchema = z.object({
  operatorId: z.string(),
  operatorName: z.string(),
});

const ownerSchema = z.object({
  ownerId: z.string(),
  ownerName: z.string(),
});

export const vesselSchema = z.object({
  vesselId: z.string(),
  vesselName: z.string(),
  operatorId: z.string(),
  ownerId: z.string(),
  vesselType: z.string(),
  length: z.number(), // meters
});

export type Vessel = z.infer<typeof vesselSchema>;
export type Operator = z.infer<typeof operatorSchema>;
export type Owner = z.infer<typeof ownerSchema>;
