import { LoadingState } from "@/app/plataform/lib/types";

import { EndRotationKpis } from "../../domain/interfaces";
import { AtPortMainKpiCards } from "./AtPortMain";
import { AtPortSecondaryKpiCards } from "./AtPortSecondary";
import { AtSeaMainKpiCards } from "./AtSeaMain";
import { AtSeaSecondaryKpiCards } from "./AtSeaSecondary";

type IProps = {
  loadingState: LoadingState;
  rotationKpis: EndRotationKpis;
};

export function EndCards({ loadingState, rotationKpis }: IProps): JSX.Element {
  return (
    <>
      <AtSeaMainKpiCards
        loadingState={loadingState}
        seaPrimaryKpis={rotationKpis.seaPrimaryRotationKpis}
      />
      <AtSeaSecondaryKpiCards
        loadingState={loadingState}
        seaSecondaryKpis={rotationKpis.seaSecondaryRotationKpis}
      />
      <AtPortMainKpiCards
        loadingState={loadingState}
        portPrimaryKpis={rotationKpis.portPrimaryRotationKpis}
      />
      <AtPortSecondaryKpiCards
        loadingState={loadingState}
        portSecondaryKpis={rotationKpis.portSecondaryRotationKpis}
      />
    </>
  );
}
