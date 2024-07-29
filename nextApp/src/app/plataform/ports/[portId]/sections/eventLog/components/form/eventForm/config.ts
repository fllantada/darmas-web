"use client";

import { DateTime } from "luxon";
import { z } from "zod";

import { EventType } from "../../../interfaces";

export const eventFormSchema = z
  .object({
    title: z.string().max(200).min(1, "Title is required"),
    type: z.nativeEnum(EventType),
    start: z.date(),
    end: z.date(),
    impactScore: z.coerce.number().min(1, "Please select a score").max(5),
    likelihoodScore: z.coerce.number().min(1, "Please select a score").max(5),

    allDay: z.boolean(),

    description: z
      .string()
      .min(1, "Description is required")
      .max(140, "Description is too long. Limit to 140 characters")
      .optional(),
    terminals: z.string().array().min(0, "Please select at least one terminal"),
  })
  .refine(
    data => {
      const startTime = DateTime.fromJSDate(data.start);
      const endTime = DateTime.fromJSDate(data.end);

      if (endTime < startTime) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: "End time must be after start time",
      path: ["end"],
    },
  );

export const impactStoreOptions = [
  { label: "Insignificant", value: "1" },
  { label: "Minor", value: "2" },
  { label: "Significant", value: "3" },
  { label: "Major", value: "4" },
  { label: "Severe", value: "5" },
];

export const likelihoodStoreOptions = [
  { label: "Rare", value: "1" },
  { label: "Unlikely", value: "2" },
  { label: "Moderate", value: "3" },
  { label: "Likely", value: "4" },
  { label: "Almost Certain", value: "5" },
];
