import { useMemo } from "react";
/* import type { PortOverlayChartType } from "@/generated/graphql"; */
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
import { CalculationType } from "@/app/plataform/globalDomain/calculationTypes";
import { VesselColors } from "@/app/plataform/theme";

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

type ChartVesselType = Omit<any, "__typename">;

export type BerthOnArrivalChartProps = {
  vessels: ChartVesselType[];
  target: number;
  filters: string[];
};

/* function styleForVessel(vessel: ChartVesselType) {
  let color = "#9A80FF";
  let borderColor = "#4C1EFF";
  if (vessel.vesselType === "Operated") {
    color = "#00C1D2";
    borderColor = "2461FF";
  } else if (vessel.vesselType === "Partner") {
    color = "#F8BE5D";
    borderColor = "#E08D00";
  }

  return {
    color,
    borderColor,
    borderWidth: vessel.calculationType === "actual" ? 0 : 2,
  };
} */

function styleForVessel(vessel: ChartVesselType) {
  let color = VesselColors.OTHERS;

  let borderColor = VesselColors.OTHERS_BORDER;
  if (vessel.vesselType === "Operated") {
    color = VesselColors.OPERATED;
    borderColor = VesselColors.OPERATED_BORDER;
  } else if (vessel.vesselType === "Partner") {
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
  vessels,
  target,
  filters,
}: BerthOnArrivalChartProps) {
  const chartOptions = useMemo<EChartsOption>(() => {
    const filteredVessels = vessels.filter(v =>
      filters.includes(v.vesselType || ""),
    );

    return {
      ...baseChartOptions,
      xAxis: {
        type: "category",
        data: filteredVessels.map(v => v.vesselName),
        name: "Vessels",
        nameLocation: "middle",
        nameGap: 40,
      },
      series: [
        {
          type: "bar",
          name: "",
          data: filteredVessels.map(v => ({
            value: v.actual,
            itemStyle: styleForVessel(v),
          })),
          z: 0,
          itemStyle: {
            borderRadius: [5, 5, 0, 0],
            borderType: "dashed",
          },
          markArea: filters.includes("threshold")
            ? {
                silent: true,

                data: [[{ yAxis: 0 }, { yAxis: target }]],
                z: 1,
                itemStyle: {
                  color: "#B5EFB5",
                  opacity: 0.6,
                },
              }
            : undefined,
        } satisfies BarSeriesOption,
      ],
    };
  }, [vessels, target, filters]);

  return (
    <EChartBaseReact
      chartOptions={chartOptions}
      className="w-full h-[500px] mt-2"
    />
  );
}
