import { TerminalType } from "@/generated/graphql";
import centroid from "@turf/centroid";
import circle from "@turf/circle";
import convex from "@turf/convex";
import distance from "@turf/distance";
import {
  featureCollection,
  multiPoint,
  point,
  type Feature,
  type Polygon,
} from "@turf/helpers";
import transformScale from "@turf/transform-scale";
import { Position } from "@turf/turf";

function getEncompainsingCircle(positions: Position[]) {
  const pointFeatures = positions.map(coords => point(coords));
  const points = featureCollection(pointFeatures);
  const center = centroid(points);

  const radius = Math.max(
    ...pointFeatures.map(p => distance(center, p, { units: "nauticalmiles" })),
  );
  return circle(center, radius ? radius * 1.2 : 0.1, {
    units: "nauticalmiles",
  });
}

export function getTerminalPolygon(
  terminal: TerminalType,
): Feature<Polygon, GeoJSON.GeoJsonProperties> | undefined {
  const berthsCoordinates = terminal.berths
    ?.map(berth =>
      berth?.berthLocation?.coordinates
        ? berth.berthLocation.coordinates
        : undefined,
    )
    .filter(element => element !== undefined) as number[][];

  const terminalCenter = terminal?.center
    ? (terminal.center as {
        type: string;
        coordinates: number[];
      }[])
    : null;

  const coordinates: Position[] = [...berthsCoordinates];

  terminalCenter?.forEach(center => {
    coordinates.push(center.coordinates);
  });

  if (coordinates.length > 1) {
    if (coordinates.length > 2) {
      const points = multiPoint(coordinates);
      const concaveHull = convex(points);

      if (concaveHull) {
        return transformScale(concaveHull, 2);
      } else {
        return getEncompainsingCircle(coordinates);
      }
    }
  }

  return;
}
