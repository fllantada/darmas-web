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
import { VesselColors } from "@/app/theme";

import { ServiceSchedulePerformaceGraphProps } from "./interfaces";

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
  tooltip: {
    show: true,
  },
  xAxis: {
    type: "category",
  },
  yAxis: {
    type: "value",
  },
  legend: {
    left: 10,
    itemHeight: 10,
    itemWidth: 10,
    selectedMode: true,
  },
};

export function ServiceSchedulePerformaceGraph({
  rotations,
  onTimeActualPortCalls,
  onTimeForecastPortCalls,
  offTimePortCalls,
}: ServiceSchedulePerformaceGraphProps) {
  const chartOptions = useMemo<EChartsOption>(
    () => ({
      ...baseChartOptions,

      xAxis: {
        type: "category",
        data: rotations,
        name: "Rotations",
        nameLocation: "middle",
        nameGap: 80,
        axisLabel: {
          interval: 0, // Show all labels without skipping
          rotate: 45,
        },
      },
      legend: {
        show: false,
      },

      grid: {
        bottom: 80,
        top: 20,
      },
      yAxis: {
        name: "No. of Ports",
        nameLocation: "middle",
        nameGap: 40,
      },
      series: [
        {
          type: "bar",
          color: "#4075ff",

          name: "On Time",
          stack: "onTime",
          data: onTimeActualPortCalls,
          barWidth: 40,
          z: 10,
        },

        {
          type: "bar",
          stack: "onTime",
          name: "Forecast",

          data: onTimeForecastPortCalls,
          barWidth: 40,
          color: VesselColors.OPERATED_FORECAST,
          itemStyle: {
            borderWidth: 2,
            borderColor: "rgba(69, 73, 84, 0.7)",
            borderType: "dotted",
          },
          z: 10,
        },
        {
          type: "bar",
          stack: "onTime",
          name: "Off Time",

          data: offTimePortCalls,
          barWidth: 40,
          color: VesselColors.OFF_TIME,
          itemStyle: {
            borderWidth: 2,
            borderColor: VesselColors.OFF_TIME,
            borderType: "dotted",
          },
          z: 10,
        },
      ],
    }),
    [
      rotations,
      onTimeActualPortCalls,
      onTimeForecastPortCalls,
      offTimePortCalls,
    ],
  );

  return (
    <EChartBaseReact
      chartOptions={chartOptions}
      className="w-full h-[440px] "
    />
  );
}
