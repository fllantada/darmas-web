"use client";

import { useMemo } from "react";
import type { PortType } from "@/generated/graphql";
import bbox from "@turf/bbox";
import {
  featureCollection,
  point,
  polygon,
  type Feature,
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
import {
  isNotNullOrUndefined,
  isNullOrUndefined,
} from "@/app/plataform/lib/utils";
import { mapStyles } from "@/app/plataform/theme";

import { getTerminalPolygon } from "../../utils/geometry";

import "mapbox-gl/dist/mapbox-gl.css";

type ServiceRouteMapProps = {
  port: PortType;
};

export default function PortMap({ port }: ServiceRouteMapProps): JSX.Element {
  const [portPoygon, mapBbox, terminalPolygons] = useMemo(() => {
    if (isNullOrUndefined(port?.geometry?.coordinates)) {
      return [null, null, null];
    }
    const portPoygon = polygon([port.geometry.coordinates]);

    let terminalPolygons = null;

    if (isNotNullOrUndefined(port?.terminals)) {
      terminalPolygons = featureCollection(
        (port.terminals
          ?.map(t => {
            if (t.berths && t.berths.length > 0) {
              const polygon = getTerminalPolygon(t);
              return polygon ? polygon : null;
            }
            return null;
          })
          .filter(t => t !== null) as Feature<
          Polygon,
          GeoJSON.GeoJsonProperties
        >[]) || [],
      );
    }

    if (terminalPolygons?.features.length === 0) {
      const mapBbox = bbox(
        transformScale(featureCollection([portPoygon]), 1.7),
      ) as [number, number, number, number];

      return [portPoygon, mapBbox, null];
    }

    const mapBbox = bbox(
      transformScale(
        featureCollection([portPoygon, ...(terminalPolygons?.features ?? [])]),
        1.7,
      ),
    ) as [number, number, number, number];

    return [portPoygon, mapBbox, terminalPolygons];
  }, [port.geometry, port.terminals]);

  const terminalPoints = useMemo(() => {
    if (isNullOrUndefined(port?.terminals)) return null;

    if (port.terminals.length === 0) return null;

    const terminalsWithCenter = port.terminals.filter(
      terminal =>
        isNotNullOrUndefined(terminal.center) && terminal.center.length > 0,
    );

    const terminalPoints: Feature<
      Point,
      {
        name: string;
      }
    >[] = [];
    terminalsWithCenter.forEach(terminal => {
      terminal.center.forEach(
        (center: { type: string; coordinates: number[] }) => {
          terminalPoints.push(
            point(center.coordinates, { name: terminal.terminalName }),
          );
        },
      );
    });

    const points = featureCollection(terminalPoints);

    return points;
  }, [port.terminals]);

  return (
    <Map
      initialViewState={{
        pitch: 0,
        bearing: 0,
        bounds: mapBbox ?? undefined,
      }}
      pitchWithRotate={false}
      minZoom={1}
      maxZoom={16}
      mapStyle={mapStyles.light}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      renderWorldCopies={true}
      projection={{ name: "mercator" }}
    >
      <LayerIcon imageUrl="/images/maps/port.png" imageId="port-icon" />
      {portPoygon && (
        <Source id="port" type="geojson" data={portPoygon}>
          <Layer
            id="port-layer-fill"
            type="fill"
            paint={{ "fill-color": "black", "fill-opacity": 0.1 }}
          />
          <Layer
            id="port-layer-line"
            type="line"
            paint={{ "line-color": "#00C1D2", "line-width": 2 }}
          />
        </Source>
      )}
      {terminalPolygons && (
        <Source id="terminals-polygons" type="geojson" data={terminalPolygons}>
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
      {terminalPoints && (
        <Source
          id="terminal-points"
          type="geojson"
          data={terminalPoints}
          cluster={true}
        >
          <Layer
            id="terminal-point-layer"
            type="symbol"
            filter={["!", ["has", "point_count"]]}
            layout={{ "icon-image": "port-icon", "icon-size": 1 }}
          />
          <Layer
            id="terminal-point-name"
            type="symbol"
            filter={["!", ["has", "point_count"]]}
            layout={{
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 15,
              "text-field": "{name}",
              "text-offset": [0, 1.6],
            }}
            paint={{
              "text-color": "black",
            }}
          />
          <Layer
            id="terminal-clusters"
            type="circle"
            filter={["has", "point_count"]}
            paint={{
              "circle-color": "white",
              "circle-stroke-color": "#00C1D2",
              "circle-stroke-width": 2,
              "circle-radius": 20,
            }}
          />
          <Layer
            id="terminal-cluster-count"
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
