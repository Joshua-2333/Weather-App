// api.js
const API_KEY = 'N6DDC6TGCPN6UH67ZF6H97KBJ';
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

/**
 * Determines if a string is in valid "lat,lon" format
 * @param {string} input
 * @returns {boolean}
 */
function isLatLon(input) {
  return /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(input);
}

/**
 * Fetch weather data from Visual Crossing API
 * @param {string} location - City name or "lat,lon"
 * @returns {Promise<Object>} Weather data object
 */
async function getWeatherData(location) {
  if (!location || typeof location !== 'string' || location.trim() === '') {
    console.warn('getWeatherData: No valid location provided. Skipping fetch.');
    return null;
  }

  const query = isLatLon(location) ? location : encodeURIComponent(location.trim());
  const url = `${BASE_URL}/${query}?key=${API_KEY}&unitGroup=us&include=current,hours,days`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.currentConditions || !data.days || !data.days.length) {
      throw new Error('Incomplete weather data received from API');
    }

    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    throw error;
  }
}

export { getWeatherData };
