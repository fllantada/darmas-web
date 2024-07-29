import { getPortActivities } from "./actions";
import VesselActivities from "./VesselActivities";

type IProps = {
  portId: string;
  className?: string;
};

export default async function VesselActivitiesSC({
  className,
  portId,
}: IProps) {
  const data = await getPortActivities(portId);
  return <VesselActivities portActivities={data} className={className} />;
}
