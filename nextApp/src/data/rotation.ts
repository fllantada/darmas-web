import { z } from "zod";

export enum RotationCallStatus {
  Passage = "Sea Passage",
  Waiting = "Waiting",
  Port = "At Port",
}

const rotationCallSchema = z.object({
  serviceId: z.string(),
  rotationId: z.string(),
  vesselId: z.string(),
  callOrder: z.number(),
  portName: z.string(),
  callStatus: z.nativeEnum(RotationCallStatus),
  startTime: z.string().transform(val => new Date(val)),
  endTime: z.string().transform(val => new Date(val)),
  isForecast: z.boolean().optional() /* doesn't apply to proforma */,
});

export const rotationSchema = z.object({
  serviceId: z.string(),
  vesselId: z.string(),
  rotationId: z.string(),
  operatorId: z.string(),
  currentCallOrder: z.number(),
  currentCallStatus: z.nativeEnum(RotationCallStatus),
  calls: z.array(rotationCallSchema),
  isForecast: z.boolean(),
});

export const rotationProformaSchema = z.object({
  serviceId: z.string(),
  proformaId: z.string(),
  rotationId: z.string(),
  startTime: z.string().transform(val => new Date(val)),
  endTime: z.string().transform(val => new Date(val)),
  calls: z.array(rotationCallSchema),
});

export type RotationCall = z.infer<typeof rotationCallSchema>;
export type Rotation = z.infer<typeof rotationSchema>;
export type RotationProforma = z.infer<typeof rotationProformaSchema>;
