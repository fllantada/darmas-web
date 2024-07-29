"use client";

import { useEffect, useRef, useState } from "react";
import type { BaseKpiType, VesselEmissionsKpiType } from "@/generated/graphql";
import {
  calculateRotationType,
  RotationType,
} from "@/globalDomain/rotationTypes";
import { HeaderKpiTitles, SERVICES_TEXT } from "@/text/services";

import { LoadingState } from "@/lib/types";
import type { BaseKpiDisplayValues, DateRange } from "@/lib/types";
import { isNotNullOrUndefined } from "@/lib/utils";
import KpiCard, { DeltaTrend } from "@/components/ui/kpiCard/kpiCard";
import { useKpiCardInteractions } from "@/app/customHooks/useKpiCardInteractions";

import {
  getCommercialReliabilityDisplayValues,
  getSchedulePerformanceDisplayValues,
  getServiceEmissionsDisplayValues,
} from "../../../rotations/[rotationId]/sections/rotationKpis/utils/kpi";
import { getTimeDepedentKpis } from "../actions";
import ServiceCommercialReliability from "./charts/ComercialReliability/Controller";
import ServiceEmissions from "./charts/Emissions/ServiceEmissions";
import ServiceOperationalEfficiency from "./charts/OperationalEficiency/Controller";
import ServiceSchedulePerformance from "./charts/SchedulePerformance/Controller";
import EmissionsHeaderKpi from "./EmissionsHeaderKpi";

type DisplayKpiDataItem = {
  display: BaseKpiDisplayValues;
  data: BaseKpiType | undefined | null;
};

type DisplayKpiData = {
  schedulePerformance: DisplayKpiDataItem;
  commercialReliability: DisplayKpiDataItem;
  operationalEfficiency: DisplayKpiDataItem;
  emissions: {
    display: BaseKpiDisplayValues;
    data: VesselEmissionsKpiType[];
  };
};

type ServiceHeaderKpisProps = {
  serviceCode: string;
  timeRange: DateRange;
};

