//changePageTheme.js

// Background images
import clearDay from '/images/clear-day.jpg';
import clearNight from '/images/clear-night.png';
import fog from '/images/fog.png';
import hail from '/images/hail.png';
import partlyCloudyDay from '/images/partly-cloudy-day.jpg';
import partlyCloudyNight from '/images/partly-cloudy-night.jpg';
import rainDay from '/images/rain-day.png';
import rainNight from '/images/rain-night.jpg';
import rainSnowShowersDay from '/images/rain-snow-showers-day.png';
import rainSnowShowersNight from '/images/rain-snow-showers-night.png';
import snowDay from '/images/snow-day.jpg';
import snowNight from '/images/snow-night.jpg';
import thunderShowersDay from '/images/thunder-showers-day.png';
import thunderShowersNight from '/images/thunder-showers-night.jpg';
import windy from '/images/windy.jpg';
import tornadoImg from '/images/tornado.jpg';
import defaultBackground from '/images/default.jpg';

// Forecast GIFs
import clearDayGif from '/gifs/clear-day.gif';
import clearNightGif from '/gifs/clear-night.gif';
import fogGif from '/gifs/fog.gif';
import hailGif from '/gifs/hail.gif';
import partlyCloudyDayGif from '/gifs/partly-cloudy-day.gif';
import partlyCloudyNightGif from '/gifs/partly-cloudy-night.gif';
import rainDayGif from '/gifs/rain-day.gif';
import rainNightGif from '/gifs/rain-night.gif';
import rainSnowShowersDayGif from '/gifs/rain-snow-showers-day.gif';
import rainSnowShowersNightGif from '/gifs/rain-snow-showers-night.gif';
import snowDayGif from '/gifs/snow-day.gif';
import snowNightGif from '/gifs/snow-night.gif';
import thunderShowersDayGif from '/gifs/thunder-showers-day.gif';
import thunderShowersNightGif from '/gifs/thunder-showers-night.gif';
import windyGif from '/gifs/windy.gif';
import tornadoGif from '/gifs/tornado.gif';

// Extra forecast GIFs
import humidityGif from '/gifs/humidity.gif';
import rainChanceGif from '/gifs/rain-chance.gif';
import sunriseGif from '/gifs/sunrise.gif';
import sunsetGif from '/gifs/sunset.gif';
import uvIndexGif from '/gifs/uv-index.gif';

// Maps: weather condition → GIF/icon and background image
const conditionIconMap = {
  'clear-day': clearDayGif,
  'clear-night': clearNightGif,
  'fog': fogGif,
  'hail': hailGif,
  'partly-cloudy-day': partlyCloudyDayGif,
  'partly-cloudy-night': partlyCloudyNightGif,
  'rain-day': rainDayGif,
  'rain-night': rainNightGif,
  'rain-snow-showers-day': rainSnowShowersDayGif,
  'rain-snow-showers-night': rainSnowShowersNightGif,
  'snow-day': snowDayGif,
  'snow-night': snowNightGif,
  'thunder-showers-day': thunderShowersDayGif,
  'thunder-showers-night': thunderShowersNightGif,
  'windy': windyGif,
  'tornado': tornadoGif
};

const conditionBackgroundMap = {
  'clear-day': clearDay,
  'clear-night': clearNight,
  'fog': fog,
  'hail': hail,
  'partly-cloudy-day': partlyCloudyDay,
  'partly-cloudy-night': partlyCloudyNight,
  'rain-day': rainDay,
  'rain-night': rainNight,
  'rain-snow-showers-day': rainSnowShowersDay,
  'rain-snow-showers-night': rainSnowShowersNight,
  'snow-day': snowDay,
  'snow-night': snowNight,
  'thunder-showers-day': thunderShowersDay,
  'thunder-showers-night': thunderShowersNight,
  'windy': windy,
  'tornado': tornadoImg,
  'default': defaultBackground
};

// Determine condition based on data
function getWeatherCondition(current, day) {
  const now = current.datetimeEpoch;
  const isNight = now < day.sunriseEpoch || now > day.sunsetEpoch;

  const { preciptype, windspeed, cloudcover, conditions = '' } = current;

  if (/tornado/i.test(conditions)) return 'tornado';
  if (/thunder/i.test(conditions)) return isNight ? 'thunder-showers-night' : 'thunder-showers-day';
  if (Array.isArray(preciptype)) {
    if (preciptype.includes('rain') && preciptype.includes('snow')) {
      return isNight ? 'rain-snow-showers-night' : 'rain-snow-showers-day';
    }
    if (preciptype.includes('rain')) return isNight ? 'rain-night' : 'rain-day';
    if (preciptype.includes('snow')) return isNight ? 'snow-night' : 'snow-day';
  }
  if (typeof windspeed === 'number' && windspeed >= 20) return 'windy';
  if (/fog/i.test(conditions)) return 'fog';
  if (typeof cloudcover === 'number' && cloudcover >= 30) {
    return isNight ? 'partly-cloudy-night' : 'partly-cloudy-day';
  }
  return isNight ? 'clear-night' : 'clear-day';
}

// Apply theme to page
function changePageTheme(data) {
  const current = data?.currentConditions;
  const today = data?.days?.[0];

  if (!current || !today) {
    console.warn('Weather data not available. Skipping theme change.');
    return;
  }

  const condition = getWeatherCondition(current, today);
  const icon = conditionIconMap[condition] || clearDayGif;
  const background = conditionBackgroundMap[condition] || defaultBackground;

  // Set weather icon
  const iconEl = document.getElementById('weather-icon');
  if (iconEl) {
    iconEl.src = icon;
    iconEl.alt = current.conditions || condition;
  }

  // Set background style
  document.body.style.backgroundImage = `url("${background}")`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundAttachment = 'fixed';

  // Set day/night theme class
  document.body.classList.toggle('night-mode', condition.includes('night'));
}

// Export for use in other modules
const additionalInfoGifs = {
  humidity: humidityGif,
  'rain-chance': rainChanceGif,
  sunrise: sunriseGif,
  sunset: sunsetGif,
  'uv-index': uvIndexGif
};

export { changePageTheme, additionalInfoGifs };
