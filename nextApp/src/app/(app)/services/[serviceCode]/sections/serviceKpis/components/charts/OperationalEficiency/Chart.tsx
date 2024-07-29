import { useMemo, useState } from "react";

import EChartBaseReact from "@/components/EChartBaseReact";
import ToogleGroup from "@/components/ToggleGroup";

import { NoData } from "../NoData";
import { baseChartOptions } from "./chartConfig";
import {
  ChartSelected,
  DataSeries,
  EChartsOption,
  OperationalEfficiencyData,
} from "./interfaces";

type IProps = {
  chartSelected: ChartSelected;
  bunkerConsumption: DataSeries;
  portCalls: DataSeries;
  voyageDays: DataSeries;
  handleSelectChart: (value: ChartSelected) => void;
} & OperationalEfficiencyData;

export function OperationalEfficiency({
  bunkerConsumption,
  portCalls,
  voyageDays,
  handleSelectChart,
  chartSelected,
}: IProps) {
  const dataSeries = useMemo(
    () => ({
      [ChartSelected.BUNKER]: {
        label: ChartSelected.BUNKER,
        xAxis: bunkerConsumption.rotations,
        proforma: bunkerConsumption.proforma,
        forecast: null,
        actual: bunkerConsumption.actual,
        model: bunkerConsumption.model,
        name: "Bunker Consumption (tons)",
      },
      [ChartSelected.PORT_CALLS]: {
        label: ChartSelected.PORT_CALLS,
        xAxis: portCalls.rotations,
        forecast: portCalls.forecast,
        proforma: portCalls.proforma,
        actual: portCalls.actual,
        name: "Count of Port Calls",
      },
      [ChartSelected.VOYAGE_DAYS]: {
        xAxis: voyageDays.rotations,
        label: ChartSelected.VOYAGE_DAYS,
        forecast: voyageDays.forecast,
        proforma: voyageDays.proforma,
        actual: voyageDays.actual,
        name: "Voyage Days",
      },
    }),
    [bunkerConsumption, portCalls, voyageDays],
  );

  const [chartOptions, setChartOptions] = useState<EChartsOption>({
    ...baseChartOptions,
    tooltip: {
      ...baseChartOptions.tooltip,
      valueFormatter: value => (value as number).toFixed(1),
    },
    xAxis: {
      ...baseChartOptions.xAxis,
      type: "category",
      data: bunkerConsumption.rotations,
    },
    yAxis: {
      ...baseChartOptions.yAxis,
      name: dataSeries[ChartSelected.BUNKER].name,
    },
    series: [
      {
        name: "Proforma",
        type: "bar",
        color: "#d8dbdb",
        data: dataSeries[ChartSelected.BUNKER].proforma,
      },
      {
        name: "Actual",
        type: "bar",
        color: "#00C1D2",
        data: dataSeries[ChartSelected.BUNKER].actual,
      },
      {
        name: "Model",
        type: "bar",
        color: "#4C9D21",
        data: dataSeries[ChartSelected.BUNKER].model,
      },
    ],
  });

  function onChartSelectedChange(value: string) {
    const key = value as ChartSelected;
    handleSelectChart(key);
    let series: EChartsOption["series"] = [];

    if (key == ChartSelected.BUNKER) {
      series = [
        {
          name: "Proforma",
          type: "bar",
          color: "#d8dbdb",
          data: dataSeries[key].proforma,
          barGap: undefined,
          barWidth: undefined,
        },
        {
          name: "Actual",
          type: "bar",
          color: "#00C1D2",
          data: dataSeries[key].actual,
          stack: undefined,
          barGap: undefined,
          barWidth: undefined,
          z: undefined,
        },
        {
          name: "Model",
          type: "bar",
          color: "#4C9D21",
          data: dataSeries[key].model,
          stack: undefined,
          itemStyle: undefined,
          barGap: undefined,
          barWidth: undefined,
          z: undefined,
        },
      ];
    } else {
      series = [
        {
          data: dataSeries[key].proforma,
          barGap: "-100%",
          barWidth: "80%",
        },
        {
          data: dataSeries[key].actual,
          stack: "actual",
          barGap: "-80%",
          barWidth: "50%",
          z: 10,
        },
        {
          name: "Forecast",
          data: dataSeries[key].forecast,
          stack: "actual",
          color: "rgba(0, 193, 210, 0.5)",
          itemStyle: {
            borderWidth: 2,
            borderColor: "rgba(69, 73, 84, 0.7)",
            borderType: "dotted",
          },
          barGap: "-80%",
          barWidth: "50%",
          z: 10,
        },
      ];
    }

    setChartOptions({
      tooltip: {
        valueFormatter:
          key == ChartSelected.BUNKER
            ? value => (value as number).toFixed(1)
            : undefined,
      },
      yAxis: {
        name: dataSeries[key].name,
      },
      xAxis: {
        data: dataSeries[key].xAxis,
      },
      series,
      legend: {
        show: false,
      },
    });
  }

  const onlyPartnerVessels =
    chartSelected === ChartSelected.BUNKER &&
    bunkerConsumption.rotations.length === 0;
  return (
    <>
      <ToogleGroup
        className="absolute top-3 right-3 z-10"
        defaultValue={ChartSelected.BUNKER}
        onValueChange={onChartSelectedChange}
        options={[
          ChartSelected.BUNKER,
          ChartSelected.PORT_CALLS,
          ChartSelected.VOYAGE_DAYS,
        ]}
      />

      {onlyPartnerVessels && (
        <div className="absolute top-[60px] left-0 w-full h-[450px]  bg-white z-20">
          <NoData text="We do not have access to the Partner’s Vessel information. Try selecting another metric." />
        </div>
      )}

      {
        <EChartBaseReact
          chartOptions={chartOptions}
          className="w-full h-[440px] mt-2"
        />
      }
    </>
  );
}
