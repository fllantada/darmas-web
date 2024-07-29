import type { BaseKpiType } from "@/generated/graphql";

export enum LoadingState {
  LOADING = "LOADING",
  SUCCESS = "LOADED",
  FAILED = "ERROR",
}

export type NextError = Error & { digest?: string };

export type GeoPosition = {
  longitude: number;
  latitude: number;
};

export type DateRange = {
  start: Date;
  end: Date;
};

export type BaseKpiDisplayValues = Record<
  keyof Omit<BaseKpiType, "__typename">,
  string | undefined
>;
