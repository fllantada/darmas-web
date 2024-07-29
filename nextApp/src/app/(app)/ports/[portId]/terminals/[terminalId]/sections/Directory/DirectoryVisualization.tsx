import { useEffect, useRef } from "react";
import { TreeChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

import type { TreeChartData } from "./actions";

echarts.use([TooltipComponent, TreeChart, CanvasRenderer]);

type DirectoryVisualisationProps = {
  data: TreeChartData;
};

export default function DirectoryVisualisation({
  data,
}: DirectoryVisualisationProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    chart.setOption({
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove",
        formatter: "{b}",
      },
      series: [
        {
          type: "tree",
          data: [data],
          left: "0%",
          right: "0%",
          top: "8%",
          bottom: "20%",
          symbol: "emptyCircle",
          orient: "vertical",
          expandAndCollapse: true,
          label: {
            position: "top",
            align: "center",
            fontSize: 13,
            width: 145,
            overflow: "break",
          },
          leaves: {
            label: {
              position: "bottom",
              align: "center",
              fontSize: 13,
            },
          },
          animationDurationUpdate: 750,
        },
      ],
    });
  }, [data]);

  return <div ref={chartRef} className="w-full h-[700px]" />;
}
