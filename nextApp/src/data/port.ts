import { z } from "zod";

import { Event } from "@/app/(app)/ports/[portId]/sections/eventLog/interfaces";

import { vesselSchema } from "./vessel";

export enum VesselOperator {
  PIL = "PIL",
  Partner = "Partner",
  Other = "Other",
}

const berthSchema = z.object({
  berthId: z.string(),
  terminalId: z.string(),
  portId: z.string(),
  length: z.number(),
});

export const terminalDataEntrySchema = z.object({
  vesselId: z.string(),
  berthId: z.string(),
  operatorId: z.nativeEnum(VesselOperator),
  startTime: z.string().transform(val => new Date(val)),
  endTime: z.string().transform(val => new Date(val)),
  windowStartTime: z.string().transform(val => new Date(val)),
  windowEndTime: z.string().transform(val => new Date(val)),
  proformaStartTime: z.string().transform(val => new Date(val)),
  proformaEndTime: z.string().transform(val => new Date(val)),
});

const terminalSchema = z.object({
  terminalId: z.string(),
  terminalLocation: z.string(), // lat/long
  portId: z.string(),
  events: z.optional(z.array(z.custom<Event>())), // redundant if part of Port
  vesselData: z.array(vesselSchema),
  berthData: z.array(berthSchema),
  terminalData: z.array(terminalDataEntrySchema),
});

const portSchema = z.object({
  portId: z.string(),
  portName: z.string(),
  portUrl: z.string(),
  portLocation: z.string(), // lat/long
  events: z.array(z.custom<Event>()),
  terminalData: z.array(terminalSchema),
});

export type Port = z.infer<typeof portSchema>;
export type Terminal = z.infer<typeof terminalSchema>;
export type Berth = z.infer<typeof berthSchema>;
export type TerminalDataEntry = z.infer<typeof terminalDataEntrySchema>;
