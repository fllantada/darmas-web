import { TreeChartData } from "./DirectoryVisualization";
import { TDirectoryTree } from "./interfaces";

export const mapToEchartsData = (data: TDirectoryTree): TreeChartData => {
  return {
    name: data.country,
    children: data.ports.map(port => {
      if (port.code !== data.selectedPort) {
        return {
          name: `${port.code}\n${port.title}`,
        };
      }
      return {
        name: `${port.code}\n${port.title}`,
        children:
          port.terminals?.map(terminal => ({
            name: `${terminal.code}\n${terminal.title}`,
            children: terminal.berths?.map(berth => ({
              name: `${berth.title}`,
            })),
          })) || [],
      };
    }),
  };
};
