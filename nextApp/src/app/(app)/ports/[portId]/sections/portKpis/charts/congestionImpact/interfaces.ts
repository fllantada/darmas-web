export interface CongestionImpactState {
  time: Date;
  percentageUsed: number;
  numberOfShips: number;
}

export type CongestionImpact = CongestionImpactState[];