export default function ServiceHeaderKpis({
  serviceCode,
  timeRange,
}: ServiceHeaderKpisProps): JSX.Element {
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.LOADING,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [kpiData, setKpiData] = useState<DisplayKpiData>();
  const { selectedCard, clickOnCard } = useKpiCardInteractions(containerRef);

  async function refreshKpiData() {
    setLoadingState(LoadingState.LOADING);
    try {
      const data = await getTimeDepedentKpis(serviceCode, timeRange);
      setKpiData(
        data
          ? {
              schedulePerformance: {
                display: getSchedulePerformanceDisplayValues(
                  data.schedulePerformance,
                ),
                data: data.schedulePerformance,
              },
              commercialReliability: {
                display: getCommercialReliabilityDisplayValues(
                  data.commercialReliability,
                ),
                data: data.commercialReliability,
              },
              operationalEfficiency: {
                display: getCommercialReliabilityDisplayValues(
                  data.operationalEfficiency,
                ),
                data: data.operationalEfficiency,
              },
              emissions: {
                display: getServiceEmissionsDisplayValues(
                  data.serviceEmissionsKpi,
                ),
                data: data.serviceEmissionsKpi.filter(
                  vessel =>
                    calculateRotationType(vessel.vesselCode) ===
                    RotationType.OPERATED,
                ),
              },
            }
          : undefined,
      );
      setLoadingState(LoadingState.SUCCESS);
    } catch (e) {
      setLoadingState(LoadingState.FAILED);
    }
  }

  useEffect(() => {
    refreshKpiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceCode, timeRange]);

  function onCardClicked(id: string) {
    clickOnCard(id);
  }

  return (
    <div className="my-6 relative" ref={containerRef}>
      <h2 className="text-base font-semibold">Service KPIs</h2>
      <div className="flex flex-row mt-2 space-x-2">
        <KpiCard
          flipOnHover={false}
          loadingState={loadingState}
          id="schedule_performance"
          infoText={SERVICES_TEXT.HEADER_KPI.SCHEDULE_PERFORMANCE_INFO_TEXT}
          selected={selectedCard == "schedule_performance"}
          className="basis-1/4"
          title={HeaderKpiTitles.schedulePerformance}
          kpiResult={kpiData?.schedulePerformance?.display.kpiValue}
          comparisonResult={false}
          proformaAbsolute={kpiData?.schedulePerformance?.display.proforma}
          actualAbsolute={kpiData?.schedulePerformance?.display.actual}
          deltaTrend={
            isNotNullOrUndefined(kpiData?.schedulePerformance?.data?.delta) &&
            kpiData?.schedulePerformance.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={kpiData?.schedulePerformance?.display.delta}
          deltaPercent={kpiData?.schedulePerformance?.display.deltaPercentage}
          onClick={onCardClicked}
        />
        <KpiCard
          flipOnHover={false}
          loadingState={loadingState}
          id="commercial_reliability"
          infoText={SERVICES_TEXT.HEADER_KPI.COMERCIAL_RELIABILITY_INFO_TEXT} //"To measure the actual performance against the transit days indicated to customers."
          selected={selectedCard == "commercial_reliability"}
          className="basis-1/4"
          title={HeaderKpiTitles.commercialReliability}
          kpiResult={kpiData?.commercialReliability?.display.kpiValue}
          comparisonResult={false}
          proformaAbsolute={kpiData?.commercialReliability?.display.proforma}
          actualAbsolute={kpiData?.commercialReliability?.display.actual}
          deltaTrend={
            isNotNullOrUndefined(kpiData?.commercialReliability?.data?.delta) &&
            kpiData?.commercialReliability.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={kpiData?.commercialReliability?.display?.delta}
          deltaPercent={
            kpiData?.commercialReliability?.display?.deltaPercentage
          }
          onClick={onCardClicked}
        />
        <KpiCard
          flipOnHover={false}
          loadingState={loadingState}
          id="operational_efficiency"
          infoText={SERVICES_TEXT.HEADER_KPI.OPERATIONAL_EFFICIENCY_INFO_TEXT} //"To measure the actual bunker consumption, number of port calls and voyage days against the planned."
          selected={selectedCard == "operational_efficiency"}
          className="basis-1/4"
          title={HeaderKpiTitles.operationalEfficiency}
          kpiResult={kpiData?.operationalEfficiency?.display.kpiValue}
          comparisonResult={false}
          proformaAbsolute={kpiData?.operationalEfficiency?.display.proforma}
          actualAbsolute={kpiData?.operationalEfficiency?.display.actual}
          deltaTrend={
            isNotNullOrUndefined(kpiData?.operationalEfficiency?.data?.delta) &&
            kpiData?.operationalEfficiency.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={kpiData?.operationalEfficiency?.display.delta}
          deltaPercent={kpiData?.operationalEfficiency?.display.deltaPercentage}
          onClick={onCardClicked}
        />
        <EmissionsHeaderKpi
          id="emissions"
          infoText={SERVICES_TEXT.HEADER_KPI.EMISSION_INFO_TEXT}
          title={HeaderKpiTitles.emissions}
          selected={selectedCard == "emissions"}
          loadingState={loadingState}
          className="basis-1/4"
          onClick={onCardClicked}
          data={kpiData?.emissions.data}
        />
      </div>
      {selectedCard && (
        <div className="w-full min-h-[500px] bg-white mt-3 p-3 rounded-md border-[1px] absolute shadow-lg z-10">
          {selectedCard == "schedule_performance" && (
            <ServiceSchedulePerformance
              serviceCode={serviceCode}
              timeRange={timeRange}
            />
          )}
          {selectedCard == "commercial_reliability" && (
            <ServiceCommercialReliability
              serviceCode={serviceCode}
              timeRange={timeRange}
            />
          )}
          {selectedCard == "operational_efficiency" && (
            <ServiceOperationalEfficiency
              serviceCode={serviceCode}
              timeRange={timeRange}
            />
          )}
          {selectedCard == "emissions" && (
            <ServiceEmissions data={kpiData?.emissions.data} />
          )}
        </div>
      )}
    </div>
  );
}
