import { getVesselArrivingPort } from "./actions";
import { PortLineUp } from "./PortLineUp";

interface IProps {
  portId: string;
}

export async function PortLineUpSC({ portId }: IProps) {
  const data = await getVesselArrivingPort(portId);

  if (!data) return null;
  return <PortLineUp vesselsArriving={data} />;
}
