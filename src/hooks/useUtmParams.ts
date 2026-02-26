"use client";

import { useSearchParams } from "next/navigation";

export function useUtmParams() {
  const searchParams = useSearchParams();

  return {
    utmSource: searchParams.get("utm_source") || undefined,
    utmMedium: searchParams.get("utm_medium") || undefined,
    utmCampaign: searchParams.get("utm_campaign") || undefined,
  };
}
