export interface ProformaAvailability {
  proformaAvailabilityPercent: string;
  items: ProformaItem[];
}

export interface ProformaItem {
  voyageCode: string;
  vesselName: string;
  vesselClass: string;
  scrubber: string;
  proforma: string;
}
