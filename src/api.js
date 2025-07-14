const API_KEY = 'N6DDC6TGCPN6UH67ZF6H97KBJ';
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

/**
 * Validates if the input is in "lat,lon" format
 * @param {string} input
 * @returns {boolean}
 */
function isLatLon(input) {
  return /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(input.trim());
}

/**
 * Fetch weather data from Visual Crossing API
 * @param {string} location - City name or "lat,lon"
 * @returns {Promise<Object|null>} Weather data object or null if invalid
 */
async function getWeatherData(location) {
  if (!location || typeof location !== 'string' || location.trim() === '') {
    console.warn('[getWeatherData] Skipped: No valid location string provided.');
    return null;
  }

  const query = isLatLon(location) ? location.trim() : encodeURIComponent(location.trim());
  const url = `${BASE_URL}/${query}?key=${API_KEY}&unitGroup=us&include=current,hours,days`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed (HTTP ${response.status})`);
    }

    const data = await response.json();

    if (!data?.currentConditions || !Array.isArray(data.days) || data.days.length === 0) {
      throw new Error('API returned incomplete weather data.');
    }

    return data;
  } catch (error) {
    console.error('[getWeatherData] Error:', error.message);
    throw error;
  }
}

export { getWeatherData };

