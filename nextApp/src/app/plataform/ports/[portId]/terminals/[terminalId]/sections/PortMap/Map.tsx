"use client";

import { useMemo } from "react";
import type { TerminalType } from "@/generated/graphql";
import bbox from "@turf/bbox";
import {
  featureCollection,
  point,
  type Point,
  type Polygon,
} from "@turf/helpers";
import transformScale from "@turf/transform-scale";
import Map, {
  Layer,
  NavigationControl,
  ScaleControl,
  Source,
} from "react-map-gl";

import LayerIcon from "@/components/map/LayerIcon";

import { getTerminalPolygon } from "./geometry";

import "mapbox-gl/dist/mapbox-gl.css";

type ServiceRouteMapProps = {
  terminal: TerminalType;
};

export default function TerminalMap({
  terminal,
}: ServiceRouteMapProps): JSX.Element {
  const [mapBbox, terminalPolygon] = useMemo(() => {
    const terminalPolygon = getTerminalPolygon(terminal);

    if (!terminalPolygon) {
      return [null, null];
    }

    const validBerths =
      terminal.berths?.filter(
        b =>
          b.berthLocation &&
          b.berthLocation?.coordinates &&
          b.berthLocation.coordinates.length === 2,
      ) ?? [];

    const mapBbox = bbox(
      transformScale(
        featureCollection<Polygon | Point>([
          terminalPolygon,
          ...(validBerths.map(b => point(b.berthLocation.coordinates)) || []),
        ]),
        1.2,
      ),
    ) as [number, number, number, number];

    return [mapBbox, terminalPolygon];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminal.id]);

  const berthPoints = useMemo(() => {
    const validBerths =
      terminal.berths?.filter(
        b =>
          b.berthLocation &&
          b.berthLocation?.coordinates &&
          b.berthLocation.coordinates.length === 2,
      ) ?? [];
    const berthsLocations =
      validBerths.length > 0
        ? featureCollection(
            validBerths.map(b =>
              point(b.berthLocation.coordinates, { name: b.berthName }),
            ),
          )
        : undefined;
    return berthsLocations;
  }, [terminal.berths]);

  return (
    <Map
      initialViewState={{
        pitch: 0,
        bearing: 0,
        bounds: mapBbox ? mapBbox : undefined,
      }}
      pitchWithRotate={false}
      minZoom={1}
      maxZoom={16}
      mapStyle="mapbox://styles/suteu/clm2yg0jc00sd01pbfgkh8zt4"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      renderWorldCopies={true}
      projection={{ name: "mercator" }}
    >
      <LayerIcon imageUrl="/images/maps/anchor.png" imageId="anchor-icon" />
      {terminalPolygon && (
        <Source id="terminal" type="geojson" data={terminalPolygon}>
          <Layer
            id="terminal-layer-fill"
            type="fill"
            paint={{ "fill-color": "#00C1D2", "fill-opacity": 0.5 }}
          />
          <Layer
            id="terminal-layer-line"
            type="line"
            paint={{ "line-color": "#00C1D2", "line-width": 2 }}
          />
        </Source>
      )}
      {berthPoints && (
        <Source
          id="berth-points"
          type="geojson"
          data={berthPoints}
          cluster={true}
        >
          <Layer
            id="berth-point-layer"
            type="symbol"
            filter={["!", ["has", "point_count"]]}
            layout={{ "icon-image": "anchor-icon", "icon-size": 1 }}
          />
          <Layer
            id="berth-point-name"
            type="symbol"
            filter={["!", ["has", "point_count"]]}
            layout={{
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 15,
              "text-field": "{name}",
              "text-offset": [0, 1.7],
            }}
            paint={{
              "text-color": "white",
            }}
          />
          <Layer
            id="berth-clusters"
            type="circle"
            filter={["has", "point_count"]}
            paint={{
              "circle-color": "white",
              "circle-radius": 20,
            }}
          />
          <Layer
            id="berth-cluster-count"
            type="symbol"
            filter={["has", "point_count"]}
            layout={{
              "text-field": ["get", "point_count_abbreviated"],
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 16,
            }}
            paint={{ "text-color": "black" }}
          />
        </Source>
      )}
      <ScaleControl unit="nautical" />
      <NavigationControl visualizePitch={false} />
    </Map>
  );
}
