import type { APIRoute } from 'astro';
import { getPincodeData } from '../../../utils/postalData';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const pin = url.searchParams.get('pin');

  if (!pin || !/^\d{6}$/.test(pin)) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Invalid or missing PIN code. Must be a 6-digit number.'
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

  const data = await getPincodeData(pin);

  if (!data) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `No postal records found for PIN code ${pin}.`
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      pincode: data.pincode,
      district: data.district,
      state: data.state,
      circle: data.circle,
      division: data.division,
      region: data.region,
      officesCount: data.offices?.length || 0,
      offices: data.offices || []
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400'
      }
    }
  );
};
