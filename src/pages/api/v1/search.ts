import type { APIRoute } from 'astro';
import searchIndex from '../../../data/search_index.json';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const query = (url.searchParams.get('q') || '').trim().toLowerCase();
  const limitParam = parseInt(url.searchParams.get('limit') || '10', 10);
  const limit = Math.min(Math.max(limitParam || 10, 1), 50);

  if (!query || query.length < 2) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Search query parameter "q" must be at least 2 characters long.'
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }

  // searchIndex format: [pincode, officeName, district, state]
  const rawList = searchIndex as Array<[string, string, string, string]>;
  const results = [];

  for (let i = 0; i < rawList.length; i++) {
    const [pincode, officeName, district, state] = rawList[i];
    if (
      pincode.startsWith(query) ||
      officeName.toLowerCase().includes(query) ||
      district.toLowerCase().includes(query)
    ) {
      results.push({
        pincode,
        officeName,
        district,
        state
      });
      if (results.length >= limit) break;
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      query,
      count: results.length,
      results
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    }
  );
};
