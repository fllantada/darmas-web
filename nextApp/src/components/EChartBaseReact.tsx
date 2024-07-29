import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { ECBasicOption } from "echarts/types/dist/shared";

export type BaseChartProps = {
  chartOptions: ECBasicOption;
  className?: string;
};

export default function EChartBaseReact({
  chartOptions,
  className,
}: BaseChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (container) {
      const renderedInstance = echarts.getInstanceByDom(container);
      renderedInstance?.setOption(chartOptions);
    }
  }, [chartOptions]);

  useEffect(() => {
    const renderChart = () => {
      const container = chartContainerRef.current;
      if (container) {
        let renderedInstance = echarts.getInstanceByDom(container);
        if (!renderedInstance) {
          renderedInstance = echarts.init(container);
        }
        renderedInstance.setOption(chartOptions);
        return renderedInstance;
      }
    };

    const chartInstance = renderChart();
    if (chartInstance) {
      const resizeObserver = () => {
        chartInstance.resize();
      };

      window.addEventListener("resize", resizeObserver);

      return () => {
        chartInstance.dispose();
        window.removeEventListener("resize", resizeObserver);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={chartContainerRef} className={className} />;
}
