import { useState } from "react";
import { BarChart, BarSeriesOption } from "echarts/charts";
import {
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
  TooltipComponent,
  TooltipComponentOption,
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

import EChartBaseReact from "@/components/EChartBaseReact";
import ToogleGroup from "@/components/ToggleGroup";
import { RotationType } from "@/app/plataform/globalDomain/rotationTypes";
import { VesselColors } from "@/app/theme";

import { useRotationStore } from "../../../../../store/rotationStore";
import { NoData } from "../../NoData";

echarts.use([
  GridComponent,
  BarChart,
  CanvasRenderer,
  LegendComponent,
  TooltipComponent,
]);

type EChartsOption = echarts.ComposeOption<
  | GridComponentOption
  | BarSeriesOption
  | LegendComponentOption
  | TooltipComponentOption
>;

enum DataToggle {
  BUNKER = "Bunker",
  PORT_CALLS = "Port Calls",
  VOYAGE_DAYS = "Voyage Days",
}

const baseChartOptions: EChartsOption = {
  tooltip: {
    show: true,
  },
  xAxis: {
    name: "Rotations",
    nameLocation: "middle",
    nameGap: 40,
  },
  yAxis: {
    type: "value",
    nameLocation: "middle",
    nameGap: 40,
  },
  legend: {
    left: 10,
    itemHeight: 10,
    itemWidth: 10,
    selectedMode: true,
  },
};

type DataSeries = {
  forecast: (number | null)[];
  actual: (number | null)[];
  proforma: (number | null)[];
};

export type OperationalEfficiencyProps = {
  rotations: string[];
  bunkerConsumption: DataSeries & { model: (number | null)[] };
  portCalls: DataSeries;
  voyageDays: DataSeries;
};

export function OperationalEfficiencyChart({
  rotations,
  bunkerConsumption,
  portCalls,
  voyageDays,
}: OperationalEfficiencyProps) {
  const rotationHasStarted = useRotationStore(state => state.rotationHasStart);
  const dataSeries = {
    [DataToggle.BUNKER]: {
      label: DataToggle.BUNKER,
      proforma: bunkerConsumption.proforma,
      forecast: null,
      actual: bunkerConsumption.actual,
      model: bunkerConsumption.model,
      name: "Bunker Consumption (tons)",
    },
    [DataToggle.PORT_CALLS]: {
      label: DataToggle.PORT_CALLS,
      forecast: portCalls.forecast,
      proforma: portCalls.proforma,
      actual: portCalls.actual,
      name: "Count of Port Calls",
    },
    [DataToggle.VOYAGE_DAYS]: {
      label: DataToggle.VOYAGE_DAYS,
      forecast: voyageDays.forecast,
      proforma: voyageDays.proforma,
      actual: voyageDays.actual,
      name: "Voyage Days",
    },
  };

  const [chartOptions, setChartOptions] = useState<{
    selected: DataToggle;
    options: EChartsOption;
  }>({
    selected: DataToggle.BUNKER,
    options: {
      ...baseChartOptions,
      tooltip: {
        ...baseChartOptions.tooltip,
        valueFormatter: value => (value as number).toFixed(1),
      },
      xAxis: {
        ...baseChartOptions.xAxis,
        type: "category",
        data: rotations,
      },
      yAxis: {
        ...baseChartOptions.yAxis,
        name: dataSeries[DataToggle.BUNKER].name,
      },
      series: [
        {
          name: "Proforma",
          type: "bar",
          color: "#d8dbdb",
          data: dataSeries[DataToggle.BUNKER].proforma,
        },
        {
          name: "Actual",
          type: "bar",
          color: "#00C1D2",
          data: dataSeries[DataToggle.BUNKER].actual,
        },
        {
          name: "Model",
          type: "bar",
          color: "#4C9D21",
          data: dataSeries[DataToggle.BUNKER].model,
        },
      ],
    },
  });
  const rotationType = useRotationStore(state => state.rotationType);

  function onDataToggleChange(value: string) {
    const key = value as DataToggle;
    let series: EChartsOption["series"] = [];

    if (key == DataToggle.BUNKER) {
      series = [
        {
          name: "Proforma",
          type: "bar",
          color: "#d8dbdb",
          data: dataSeries[key].proforma,
          barGap: undefined,
          barWidth: undefined,
        },
        {
          name: "Actual",
          type: "bar",
          color:
            rotationType === RotationType.PARTNER
              ? VesselColors.PARTNER
              : VesselColors.OPERATED,
          data: dataSeries[key].actual,
          stack: undefined,
          barGap: undefined,
          barWidth: undefined,
          z: undefined,
        },
        {
          name: "Model",
          type: "bar",
          color: "#4C9D21",
          data: dataSeries[key].model,
          stack: undefined,
          itemStyle: undefined,
          barGap: undefined,
          barWidth: undefined,
          z: undefined,
        },
      ];
    } else {
      series = [
        {
          data: dataSeries[key].proforma,
          barGap: "-100%",
          barWidth: 50,
        },
        {
          data: dataSeries[key].actual,
          stack: "actual",
          color:
            rotationType === RotationType.PARTNER
              ? VesselColors.PARTNER
              : VesselColors.OPERATED,
          barGap: "-79%",
          barWidth: 28,
          z: 10,
        },
        {
          name: "Forecast",
          data: dataSeries[key].forecast,
          stack: "actual",
          color:
            rotationType === RotationType.PARTNER
              ? VesselColors.PARTNER_FORECAST
              : VesselColors.OPERATED_FORECAST,
          itemStyle: {
            borderWidth: 2,
            borderColor:
              rotationType === RotationType.PARTNER
                ? VesselColors.PARTNER_FORECAST
                : VesselColors.OPERATED_FORECAST,
            borderType: "dotted",
          },
          barGap: "-79%",
          barWidth: 28,
          z: 10,
        },
      ];
    }

    setChartOptions({
      selected: key,
      options: {
        tooltip: {
          valueFormatter:
            key == DataToggle.BUNKER
              ? value => (value as number).toFixed(1)
              : undefined,
        },
        yAxis: {
          name: dataSeries[key].name,
        },
        series,
      },
    });
  }

  return (
    <>
      <ToogleGroup
        className="absolute top-3 right-3 z-10"
        defaultValue={DataToggle.BUNKER}
        onValueChange={onDataToggleChange}
        options={[
          DataToggle.BUNKER,
          DataToggle.PORT_CALLS,
          DataToggle.VOYAGE_DAYS,
        ]}
      />

      {rotationType === RotationType.PARTNER &&
        chartOptions.selected === DataToggle.BUNKER && (
          <div className="absolute top-[60px] left-0 w-full h-[450px]  bg-white z-20">
            <NoData text="We do not have access to the Partner’s Vessel information to compute this metric. Try selecting another vessel." />
          </div>
        )}

      {rotationType !== RotationType.PARTNER &&
        !rotationHasStarted &&
        chartOptions.selected === DataToggle.BUNKER && (
          <div className="absolute top-[60px] left-0 w-full h-[450px]  bg-white z-20">
            <NoData text="We do not have enough information to compute this metric for voyage in the future. Come back again when the voyage commence." />
          </div>
        )}
      <EChartBaseReact
        chartOptions={chartOptions.options}
        className="w-full h-[500px] mt-2 "
      />
    </>
  );
}
