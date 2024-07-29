import { useMemo } from "react";
import { CalculationType } from "@/globalDomain/calculationTypes";
import { RotationType } from "@/globalDomain/rotationTypes";
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

import { VesselTurnarrondTerminalOverlay } from "../interfaces";

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
    valueFormatter: value =>
      (typeof value === "number" ? Math.round(value * 100) / 100 : "--") +
      " hrs",
  },
  xAxis: {
    type: "category",
  },
  yAxis: {
    type: "value",
    name: "Turnaround Time (hours)",
    nameLocation: "middle",
    nameGap: 40,
  },
};

export type VesselTurnaroundChartProps = {
  vessels: VesselTurnarrondTerminalOverlay[];
  showProforma?: boolean;
};

function styleForVessel(vessel: VesselTurnarrondTerminalOverlay) {
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

export default function VesselTurnaroundChart({
  vessels,
  showProforma,
}: VesselTurnaroundChartProps) {
  const chartOptions = useMemo<EChartsOption>(() => {
    const series: BarSeriesOption[] = [
      {
        type: "bar",
        name: "Actual",
        seriesLayoutBy: "row",
        barWidth: "60%", // Adjust the front bar width here
        z: 1,
        data: vessels.map(v => ({
          value: v.actual,
          itemStyle: styleForVessel(v),
        })),
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          borderType: "dashed",
        },
      },
      {
        type: "bar",
        name: "Proforma",
        seriesLayoutBy: "row",
        barWidth: "70%", // Make the back bar wider
        barGap: "-108%", // Ensures the back bar is behind and visible around the edges
        z: 0,
        data: showProforma ? vessels.map(v => v.proforma) : [],
        itemStyle: {
          color: "#B3C0BF",
          borderRadius: [5, 5, 0, 0],
        },
      },
    ];

    return {
      ...baseChartOptions,
      xAxis: {
        type: "category",
        data: vessels.map(v => v.vesselName),
        name: "Vessels",
        nameLocation: "middle",
        nameGap: 40,
      },
      series,
    } satisfies EChartsOption;
  }, [vessels, showProforma]);

  return (
    <EChartBaseReact
      chartOptions={chartOptions}
      className="w-full h-[500px] mt-2"
    />
  );
}
