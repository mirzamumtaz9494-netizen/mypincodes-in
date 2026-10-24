import type { APIRoute } from 'astro';
import { getAllStates } from '../../../utils/postalData';

export const prerender = false;

export const GET: APIRoute = async () => {
  const states = getAllStates();

  return new Response(
    JSON.stringify({
      success: true,
      count: states.length,
      states
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=604800, s-maxage=604800'
      }
    }
  );
};
