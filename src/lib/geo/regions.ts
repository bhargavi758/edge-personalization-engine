export interface GeoInfo {
  country: string;
  region: string;
  city: string;
  timezone: string;
  continent: string;
}

const CONTINENT_MAP: Record<string, string> = {
  US: "North America",
  CA: "North America",
  MX: "North America",
  BR: "South America",
  AR: "South America",
  GB: "Europe",
  DE: "Europe",
  FR: "Europe",
  ES: "Europe",
  IT: "Europe",
  NL: "Europe",
  SE: "Europe",
  CH: "Europe",
  JP: "Asia",
  CN: "Asia",
  KR: "Asia",
  IN: "Asia",
  SG: "Asia",
  AU: "Oceania",
  NZ: "Oceania",
  NG: "Africa",
  ZA: "Africa",
  KE: "Africa",
};

const TIMEZONE_MAP: Record<string, string> = {
  US: "America/Los_Angeles",
  CA: "America/Toronto",
  GB: "Europe/London",
  DE: "Europe/Berlin",
  FR: "Europe/Paris",
  JP: "Asia/Tokyo",
  CN: "Asia/Shanghai",
  IN: "Asia/Kolkata",
  AU: "Australia/Sydney",
  BR: "America/Sao_Paulo",
  SG: "Asia/Singapore",
  KR: "Asia/Seoul",
};

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  MX: "Mexico",
  BR: "Brazil",
  AR: "Argentina",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  ES: "Spain",
  IT: "Italy",
  NL: "Netherlands",
  SE: "Sweden",
  CH: "Switzerland",
  JP: "Japan",
  CN: "China",
  KR: "South Korea",
  IN: "India",
  SG: "Singapore",
  AU: "Australia",
  NZ: "New Zealand",
  NG: "Nigeria",
  ZA: "South Africa",
  KE: "Kenya",
};

export function resolveGeo(
  countryCode: string,
  regionCode: string,
  city: string
): GeoInfo {
  return {
    country: countryCode || "US",
    region: regionCode || "CA",
    city: city || "San Francisco",
    timezone: TIMEZONE_MAP[countryCode] ?? "America/Los_Angeles",
    continent: CONTINENT_MAP[countryCode] ?? "North America",
  };
}

export function getCountryName(code: string): string {
  return COUNTRY_NAMES[code] ?? code;
}

export function getTimezone(countryCode: string): string {
  return TIMEZONE_MAP[countryCode] ?? "America/Los_Angeles";
}

export const GEO_HEADER_COUNTRY = "x-vercel-ip-country" as const;
export const GEO_HEADER_REGION = "x-vercel-ip-region" as const;
export const GEO_HEADER_CITY = "x-vercel-ip-city" as const;
export const GEO_COOKIE = "geo_info" as const;
