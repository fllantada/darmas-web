import { useMemo } from "react";
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

const baseChartOptions: EChartsOption = {
  legend: {
    left: 10,
    itemHeight: 10,
    itemWidth: 10,
    selectedMode: true,
  },
  tooltip: {
    show: true,
    valueFormatter: value =>
      (typeof value === "number" ? Math.round(value * 100) / 100 : "--") +
      " tons",
  },
  xAxis: {
    type: "category",
  },
  yAxis: {
    type: "value",
    name: "Port Emissions (tons)",
    nameLocation: "middle",
    nameGap: 40,
  },
};

type ChartVesselType = Omit<any, "__typename">;

export type PortEmissionsChartProps = {
  vessels: ChartVesselType[];
};

export default function PortEmissionsChart({
  vessels,
}: PortEmissionsChartProps) {
  const chartOptions = useMemo<EChartsOption>(
    () => ({
      ...baseChartOptions,
      xAxis: {
        type: "category",
        data: vessels.map(v => v.vesselName),
        name: "Vessels",
        nameLocation: "middle",
        nameGap: 40,
      },
      series: [
        {
          type: "bar",
          name: "Actual",
          seriesLayoutBy: "row",
          barWidth: "60%", // Adjust the front bar width here
          z: 1,
          data: vessels.map(v => v.actual),
          itemStyle: {
            color: "#00C1D2",
            borderRadius: [5, 5, 0, 0],
          },
        },
        {
          type: "bar",
          name: "Proforma",
          seriesLayoutBy: "row",
          barWidth: "70%", // Make the back bar wider
          barGap: "-108%", // Ensures the back bar is behind and visible around the edges
          z: 0,
          data: vessels.map(v => v.proforma),
          itemStyle: {
            color: "#B3C0BF",
            borderRadius: [5, 5, 0, 0],
          },
        },
      ],
    }),
    [vessels],
  );

  return (
    <EChartBaseReact
      chartOptions={chartOptions}
      className="w-full h-[500px] mt-2"
    />
  );
}
