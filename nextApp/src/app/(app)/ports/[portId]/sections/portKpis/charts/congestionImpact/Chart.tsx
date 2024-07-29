import { useMemo } from "react";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import moment from "moment";

import EChartBaseReact from "@/components/EChartBaseReact";

import { EChartsOption } from "./chartConfig";
import { CongestionImpact } from "./interfaces";

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

type IProps = {
  congestionImpact: CongestionImpact;
};
type DatasetItem = { value: number; ItemStyle?: { color: string } } | null;

export function CongestionImpactChart({ congestionImpact }: IProps) {
  const chartOptions = useMemo<EChartsOption>(() => {
    const xAxisDays = [] as string[];
    const portPercentageActual = [] as DatasetItem[];
    const portPercentageForecast = [] as DatasetItem[];
    const noOfShipsActual = [] as DatasetItem[];
    const noOfShipsForecast = [] as DatasetItem[];

    congestionImpact.forEach((item, index) => {
      const itemTime = moment(item.time);

      const isActual = itemTime.isBefore(moment());

      const isForecast = !isActual;
      const isTransition = index === 3;

      xAxisDays.push(moment(item.time).format("DD/MMM "));

      if (isTransition) {
        const prevItem = congestionImpact[index - 1];

        portPercentageForecast[2] = {
          value: prevItem.percentageUsed,
        };
        portPercentageForecast.push({ value: item.percentageUsed });
        noOfShipsForecast.push({ value: item.numberOfShips });
        return;
      }
      if (isActual) {
        portPercentageActual.push({
          value: item.percentageUsed,
        });
        noOfShipsActual.push({
          value: item.numberOfShips,
        });
        portPercentageForecast.push(null);
        noOfShipsForecast.push(null);
        return;
      }

      if (isForecast) {
        portPercentageForecast.push({ value: item.percentageUsed });
        noOfShipsForecast.push({ value: item.numberOfShips });
        portPercentageActual.push(null);
        noOfShipsActual.push(null);
        return;
      }
    });

    const baseOptions: EChartsOption = {
      tooltip: {
        trigger: "axis",
        formatter: params => {
          const seriesParams = params as {
            data: { value: number };
            seriesName: string;
            color: string;
          }[];
          let tooltip = "";

          seriesParams.forEach(({ seriesName, color, data }, index) => {
            if (!data || !seriesName || !color) return;
            if (data?.value === undefined || data.value === null) return;

            if (index === 0) {
              if (tooltip.includes("Port Usage")) return;
              else
                tooltip += `<span style="color:${color};">&#9679;</span><span>  Port Usage ${data.value.toFixed(0)}%</span><br>`;
            }
            if (index === 1)
              if (tooltip.includes("Port Usage")) return;
              else
                tooltip += `<span style="color:${color};">&#9679;</span><span>  Port Usage ${data.value.toFixed(0)}%</span><br>`;
            if (index === 2)
              if (tooltip.includes("No. of Ships")) return;
              else
                tooltip += `<span style="color:${color};">&#9679;</span><span>  No. of Ships ${data.value}</span><br>`;
            if (index === 3)
              if (tooltip.includes("No. of Ships")) return;
              else
                tooltip += `<span style="color:${color};">&#9679;</span><span>  No. of Ships ${data.value}</span><br>`;
          });

          return tooltip;
        },
      },

      legend: {
        show: false,
      },

      xAxis: {
        type: "category",
        boundaryGap: false,
        data: xAxisDays,
      },
      yAxis: [
        {
          name: "Port Usage",
          nameLocation: "middle",
          type: "value",
          nameGap: 50,

          position: "left",
          offset: 20,
          axisLabel: {
            formatter: "{value} %",
          },
          splitLine: {
            // Configuración para las líneas horizontales
            lineStyle: {
              type: "dotted",
              color: "rgba(0, 102, 102, 0.3)", // Color de las líneas horizontales del primer eje Y
            },
          },
        },
        {
          name: "No of Ships",
          nameGap: 50,
          nameLocation: "middle",
          type: "value",
          position: "right",
          offset: 20,

          axisLabel: {
            formatter: "{value}",
          },
          splitLine: {
            // Configuración para las líneas horizontales
            lineStyle: {
              type: "dotted",
              color: "rgba(153, 51, 51, 0.3)", // Color de las líneas horizontales del primer eje Y
            },
          },
        },
      ],

      series: [
        {
          name: "Port Usage Actual",
          type: "line",
          yAxisIndex: 0,
          symbol: "diamond",
          symbolSize: 12,
          lineStyle: {
            type: "solid",
            color: "rgba(0, 102, 102, 1)",
          },
          itemStyle: {
            color: "rgba(0, 102, 102, 1)",
          },

          data: portPercentageActual,
        },
        {
          name: "Port Usage Forecast",
          type: "line",
          yAxisIndex: 0,
          symbol: "diamond",
          symbolSize: 12,
          lineStyle: {
            type: "dotted",
            color: "rgba(0, 102, 102, 1)",
          },
          itemStyle: {
            color: "rgba(0, 102, 102, 1)",
          },

          data: portPercentageForecast,
        },
        {
          name: "No. of Ships Actual",
          type: "bar",
          barWidth: "35%",
          barGap: "-80%",

          yAxisIndex: 1,

          itemStyle: {
            color: "rgba(153, 51, 51, 0.5)", // Color de los puntos rojos
          },
          data: noOfShipsActual,
        },
        {
          name: "No. of Ships Forecast",
          type: "bar",

          itemStyle: {
            color: "rgba(153, 51, 51, 0.5)",
            borderColor: "rgba(69, 73, 84, 0.7)",
            borderType: "dotted",
            borderWidth: 2,
          },
          yAxisIndex: 1,
          barWidth: "35%",
          barGap: "-100%",
          data: noOfShipsForecast,
        },
      ],
    };

    return { ...baseOptions } as EChartsOption;
  }, [congestionImpact]);

  if (!congestionImpact.length) return <></>;

  return (
    <EChartBaseReact
      chartOptions={chartOptions}
      className="w-full h-[500px] mt-2"
    />
  );
}
