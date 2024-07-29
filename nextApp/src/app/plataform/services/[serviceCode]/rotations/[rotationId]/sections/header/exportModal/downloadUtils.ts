"use client";

import { download, generateCsv, mkConfig } from "export-to-csv";

const csvConfig = mkConfig({ useKeysAsHeaders: true });

export function startDownload(
  filename: string,
  data: Record<string, string>[],
) {
  const csvData = generateCsv(csvConfig)(data);

  download({
    ...csvConfig,
    filename,
  })(csvData);
}

export function capitalizeWords(phrase: string) {
  return phrase
    .split(" ")
    .map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
