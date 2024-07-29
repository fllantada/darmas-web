"use client";

import { ROTATIONS_TEXT } from "@/text/rotations";
import { HeaderKpiTitles } from "@/text/services";

import { numberToDecimalStringPercentage } from "@/lib/utils";
import KpiCard, {
  ComparisonTrend,
  DeltaTrend,
} from "@/components/ui/kpiCard/kpiCard";
import { emissionsCiiColors } from "@/app/theme";

import { EmissionKpiValues } from "../../../domain/interfaces";

interface IProps {
  emissions: EmissionKpiValues;
  isSelected?: boolean;
  onClick?: () => void;
}

export function EmissionKpiCard({
  emissions,
  isSelected,
  onClick,
}: IProps): JSX.Element {
  return (
    <KpiCard
      id="emissions"
      infoText={ROTATIONS_TEXT.HEADER_KPI.EMISSION_INFO_TEXT}
      selected={isSelected}
      className="basis-1/4"
      title={HeaderKpiTitles.emissions}
      kpiResult={(() => {
        if (emissions?.kpiValue) {
          const [stringPercentage, ciiRating] = emissions.kpiValue
            .toString()
            .split(" ");

          const valueFloat = parseFloat(stringPercentage);

          return (
            <>
              {numberToDecimalStringPercentage(valueFloat, 0)}
              <span
                className="px-2 rounded ml-1"
                style={
                  emissionsCiiColors[
                    ciiRating as keyof typeof emissionsCiiColors
                  ]
                }
              >
                {ciiRating}
              </span>
            </>
          );
        }

        return undefined;
      })()}
      comparisonTrend={
        emissions?.comparison && emissions.comparison >= 0
          ? ComparisonTrend.UP
          : ComparisonTrend.DOWN
      }
      comparisonResult={emissions?.comparison?.toString()}
      proformaAbsolute={
        emissions?.proforma ? (
          <span
            className="px-2 py-1 rounded"
            style={
              emissionsCiiColors[
                emissions.proforma.toString() as keyof typeof emissionsCiiColors
              ]
            }
          >
            {emissions.proforma}
          </span>
        ) : undefined
      }
      actualAbsolute={
        emissions?.actual ? (
          <span
            className="px-2 py-1 rounded"
            style={
              emissionsCiiColors[
                emissions.actual.toString() as keyof typeof emissionsCiiColors
              ]
            }
          >
            {emissions.actual}
          </span>
        ) : undefined
      }
      deltaTrend={
        emissions?.delta && emissions.delta >= 0
          ? DeltaTrend.POSITIVE
          : DeltaTrend.NEGATIVE
      }
      deltaAbsolute={emissions?.delta?.toString()}
      deltaPercent={emissions?.deltaPercentage?.toString()}
      onClick={onClick}
    />
  );
}
