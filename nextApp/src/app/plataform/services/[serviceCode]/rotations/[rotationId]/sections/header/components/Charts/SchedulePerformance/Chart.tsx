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
import { RotationType } from "@/app/plataform/globalDomain/rotationTypes";
import { VesselColors } from "@/app/theme";

import { useRotationStore } from "../../../../../store/rotationStore";
import { ScheduleChangeStatus } from "../../../domain/interfaces";

echarts.use([
  GridComponent,
  BarChart,
  CanvasRenderer,
  LegendComponent,
  TooltipComponent,
]);

interface PortLabel {
  value: string;
  changeStatus?: ScheduleChangeStatus;
}

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

  yAxis: {
    type: "value",
    nameLocation: "middle",
    nameGap: 40,
    name: "Schedule Performance Delta (hours)",
  },
  legend: {
    show: false,
  },
};

export type SchedulePerformanceProps = {
  xAxisLabels: PortLabel[];
  performanceDelta: {
    actual: (number | null)[];
    forecast: (number | null)[];
  };
};

export default function SchedulePerformance({
  xAxisLabels,
  performanceDelta,
}: SchedulePerformanceProps) {
  const rotationType = useRotationStore(state => state.rotationType);

  const chartOptions = useMemo<EChartsOption>(() => {
    if (!xAxisLabels || !performanceDelta) {
      return baseChartOptions;
    }

    return {
      ...baseChartOptions,
      grid: {
        top: 20,
        bottom: 60,
      },
      xAxis: {
        type: "category",
        nameLocation: "middle",
        triggerEvent: true,
        nameGap: 50,
        name: "Ports",

        axisLabel: {
          interval: false,
          rich: {
            skipped: {
              padding: [10, 10, 10, 10],
              borderColor: "#D8F256",
              borderWidth: 1,
              borderRadius: 4,
            },
            aditional: {
              padding: [10, 10, 10, 10],
              borderColor: "#F99FC8",
              borderWidth: 1,
              borderRadius: 4,
            },
            normal: {
              padding: [10, 10, 10, 10],
              /* borderColor: VesselColors.OPERATED,
              borderWidth: 1,
              borderRadius: 4, */
            },
          },

          formatter: (value: string) => {
            const changeStatusCode = value.split("-")[1];
            const cleanValue = value.split("-")[0];
            if (changeStatusCode === "S") {
              return `{skipped| ${value}}`;
            }
            if (changeStatusCode === "A") {
              return `{aditional| ${value}}`;
            }

            return ` {normal|${cleanValue}}`;
          },
        },
        ...baseChartOptions.xAxis,
        data: xAxisLabels.map(
          label =>
            `${label.value} ${label.changeStatus ? "-" + label.changeStatus : ""}`,
        ),
      },
      series: [
        {
          name: "Actual",
          stack: "performance",
          type: "bar",
          markArea: {
            silent: true,
            z: 1,
            data: [[{ yAxis: 0 }, { yAxis: 0.5 }]],
            itemStyle: {
              color: "#B5EFB5",
              opacity: 0.6,
            },
          },
          color:
            rotationType === RotationType.PARTNER
              ? VesselColors.PARTNER
              : VesselColors.OPERATED,
          data: performanceDelta.actual,
        },
        {
          name: "Forecast",
          stack: "performance",
          type: "bar",
          data: performanceDelta.forecast,
          color:
            rotationType === RotationType.PARTNER
              ? VesselColors.PARTNER_FORECAST
              : VesselColors.OPERATED_FORECAST,

          itemStyle: {
            borderWidth: 2,
            borderColor:
              rotationType === RotationType.PARTNER
                ? VesselColors.PARTNER
                : VesselColors.OPERATED,
            borderType: "dotted",
          },
        },
      ],
    };
  }, [performanceDelta, xAxisLabels, rotationType]);

  return (
    <EChartBaseReact
      chartOptions={chartOptions}
      className="w-full h-[460px] mt-2"
    />
  );
}
