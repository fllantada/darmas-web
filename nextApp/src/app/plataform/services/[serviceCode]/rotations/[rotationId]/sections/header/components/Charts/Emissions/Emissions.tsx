import { useMemo } from "react";
import {
  BarChart,
  BarSeriesOption,
  PictorialBarChart,
  PictorialBarSeriesOption,
} from "echarts/charts";
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
import { emissionsCiiColors } from "@/app/theme";

echarts.use([
  GridComponent,
  BarChart,
  CanvasRenderer,
  LegendComponent,
  PictorialBarChart,
  TooltipComponent,
]);

type EChartsOption = echarts.ComposeOption<
  | GridComponentOption
  | BarSeriesOption
  | LegendComponentOption
  | PictorialBarSeriesOption
  | TooltipComponentOption
>;

const baseChartOptions: EChartsOption = {
  tooltip: {
    show: true,
    valueFormatter: value =>
      (typeof value === "number" ? Math.round(value) : "--") + "%",
  },
  xAxis: {
    type: "category",
    nameLocation: "middle",
    nameGap: 40,
  },
  yAxis: {
    type: "value",
    nameLocation: "middle",
    nameGap: 40,
    name: "CII",
    axisLabel: {
      formatter: "{value}%",
    },
  },
  legend: {
    left: 10,
    itemHeight: 10,
    itemWidth: 10,
    selectedMode: true,
  },
};

const commonRichStyle = {
  padding: [5, 10, 3, 10],
  fontSize: 20,
  borderRadius: 5,
};

const richStylesForCallouts = {
  A: {
    ...commonRichStyle,
    ...emissionsCiiColors.A,
  },
  B: {
    ...commonRichStyle,
    ...emissionsCiiColors.B,
  },
  C: {
    ...commonRichStyle,
    ...emissionsCiiColors.C,
  },
  D: {
    ...commonRichStyle,
    ...emissionsCiiColors.D,
  },
  E: {
    ...commonRichStyle,
    ...emissionsCiiColors.E,
  },
  unknown: {
    ...commonRichStyle,
    color: "white",
    backgroundColor: "#d8dbdb",
  },
};

export type EmissionsProps = {
  xAxisName: string;
  xAxisLabels: string[];
  cii: {
    actual: number[];
    proforma: number[];
    model: number[];
  };
  ciiRating: {
    actual: string[];
    proforma: string[];
    model: string[];
  };
};

export default function Emissions({
  xAxisName,
  xAxisLabels,
  cii,
  ciiRating,
}: EmissionsProps) {
  const chartOptions = useMemo<EChartsOption>(
    () => ({
      ...baseChartOptions,
      xAxis: {
        ...baseChartOptions.xAxis,
        data: xAxisLabels,
        name: xAxisName,
      },
      series: [
        {
          name: "Proforma",
          type: "bar",
          color: "#d8dbdb",
          data: cii.proforma,
          label: {
            show: true,
            position: "top",
            rich: richStylesForCallouts,
            formatter: params => {
              const rating = ciiRating.proforma[params.dataIndex];
              return rating ? `{${rating}|${rating}}` : "{unknown|--}";
            },
          },
        },
        {
          name: "Model",
          type: "bar",
          color: "#e0c759",
          data: cii.model,
          label: {
            show: true,
            position: "top",
            rich: richStylesForCallouts,
            formatter: params => {
              const rating = ciiRating.model[params.dataIndex];
              return rating ? `{${rating}|${rating}}` : "{unknown|--}";
            },
          },
        },
        {
          name: "Actual",
          type: "bar",
          color: "#00C1D2",
          data: cii.actual,
          label: {
            show: true,
            position: "top",
            rich: richStylesForCallouts,
            formatter: params => {
              const rating = ciiRating.actual[params.dataIndex];
              return rating ? `{${rating}|${rating}}` : "{unknown|--}";
            },
          },
        },
      ],
    }),
    [
      cii.actual,
      cii.proforma,
      cii.model,
      ciiRating.model,
      ciiRating.actual,
      ciiRating.proforma,
      xAxisLabels,
      xAxisName,
    ],
  );

  return (
    <EChartBaseReact
      chartOptions={chartOptions}
      className="w-full h-[500px] mt-2"
    />
  );
}
