"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { VesselType } from "@/generated/graphql";
import { featureCollection, point } from "@turf/helpers";
import type { ViewStateChangeEvent } from "react-map-gl";

import { LoadingState } from "@/app/plataform/lib/types";
import { mapStyles } from "@/app/theme";

import { LoadingContainer } from "../LoadingContainer";
import type { VeseelForMap } from "./Vessel";
import Vessels from "./Vessels";

import "mapbox-gl/dist/mapbox-gl.css";

const Map = dynamic(() => import("react-map-gl"), { ssr: false });
const ScaleControl = dynamic(
  () => import("react-map-gl").then(mod => mod.ScaleControl),
  { ssr: false },
);
const NavigationControl = dynamic(
  () => import("react-map-gl").then(mod => mod.NavigationControl),
  { ssr: false },
);

type ServiceRouteMapProps = {
  className?: string;
  vessels: VesselType[];
  labelsAlwaysVisible?: boolean;
  mapStyle: keyof typeof mapStyles;
};

export default function ServiceRouteMap({
  className,
  vessels,
  labelsAlwaysVisible = false,
  mapStyle,
}: ServiceRouteMapProps): JSX.Element {
  const [state, setState] = useState<LoadingState>(LoadingState.LOADING);
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [zoom, setZoom] = useState(2);
  const [mapBbox, setMapBbox] = useState<[number, number, number, number]>();
  const [vesselsForMap, setVesselsForMap] = useState<VeseelForMap[]>([]);

  useEffect(() => {
    setState(LoadingState.LOADING);
    (async () => {
      try {
        const bbox = (await import("@turf/bbox")).default;
        const buffer = (await import("@turf/buffer")).default;
        const vesselsWithLatestPosition = vessels.filter(
          vessels => vessels.latestPosition,
        ) as VeseelForMap[];

        const points = vesselsWithLatestPosition.map(v =>
          point([v.latestPosition.longitude, v.latestPosition.latitude]),
        );

        const featurePoints = featureCollection(points);
        const buffered = buffer(featurePoints, 300, { units: "nauticalmiles" });

        setMapBbox(bbox(buffered) as [number, number, number, number]);
        setVesselsForMap(vesselsWithLatestPosition);
        setState(LoadingState.SUCCESS);
      } catch (e) {
        const error = e as Error;
        setErrorDetails(error.message);
        setState(LoadingState.FAILED);
      }
    })();
  }, [vessels]);

  function handleZoom(e: ViewStateChangeEvent) {
    setZoom(e.viewState.zoom);
  }

  return (
    <LoadingContainer
      className={className}
      loadingMessage="Loading map data"
      errorMessage="Failed to load map data"
      errorDetails={errorDetails}
      state={state}
    >
      {vesselsForMap && (
        <Map
          initialViewState={{
            pitch: 0,
            bearing: 0,
            bounds: mapBbox,
          }}
          pitchWithRotate={false}
          touchZoomRotate={false}
          touchPitch={false}
          dragRotate={false}
          minZoom={1}
          maxZoom={16}
          mapStyle={mapStyles[mapStyle]}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          onZoom={handleZoom}
          renderWorldCopies={true}
          projection={{ name: "mercator" }}
        >
          <Vessels
            vessels={vesselsForMap}
            zoom={zoom}
            labelsAlwaysVisible={labelsAlwaysVisible}
          />
          <ScaleControl unit="nautical" />
          <NavigationControl visualizePitch={false} showCompass={false} />
        </Map>
      )}
    </LoadingContainer>
  );
}
