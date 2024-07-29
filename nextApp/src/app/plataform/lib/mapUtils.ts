interface ZoomSize {
  zoom: number;
  size: number;
}

const predefinedSizes: ZoomSize[] = [
  { zoom: 1, size: 25 },
  { zoom: 10, size: 35 },
  { zoom: 15, size: 55 },
  { zoom: 18, size: 150 },
];

export function linearZoomInterpolation(
  zoom: number,
  multiplier: number = 1,
): number {
  // Check if the zoom level is already in predefined sizes
  const exactMatch = predefinedSizes.find(item => item.zoom === zoom);
  if (exactMatch) {
    return exactMatch.size;
  }

  // Sort the array by zoom level for easier traversal
  const sortedSizes = [...predefinedSizes].sort((a, b) => a.zoom - b.zoom);

  // Find two nearest known zoom levels for interpolation
  let lower: ZoomSize | null = null;
  let upper: ZoomSize | null = null;

  for (const item of sortedSizes) {
    if (item.zoom < zoom) {
      lower = item;
    } else if (item.zoom > zoom) {
      upper = item;
      break;
    }
  }

  let size = 0;
  if (lower && upper) {
    // Linear interpolation
    const ratio = (zoom - lower.zoom) / (upper.zoom - lower.zoom);
    size = lower.size + ratio * (upper.size - lower.size);
  } else {
    // If lower or upper bound is not found, use the closest known size
    size = lower ? lower.size : upper ? upper.size : 0;
  }

  return size * multiplier;
}
