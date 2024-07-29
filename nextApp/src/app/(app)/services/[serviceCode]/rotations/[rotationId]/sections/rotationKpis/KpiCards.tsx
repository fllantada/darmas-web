"use client";

import { useMemo, useState } from "react";
import type { AtPortKpIsType, AtSeaKpIsType } from "@/generated/graphql";
import { AlertCircle } from "lucide-react";

import { LoadingState } from "@/lib/types";
import { cn } from "@/lib/utils";
import ChevronUpIcon from "@/components/icons/chevronUp";

import { useRotationStore } from "../../store/rotationStore";
import { EndRotationKpis } from "./domain/interfaces";
import AtPortCards from "./KpiCardsTypes/AtPortCards";
import AtSeaCards from "./KpiCardsTypes/AtSeaCards";
import { EndCards } from "./KpiCardsTypes/EndCards/EndCards";

export default function KpiCards(): JSX.Element {
  const loadingState = useRotationStore(state => state.loadingKpiStatus);

  const endRotationKpis = useRotationStore(state => state.endRotationKpis);
  const seaRotationKpis = useRotationStore(state => state.seaRotationKpis);
  const portRotationKpis = useRotationStore(state => state.portRotationKpis);
  const isPartnerSelected = useRotationStore(state => state.isPartnerSelected);
  const isFutureSelected = useRotationStore(state => state.isFutureSelected);
  const [expanded, setExpanded] = useState(false);

  const hasValidKpis = useMemo(() => {
    if (loadingState === LoadingState.FAILED) return false;
    if (loadingState === LoadingState.LOADING) return false;
    return Boolean(seaRotationKpis || portRotationKpis || endRotationKpis);
  }, [seaRotationKpis, portRotationKpis, endRotationKpis, loadingState]);

  function onHeaderClicked() {
    setExpanded(!expanded);
  }

  const expandedSize = useMemo(() => {
    if (endRotationKpis) return "h-[820]";
    if (seaRotationKpis || portRotationKpis) return "h-[410px]";
    return "";
  }, [endRotationKpis, seaRotationKpis, portRotationKpis]);

  return (
    <div
      className={` my-3 p-3 bg-white rounded-md ${expanded ? expandedSize : ""}`}
    >
      <h2
        className="w-full my-2 flex flex-row font-semibold text-base select-none cursor-pointer"
        onClick={onHeaderClicked}
      >
        <span className="basis-1/2">{expanded ? "Hide" : "See"} KPIs</span>
        <span className="text-[#727B9D] text-right basis-1/2">
          <ChevronUpIcon
            className={cn(expanded ? "" : "rotate-180", "inline")}
          />
        </span>
      </h2>
      {expanded && hasValidKpis && (
        <>
          {seaRotationKpis && (
            <AtSeaCards
              loadingState={loadingState}
              data={seaRotationKpis as AtSeaKpIsType}
            />
          )}
          {portRotationKpis && (
            <AtPortCards
              loadingState={loadingState}
              data={portRotationKpis as AtPortKpIsType}
            />
          )}
          {endRotationKpis && (
            <EndCards
              loadingState={loadingState}
              rotationKpis={endRotationKpis as EndRotationKpis}
            />
          )}
        </>
      )}

      {expanded && !hasValidKpis && (
        <div className="text-slate-400 text-center my-3 h-full w-full flex flex-col justify-center items-center ">
          {loadingState === LoadingState.SUCCESS &&
            !isPartnerSelected &&
            !isFutureSelected && (
              <div>
                <AlertCircle className="inline mb-2" size={40} />
                <br />
                Select an Item from the TimeLine to See KPIs
              </div>
            )}
          {loadingState === LoadingState.SUCCESS &&
            isPartnerSelected &&
            !isFutureSelected && (
              <div>
                <AlertCircle className="inline mb-2" size={40} />
                <br />
                We do not have access to the Partner’s Vessel information to
                compute these metric. Try selecting another vessel.
              </div>
            )}
          {loadingState === LoadingState.SUCCESS &&
            !isPartnerSelected &&
            isFutureSelected && (
              <div>
                <AlertCircle className="inline mb-2" size={40} />
                <br />
                We do not have enough information to compute these metrics for
                voyage in the future. Come back again when the voyage commence.
              </div>
            )}
          {loadingState === LoadingState.FAILED && (
            <div className="bg-white my-5 text-center text-red-500 py-5">
              <AlertCircle size={40} className="inline-block mb-2" />
              <div>Error loading KPIs Information</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
