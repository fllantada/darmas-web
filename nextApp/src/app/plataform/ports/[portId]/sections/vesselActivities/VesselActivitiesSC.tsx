import VesselActivities from "./VesselActivities";

type IProps = {
  portId: string;
  className?: string;
};

export default async function VesselActivitiesSC({
  className,
  portId,
}: IProps) {
  const data = {} as any;
  return <VesselActivities portActivities={data} className={className} />;
}
