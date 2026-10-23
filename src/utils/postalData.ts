import statesList from '../data/states.json';
import districtsList from '../data/districts.json';

export interface PostOffice {
  name: string;
  type: string;
  delivery: string;
  lat?: number;
  lng?: number;
}

export interface PincodeDetails {
  pincode: string;
  district: string;
  state: string;
  circle: string;
  division: string;
  region: string;
  offices: PostOffice[];
}

export interface StateSummary {
  name: string;
  slug: string;
  districtsCount: number;
  pincodesCount: number;
  officesCount: number;
}

export interface DistrictSummary {
  name: string;
  state: string;
  stateSlug: string;
  slug: string;
  pincodes: string[];
  officesCount: number;
}

export function getAllStates(): StateSummary[] {
  return statesList as StateSummary[];
}

export function getStateBySlug(slug: string): StateSummary | undefined {
  return (statesList as StateSummary[]).find((s) => s.slug === slug);
}

export function getAllDistricts(): DistrictSummary[] {
  return districtsList as DistrictSummary[];
}

export function getDistrictsByState(stateSlug: string): DistrictSummary[] {
  return (districtsList as DistrictSummary[]).filter((d) => d.stateSlug === stateSlug);
}

export function getDistrictBySlugs(stateSlug: string, districtSlug: string): DistrictSummary | undefined {
  return (districtsList as DistrictSummary[]).find(
    (d) => d.stateSlug === stateSlug && d.slug === districtSlug
  );
}

// In-memory cache for loaded prefix files
const prefixCache: Map<string, Record<string, PincodeDetails>> = new Map();

export async function getPincodeData(pin: string): Promise<PincodeDetails | null> {
  if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
    return null;
  }

  const prefix = pin.substring(0, 2);

  if (prefixCache.has(prefix)) {
    const chunk = prefixCache.get(prefix)!;
    return chunk[pin] || null;
  }

  try {
    // Dynamic import for prefix JSON file
    const data = await import(`../data/pincodes/${prefix}.json`);
    const chunk = (data.default || data) as Record<string, PincodeDetails>;
    prefixCache.set(prefix, chunk);
    return chunk[pin] || null;
  } catch (error) {
    console.error(`Failed to load prefix chunk for ${prefix}`, error);
    return null;
  }
}

export function getNearbyPincodes(targetPin: string, district: string, limit = 8): string[] {
  const dist = (districtsList as DistrictSummary[]).find(
    (d) => d.name.toLowerCase() === district.toLowerCase()
  );
  if (!dist || !dist.pincodes) return [];
  return dist.pincodes.filter((p) => p !== targetPin).slice(0, limit);
}
