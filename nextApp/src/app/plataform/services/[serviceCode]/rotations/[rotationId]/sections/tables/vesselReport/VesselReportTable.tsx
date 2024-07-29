"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";

import {
  calculateRotationType,
  RotationType,
} from "@/app/plataform/globalDomain/rotationTypes";
import { ERROR_TABLE_TEXT } from "@/app/plataform/text/rotations";

import { useRotationStore } from "../../../store/rotationStore";
import { TableErrorMessage } from "../components/TableErrorMessage";
import ScheduleTable from "./Table";
import { sort, tableColumns } from "./tableConfig";

interface IProps {}

export function VesselReportTable({}: IProps) {
  const vesselVoyage = useRotationStore(state => state.vesselVoyage);
  const isFutureVoyage = useMemo(() => {
    const startDateIsFuture: boolean =
      DateTime.fromISO(vesselVoyage?.startDate).diffNow().milliseconds > 0;
    const hasNoVesselStates =
      !vesselVoyage?.vesselStates || vesselVoyage?.vesselStates.length === 0;

    return startDateIsFuture && hasNoVesselStates;
  }, [vesselVoyage]);

  const isPartnerVoyage = useMemo(() => {
    if (!vesselVoyage || !vesselVoyage?.vesselCode) return false;

    const isPartner =
      calculateRotationType(vesselVoyage.vesselCode) === RotationType.PARTNER;

    return isPartner;
  }, [vesselVoyage]);

  if (!vesselVoyage) return null;

  if (isPartnerVoyage) {
    return <TableErrorMessage message={ERROR_TABLE_TEXT.IS_PARTNER_VESSEL} />;
  }

  if (isFutureVoyage) {
    return <TableErrorMessage message={ERROR_TABLE_TEXT.IS_FUTURE_VOYAGE} />;
  }
  return (
    <ScheduleTable columns={tableColumns} sort={sort} voyage={vesselVoyage} />
  );
}
