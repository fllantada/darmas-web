import { cn } from "@/app/plataform/lib/utils";

interface LegendItem {
  color: string;
  key: string;
  name: string;
}

interface CustomChartLegendProps {
  items: LegendItem[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function ChartLegends({
  items,
  value,
  onChange,
}: CustomChartLegendProps) {
  function toggleFilter(filter: string) {
    if (value.includes(filter)) {
      return onChange(value.filter(f => f !== filter));
    }
    return onChange([...value, filter]);
  }

  return (
    <>
      {items.map(item => (
        <div
          key={item.key}
          className={cn(
            "cursor-pointer select-none",
            !value.includes(item.key) ? "opacity-50" : "",
          )}
          onClick={() => toggleFilter(item.key)}
        >
          <span
            className="size-3 rounded inline-block mr-1 align-middle"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs align-middle	">{item.name}</span>
        </div>
      ))}
    </>
  );
}
