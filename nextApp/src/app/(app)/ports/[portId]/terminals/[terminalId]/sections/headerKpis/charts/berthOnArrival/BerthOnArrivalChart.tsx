import { useMemo } from "react";
import { CalculationType } from "@/globalDomain/calculationTypes";
import { RotationType } from "@/globalDomain/rotationTypes";
import { BarChart, BarSeriesOption } from "echarts/charts";
import {
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
  MarkAreaComponent,
  MarkAreaComponentOption,
  TooltipComponent,
  TooltipComponentOption,
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

import EChartBaseReact from "@/components/EChartBaseReact";
import { VesselColors } from "@/app/theme";

import {
  BerthOnArrivalTerminalOverlay,
  TerminalChartVesselType,
} from "../interfaces";

echarts.use([
  GridComponent,
  BarChart,
  CanvasRenderer,
  LegendComponent,
  TooltipComponent,
  MarkAreaComponent,
]);

type EChartsOption = echarts.ComposeOption<
  | GridComponentOption
  | BarSeriesOption
  | LegendComponentOption
  | TooltipComponentOption
  | MarkAreaComponentOption
>;

const baseChartOptions: EChartsOption = {
  tooltip: {
    show: true,
    valueFormatter: value =>
      (typeof value === "number" ? Math.round(value * 100) / 100 : "--") +
      " hrs",
  },
  xAxis: {
    type: "category",
  },
  yAxis: {
    type: "value",
    name: "Waiting Time (hours)",
    nameLocation: "middle",
    nameGap: 40,
  },
};

export type IProps = {
  chartData: BerthOnArrivalTerminalOverlay;
  showThreshold?: boolean;
};

function styleForVessel(vessel: TerminalChartVesselType) {
  let color = VesselColors.OTHERS;

  let borderColor = VesselColors.OTHERS_BORDER;
  if (vessel.vesselType === RotationType.OPERATED) {
    color = VesselColors.OPERATED;
    borderColor = VesselColors.OPERATED_BORDER;
  } else if (vessel.vesselType === RotationType.PARTNER) {
    color = VesselColors.PARTNER;
    borderColor = VesselColors.PARTNER_BORDER;
  }

  const style = {
    color,
    borderColor,
    borderWidth: vessel.calculationType === CalculationType.ACTUAL ? 0 : 2,
  };

  return style;
}

export default function BerthOnArrivalChart({
  chartData,
  showThreshold,
}: IProps) {
  const chartOptions = useMemo<EChartsOption>(() => {
    const shouldShowThreshold = showThreshold && chartData.target > 0;

    return {
      ...baseChartOptions,
      xAxis: {
        type: "category",
        data: chartData.vessels.map(v => v.vesselName),
        name: "Vessels",
        nameLocation: "middle",
        nameGap: 40,
      },
      series: [
        {
          type: "bar",
          name: "",
          data: chartData.vessels.map(v => {
            const itemData = {
              value: v.actual,
              itemStyle: styleForVessel(v),
            };

            return itemData;
          }),
          z: 0,
          itemStyle: {
            borderRadius: [5, 5, 0, 0],
            borderType: "dashed",
          },
          markArea: {
            silent: true,

            data: shouldShowThreshold
              ? [[{ yAxis: 0 }, { yAxis: chartData.target }]]
              : [],
            z: 1,
            itemStyle: {
              color: "#B5EFB5",
              opacity: 0.6,
            },
          },
        } satisfies BarSeriesOption,
      ],
    };
  }, [chartData.target, chartData.vessels, showThreshold]);

  return (
    <EChartBaseReact
      chartOptions={chartOptions}
      className="w-full h-[500px] mt-2"
    />
  );
}
