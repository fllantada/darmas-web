import { AlertCircle } from "lucide-react";

import { LoadingState } from "@/lib/types";
import { cn, isNotNullOrUndefined } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import TrendDownIcon from "@/components/icons/trendDown";
import TrendUpIcon from "@/components/icons/trendUp";

type KpiCardProps = {
  id?: string;
  loadingState?: LoadingState;
  className?: string;
  title: string;
  containerDryLadenActual?: number | null;
  containerDryEmptyActual?: number | null;
  containerRefLadenActual?: number | null;
  containerDryLadenComparison?: number | null;
  containerDryEmptyComparison?: number | null;
  containerRefLadenComparison?: number | null;
};

type TrendElementProps = {
  comparisonResult?: number | null;
};

function TrendElement({ comparisonResult }: TrendElementProps): JSX.Element {
  return isNotNullOrUndefined(comparisonResult) ? (
    <span
      className={cn(
        "font-semibold text-sm",
        comparisonResult < 0 ? "text-red-600" : "text-green-600",
      )}
    >
      {comparisonResult < 0 ? (
        <TrendDownIcon size={15} />
      ) : (
        <TrendUpIcon size={15} />
      )}
      {comparisonResult.toFixed(0)}
    </span>
  ) : (
    <span className="text-slate-400">
      <TrendUpIcon size={15} />
      --
    </span>
  );
}

export default function CargoOnBoardKpiCard({
  className,
  title,
  containerDryLadenActual,
  containerDryEmptyActual,
  containerRefLadenActual,
  containerDryLadenComparison,
  containerDryEmptyComparison,
  containerRefLadenComparison,
  loadingState = LoadingState.SUCCESS,
}: KpiCardProps): JSX.Element {
  const containerClassName = cn(
    "rounded-md border-[1px] px-4 py-5 bg-white border-[#DBDCDF]",
    className,
  );

  if (loadingState === LoadingState.LOADING) {
    return (
      <div className={containerClassName}>
        <span className="align-bottom font-normal text-sm">{title}</span>
        <Skeleton className="w-full h-[40px] mt-5" />
      </div>
    );
  }

  if (loadingState === LoadingState.FAILED) {
    return (
      <div className={cn(containerClassName, "text-red-500")}>
        <span className="align-bottom font-normal text-sm">{title}</span>
        <div className="text-center mb-3">
          <AlertCircle size={18} className="inline" />
          <br />
          <span className="text-xs">Error loading data</span>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <div className="font-normal text-sm text-[#454954] pb-2">
        <span className="align-bottom">{title}</span>
      </div>
      <div className="mt-2 text-xs">
        <div className="grid grid-cols-2">
          <div>Laden/Dry - {containerDryLadenActual?.toFixed(0)}</div>
          <div className="text-right">
            <TrendElement comparisonResult={containerDryLadenComparison} />
          </div>
          <div>Laden/Reefer - {containerRefLadenActual?.toFixed(0)}</div>
          <div className="text-right">
            <TrendElement comparisonResult={containerRefLadenComparison} />
          </div>
          <div>Empty/Dry - {containerDryEmptyActual?.toFixed(0)}</div>
          <div className="text-right">
            <TrendElement comparisonResult={containerDryEmptyComparison} />
          </div>
        </div>
      </div>
    </div>
  );
}
