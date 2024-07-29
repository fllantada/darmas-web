import { BarSeriesOption } from "echarts/charts";
import {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from "echarts/components";
import * as echarts from "echarts/core";

export type EChartsOption = echarts.ComposeOption<
  | GridComponentOption
  | BarSeriesOption
  | LegendComponentOption
  | TooltipComponentOption
>;

export type DatasetItem = {
  value: number | null;
  itemStyle?: {
    color: string;
  };
};
export type DataSeries = {
  model?: (number | null)[];
  rotations: string[];
  forecast: (number | null)[] | DatasetItem[];
  actual: (number | null)[] | DatasetItem[];
  proforma: (number | null)[];
};

export enum ChartSelected {
  BUNKER = "Bunker",
  PORT_CALLS = "Port Calls",
  VOYAGE_DAYS = "Voyage Days",
}

export type OperationalEfficiencyData = {
  bunkerConsumption: DataSeries;
  portCalls: DataSeries;
  voyageDays: DataSeries;
};
