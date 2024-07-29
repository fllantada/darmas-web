import { memo } from "react";
import type { VesselType, VoyageType } from "@/generated/graphql";
import { AlertCircle } from "lucide-react";

import { cn } from "@/app/plataform/lib/utils";

import Port from "./Port";
import type { PortWithVessel } from "./types";

type ServiceRouteProps = {
  voyage: VoyageType;
  vessels: VesselType[];
};

function orderPortsBySequence(ports: PortWithVessel[]) {
  if (!ports) return [];
  return ports.sort((a, b) => a.sequence - b.sequence);
}

function ServiceRoute({ voyage, vessels }: ServiceRouteProps) {
  const portsWithVessels: PortWithVessel[] = voyage.portCalls.map(port => {
    const vessel = vessels.find(vessel => {
      const positionalState = vessel.positionalState;
      if (positionalState && positionalState.direction === port.direction) {
        if (positionalState.status === "At Port") {
          return positionalState.atPort === port.portCode;
        } else {
          return positionalState.arrivalPort === port.portCode;
        }
      }

      return false;
    });
    return vessel ? { ...port, vessel } : port;
  });

  const routeSegments = portsWithVessels.reduce<{
    [key: string]: PortWithVessel[];
  }>((acc, port) => {
    const direction = port.direction;

    if (direction in acc) {
      acc[direction].push(port);
    } else {
      acc[direction] = [port];
    }

    return acc;
  }, {});

  const segmentDirections = Object.keys(routeSegments);

  for (const direction of segmentDirections) {
    routeSegments[direction] = orderPortsBySequence(routeSegments[direction]);
  }

  return (
    <>
      {segmentDirections.length > 0 ? (
        <>
          <div
            className={cn(
              "flex flex-row",
              segmentDirections[1] ? "mb-7" : "mb-4",
            )}
          >
            <div className="flex-none w-12 text-xl font-bold text-[#22242A] itens-center">
              <div>{segmentDirections[0]}</div>
            </div>
            <div className="grow">
              <div className="flex justify-between pb-2 border-b-[2px] min-h-[33px]">
                {routeSegments[segmentDirections[0]].map((port, idx) => (
                  <Port key={idx} port={port} position="top" />
                ))}
              </div>
            </div>
            {segmentDirections[1] && (
              <div className="flex-none">
                <div className="w-4 h-4 border-[#D9E1E0] border-t-[2px] border-r-[2px] rounded-tr-full relative top-[32px]" />
              </div>
            )}
          </div>
          {segmentDirections[1] && (
            <div className="flex flex-row">
              <div className="flex-none w-12 text-xl font-bold text-[#22242A] items-center">
                <div>{segmentDirections[1]}</div>
              </div>
              <div className="grow">
                <div className="flex justify-between pt-2 border-t-[2px] relative min-h-[33px]">
                  {routeSegments[segmentDirections[1]]
                    .reverse()
                    .map((port, idx) => (
                      <Port key={idx} port={port} position="bottom" />
                    ))}
                  <div className="w-1/2" />
                </div>
              </div>
              <div className="w-4 h-4 border-[#D9E1E0] border-b-[2px] border-r-[2px] rounded-br-full relative bottom-[14px]" />
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-slate-300 my-2">
          <AlertCircle size={24} className="inline-block mb-2" />
          <br />
          No data
        </div>
      )}
    </>
  );
}

export default memo(ServiceRoute);
