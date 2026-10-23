import usStatesList from '../data/us/states.json';

export interface USPlace {
  name: string;
  county: string;
  lat?: number;
  lng?: number;
}

export interface USZipDetails {
  zip: string;
  city: string;
  state: string;
  stateCode: string;
  county: string;
  places: USPlace[];
}

export interface USStateSummary {
  name: string;
  code: string;
  slug: string;
  countiesCount: number;
  zipcodesCount: number;
}

export function getAllUSStates(): USStateSummary[] {
  return usStatesList as USStateSummary[];
}

export function getUSStateBySlug(slug: string): USStateSummary | undefined {
  return (usStatesList as USStateSummary[]).find((s) => s.slug === slug);
}

export function getUSStateByCode(code: string): USStateSummary | undefined {
  return (usStatesList as USStateSummary[]).find((s) => s.code.toUpperCase() === code.toUpperCase());
}

// In-memory cache for loaded US prefix files
const usPrefixCache: Map<string, Record<string, USZipDetails>> = new Map();

export async function getUSZipData(zip: string): Promise<USZipDetails | null> {
  if (!zip || zip.length !== 5 || !/^\d{5}$/.test(zip)) {
    return null;
  }

  const prefix = zip.substring(0, 2);

  if (usPrefixCache.has(prefix)) {
    const chunk = usPrefixCache.get(prefix)!;
    return chunk[zip] || null;
  }

  try {
    const data = await import(`../data/us/zipcodes/${prefix}.json`);
    const chunk = (data.default || data) as Record<string, USZipDetails>;
    usPrefixCache.set(prefix, chunk);
    return chunk[zip] || null;
  } catch (error) {
    console.error(`Failed to load US prefix chunk for ${prefix}`, error);
    return null;
  }
}
