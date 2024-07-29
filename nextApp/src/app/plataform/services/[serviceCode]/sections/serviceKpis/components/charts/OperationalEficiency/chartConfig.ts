import { BarChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

import { EChartsOption } from "./interfaces";

echarts.use([
  GridComponent,
  BarChart,
  CanvasRenderer,
  LegendComponent,
  TooltipComponent,
]);

export const baseChartOptions: EChartsOption = {
  tooltip: {
    show: true,
  },
  grid: {
    bottom: 60,
    top: 30,
  },
  xAxis: {
    axisLabel: {
      interval: 0, // Show all labels without skipping
      rotate: 45,
    },
  },
  yAxis: {
    type: "value",
    nameLocation: "middle",
    nameGap: 40,
  },
  legend: {
    show: false,
  },
};
