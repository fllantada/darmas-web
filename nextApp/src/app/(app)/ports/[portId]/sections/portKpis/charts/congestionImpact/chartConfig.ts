import { BarSeriesOption, LineSeriesOption } from "echarts/charts";
import {
  GridComponentOption,
  LegendComponentOption,
  MarkLineComponentOption,
  MarkPointComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
} from "echarts/components";
import * as echarts from "echarts/core";

export type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | MarkLineComponentOption
  | MarkPointComponentOption
  | LineSeriesOption
  | BarSeriesOption
>;
