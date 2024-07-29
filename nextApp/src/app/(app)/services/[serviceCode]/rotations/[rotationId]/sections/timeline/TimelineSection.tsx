"use client";

import { useEffect, useState } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { VoyageType } from "@/generated/graphql";

import { useRotationStore } from "../../store/rotationStore";
import KpiCards from "../rotationKpis/KpiCards";
import { Controls } from "./components/Controls";
import ScheduleError from "./components/error";
import { RotationTimeline } from "./components/Timeline";

interface IProps {
  prevVesselVoyage?: VoyageType;
  vesselVoyage: VoyageType;
  nextVesselVoyage?: VoyageType;
}

export function TimelineSection({
  vesselVoyage: serverVesselVoyage,

  prevVesselVoyage,
  nextVesselVoyage,
}: IProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    useRotationStore
      .getState()
      .initializeRotationStore(
        serverVesselVoyage,
        prevVesselVoyage,
        nextVesselVoyage,
      );
    setLoading(false);

    return () => {
      useRotationStore.getState().cleanRotationStore();
    };
  }, [serverVesselVoyage, prevVesselVoyage, nextVesselVoyage]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <KpiCards />
      <ErrorBoundary errorComponent={ScheduleError}>
        <Controls />
        <RotationTimeline />
      </ErrorBoundary>
    </>
  );
}
