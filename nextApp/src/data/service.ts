import { z } from "zod";

import { rotationProformaSchema, rotationSchema } from "./rotation";

const serviceSchema = z.object({
  serviceId: z.string(),
  vesselIds: z.array(z.string()),
  rotationData: z.array(rotationSchema),
});

const serviceProformaSchema = z.object({
  serviceId: z.string(),
  proformaId: z.string(),
  rotationData: z.array(rotationProformaSchema),
});

export type Service = z.infer<typeof serviceSchema>;
export type ServiceProforma = z.infer<typeof serviceProformaSchema>;
