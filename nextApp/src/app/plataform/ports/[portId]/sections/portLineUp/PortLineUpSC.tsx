import { PortLineUp } from "./PortLineUp";

interface IProps {
  portId: string;
}

export async function PortLineUpSC({ portId }: IProps) {
  const data: any = {};
  if (!data) return null;
  return <PortLineUp vesselsArriving={data} />;
}
