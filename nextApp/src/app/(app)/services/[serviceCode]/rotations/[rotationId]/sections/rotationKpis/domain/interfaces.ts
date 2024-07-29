export type BaseCardValue = {
  kpiValue: string;
  actual?: string;
  comparison?: string;
  delta?: string;
  deltaPercentage?: string;
  proforma?: string;
  isPositive?: boolean;
  variation?: string;
};

export type CargoCardValue = {
  kpiValue: number;
  variation: number;
  isPositive?: boolean;
};
export interface EndSeaPrimaryKpis {
  speed: BaseCardValue;
  distance: BaseCardValue;
  cargoOnboard: {
    ladenDry: CargoCardValue;
    ladenReefer: CargoCardValue;
    emptyDry: CargoCardValue;
  };
  consumption: BaseCardValue;
  emissions: BaseCardValue;
}
export interface EndSeaSecondaryKpis {
  rpm: BaseCardValue;
  secaDistance: BaseCardValue;
  engineLoad: BaseCardValue;
  slip: BaseCardValue;
  serviceCii: BaseCardValue;
}
export interface EndPortPrimaryKpis {
  waitingTime: BaseCardValue;
  portStayTime: BaseCardValue;
  grossBerthProductivity: BaseCardValue;
  containerMoves: BaseCardValue;
  restowMoves: BaseCardValue;
}
export interface EndPortSecondaryKpis {
  consumption: BaseCardValue;
  grossCraneProductivity: BaseCardValue;
  grossCraneIntensity: BaseCardValue;
  idleTime: BaseCardValue;
  timeLostRestow: BaseCardValue;
}

export interface EndRotationKpis {
  seaPrimaryRotationKpis: EndSeaPrimaryKpis;
  seaSecondaryRotationKpis: EndSeaSecondaryKpis;
  portPrimaryRotationKpis: EndPortPrimaryKpis;
  portSecondaryRotationKpis: EndPortSecondaryKpis;
}
