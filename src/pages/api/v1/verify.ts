import type { APIRoute } from 'astro';
import { getPincodeData } from '../../../utils/postalData';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const pin = url.searchParams.get('pin');
  const expectedState = (url.searchParams.get('state') || '').trim().toLowerCase();
  const expectedDistrict = (url.searchParams.get('district') || '').trim().toLowerCase();

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
        success: true,
        isValid: false,
        error: `PIN code ${pin} does not exist.`
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }

  const actualState = (data.state || '').toLowerCase();
  const actualDistrict = (data.district || '').toLowerCase();

  const stateMatch = expectedState ? actualState.includes(expectedState) || expectedState.includes(actualState) : null;
  const districtMatch = expectedDistrict ? actualDistrict.includes(expectedDistrict) || expectedDistrict.includes(actualDistrict) : null;

  const isValidMatch = (stateMatch !== false) && (districtMatch !== false);

  return new Response(
    JSON.stringify({
      success: true,
      pincode: data.pincode,
      isValid: true,
      match: isValidMatch,
      stateMatch,
      districtMatch,
      resolvedState: data.state,
      resolvedDistrict: data.district
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
