import React from "react";
import { clsx, type ClassValue } from "clsx";
import parse, {
  DOMNode,
  domToReact,
  Element,
  HTMLReactParserOptions,
} from "html-react-parser";
import { twMerge } from "tailwind-merge";

import type { NextError } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const htmlToReact = (tag: string, html: string) => {
  return ({ ...props }) => {
    const options: HTMLReactParserOptions = {
      replace: domNode => {
        const el = domNode as Element;
        if (el.attribs) {
          if (el.tagName === tag) {
            return React.createElement(
              tag,
              { ...el.attribs, ...props },
              domToReact(el.children as DOMNode[]),
            );
          }
        }
      },
    };
    return parse(html, options);
  };
};

export function isNotNullOrUndefined<T>(
  value: T | null | undefined,
): value is T {
  return !(value === null || value === undefined);
}
export function isNullOrUndefined<T>(
  value: T | null | undefined,
): value is null | undefined {
  return value === null || value === undefined;
}

export function getNextError(e: unknown): string {
  const error = e as NextError;

  return error.message + (error.digest ? `(Digest: ${error.digest})` : "");
}

export const handleVesselStatePortId = (portId: string): string => {
  return portId.length > 3 ? portId.slice(portId.length - 3) : portId;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mode = (arr: Array<any>) =>
  [...new Set(arr)]
    .map(value => [value, arr.filter(v => v === value).length])
    .sort((a, b) => b[1] - a[1])
    .filter((v, i, a) => v[1] === a[0][1])
    .map(v => v[0]);

type PortForSorting = {
  sequence?: number | null;
  direction?: string | null;
  proformaArrivalTime?: string | null;
  port?: string | null;
};

export function sortPorts<T extends PortForSorting>(ports: T[]): T[] {
  // First group ports by direction
  const portByDirection = ports.reduce<Record<string, T[]>>((acc, port) => {
    if (port.direction) {
      if (!acc[port.direction]) {
        acc[port.direction] = [port];
      } else acc[port.direction].push(port);
    }
    return acc;
  }, {});

  // Sort each group by sequence
  const directionsSortedBySequence = Object.keys(portByDirection).map(key =>
    portByDirection[key].sort(
      (a, b) =>
        (a.sequence ?? Number.MAX_SAFE_INTEGER) -
        (b.sequence ?? Number.MAX_SAFE_INTEGER),
    ),
  );

  // Sort the groups by proformaArrivalTime
  directionsSortedBySequence.sort((a, b) => {
    const timeA = a[0].proformaArrivalTime || "";
    const timeB = b[0].proformaArrivalTime || "";

    return timeA.localeCompare(timeB);
  });

  return directionsSortedBySequence.flat();
}

export function numberToNoDecimalString(data?: number): string | undefined {
  // Check if data is between -0.5 and 0, rounding to 0 would result in -0

  if (data === undefined) return undefined;
  if (data > -0.5 && data < 0) {
    // Force it to 0
    return "0";
  }

  // Otherwise, use toFixed as normal
  return data.toFixed(0);
}

export function numberToNoDecimalStringPercentage(
  data?: number,
  decimals: number = 0,
): string | undefined {
  if (data === undefined) return undefined;

  // Check if data is between -0.5 and 0, rounding to 0 would result in -0
  if (data > -0.5 && data <= 0 && decimals === 0) {
    // Force it to 0
    return "0%";
  }

  if (decimals !== 0) {
    const numberWithSelectedDecimals =
      Math.round(data * 10 * decimals) / (decimals * 10);

    return `${numberWithSelectedDecimals}%`;
  }

  // Otherwise, use toFixed as normal

  return `${data.toFixed(decimals)}%`;
}

export function numberToDecimalString(
  data?: number,
  decimals: number = 0,
): string | undefined {
  // Check if data is between -0.5 and 0, rounding to 0 would result in -0

  if (data === undefined) return undefined;

  if (decimals === 0) {
    return numberToNoDecimalString(data);
  }
  if (data === 0) return "0";

  return data.toFixed(decimals);
}

export function numberToDecimalStringPercentage(
  data?: number,
  decimals: number = 0,
): string | undefined {
  if (data === undefined) return undefined;

  // Check if data is between -0.5 and 0, rounding to 0 would result in -0
  if (data > -0.5 && data < 0 && decimals === 0) {
    // Force it to 0
    return "0%";
  }

  if (decimals !== 0) {
    const numberWithSelectedDecimals =
      Math.round(data * 10 * decimals) / (decimals * 10);

    return `${numberWithSelectedDecimals}%`;
  }

  // Otherwise, use toFixed as normal

  return `${data.toFixed(decimals)}%`;
}
