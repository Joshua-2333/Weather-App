// ui.js

// Import required GIFs for extra forecast
import rainChanceGif from '/gifs/rain-chance.gif';
import uvIndexGif from '/gifs/uv-index.gif';
import humidityGif from '/gifs/humidity.gif';
import sunriseGif from '/gifs/sunrise.gif';
import sunsetGif from '/gifs/sunset.gif';

// Import all available condition GIFs
import clearDayGif from '/gifs/clear-day.gif';
import clearNightGif from '/gifs/clear-night.gif';
import thunderShowersDay from '/gifs/thunder-showers-day.gif';
import thunderShowersNight from '/gifs/thunder-showers-night.gif';
import rainDay from '/gifs/rain-day.gif';
import rainNight from '/gifs/rain-night.gif';
import snowDay from '/gifs/snow-day.gif';
import snowNight from '/gifs/snow-night.gif';
import sleetDay from '/gifs/rain-snow-showers-day.gif';
import sleetNight from '/gifs/rain-snow-showers-night.gif';
import windGif from '/gifs/windy.gif';
import fogGif from '/gifs/fog.gif';
import hailGif from '/gifs/hail.gif';
import tornadoGif from '/gifs/tornado.gif';
import partlyCloudyDayGif from '/gifs/partly-cloudy-day.gif';
import partlyCloudyNightGif from '/gifs/partly-cloudy-night.gif';
import cloudyGif from '/gifs/cloudy.gif';

const temperatureElement = document.getElementById('temperature-value');
const feelsLikeElement = document.getElementById('feels-like-value');
const windSpeedElement = document.getElementById('wind-speed-value');
const descriptionElement = document.getElementById('weather-description');
const iconElement = document.getElementById('weather-icon');
const hourlyForecastElement = document.getElementById('hourly-forecast');
const dailyForecastElement = document.getElementById('daily-forecast');
const extraForecastElement = document.getElementById('extra-forecast');
const lastUpdatedElement = document.getElementById('last-updated');
const locationNameElement = document.getElementById('location-name');
const highTempElement = document.getElementById('high-temp-value');
const lowTempElement = document.getElementById('low-temp-value');
const hourlyDrawer = document.getElementById('hourly-drawer');
const refreshButton = document.getElementById('refresh-btn');

const iconMap = {
  'clear-day': clearDayGif,
  'clear-night': clearNightGif,
  'partly-cloudy-day': partlyCloudyDayGif,
  'partly-cloudy-night': partlyCloudyNightGif,
  'cloudy': cloudyGif,
  'rain': rainDay,
  'rain-day': rainDay,
  'rain-night': rainNight,
  'snow': snowDay,
  'snow-day': snowDay,
  'snow-night': snowNight,
  'sleet': sleetDay,
  'sleet-day': sleetDay,
  'sleet-night': sleetNight,
  'wind': windGif,
  'windy': windGif,
  'fog': fogGif,
  'hail': hailGif,
  'tornado': tornadoGif,
  'thunder-showers-day': thunderShowersDay,
  'thunder-showers-night': thunderShowersNight
};

function getIconUrl(icon) {
  const safe = icon?.toLowerCase();
  return iconMap[safe] || null;
}

function displayWeatherData(data, unitOptions = { temperatureUnit: 'F', windSpeedUnit: 'mph' }) {
  if (!data?.currentConditions) return;

  [hourlyForecastElement, dailyForecastElement, extraForecastElement].forEach(el => {
    if (el) {
      el.innerHTML = `<div class="skeleton-loader"></div>`;
    }
  });

  setTimeout(() => {
    [hourlyForecastElement, dailyForecastElement, extraForecastElement].forEach(el => {
      if (el) el.innerHTML = '';
    });

    updateLocationName(data.resolvedAddress);
    const current = data.currentConditions;
    const today = data.days?.[0] || {};
    const { temperatureUnit, windSpeedUnit } = unitOptions;

    animateTempChange(temperatureElement, formatTemp(current.temp, temperatureUnit));
    feelsLikeElement.textContent = `Feels Like: ${formatTemp(current.feelslike, temperatureUnit)}`;
    windSpeedElement.textContent = `Wind Speed: ${formatWind(current.windspeed, windSpeedUnit)}`;
    descriptionElement.textContent = current.conditions ?? 'N/A';
    highTempElement.textContent = formatTemp(today.tempmax, temperatureUnit);
    lowTempElement.textContent = formatTemp(today.tempmin, temperatureUnit);

    const iconUrl = getIconUrl(current.icon);
    if (iconUrl) {
      iconElement.src = iconUrl;
      iconElement.alt = current.conditions;
      iconElement.classList.add('weather-icon');
      iconElement.classList.toggle('severe-alert', /thunder|storm/i.test(current.conditions));
    } else {
      iconElement.removeAttribute('src');
      iconElement.alt = '';
      iconElement.classList.remove('weather-icon', 'severe-alert');
    }

    renderExtraForecast({
      rain: current.precipprob ?? current.precipProbability,
      uv: current.uvindex ?? current.uvIndex,
      humidity: current.humidity,
      sunrise: today.sunrise,
      sunset: today.sunset
    });

    renderHourlyForecast(today.hours, today.datetime, temperatureUnit);
    renderDailyForecast(data.days, temperatureUnit);
    updateLastUpdated();

    if (current.datetimeEpoch && today.sunriseEpoch && today.sunsetEpoch) {
      setDayNightTheme(current.datetimeEpoch, today.sunriseEpoch, today.sunsetEpoch);
    }
  }, 200);
}

function animateTempChange(el, newVal) {
  if (!el) return;
  el.classList.add('temp-animate');
  el.textContent = newVal;
  setTimeout(() => el.classList.remove('temp-animate'), 400);
}

function updateLocationName(resolvedAddress = '') {
  const parts = resolvedAddress.split(',').map(p => p.trim());
  const primary = parts[0] ?? '';
  const secondary = parts.find((p, i) => i > 0 && p && p !== primary) ?? '';
  locationNameElement.textContent = `${primary}${secondary ? ', ' + secondary : ''}`;
}

function formatTemp(temp, unit) {
  return typeof temp === 'number'
    ? unit === 'C'
      ? `${((temp - 32) * 5 / 9).toFixed(1)}°C`
      : `${temp.toFixed(1)}°F`
    : 'N/A';
}

function formatWind(wind, unit) {
  return typeof wind === 'number'
    ? unit === 'kmh'
      ? `${(wind * 1.60934).toFixed(1)} km/h`
      : `${wind.toFixed(1)} mph`
    : 'N/A';
}

function formatTime(timeStr) {
  if (!timeStr) return '--';
  const t = new Date(`1970-01-01T${timeStr}`);
  return isNaN(t) ? '--' : t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function updateLastUpdated() {
  const now = new Date();
  lastUpdatedElement.textContent = `Last updated: ${now.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })}`;
}

function renderExtraForecast(data) {
  if (!extraForecastElement) return;
  extraForecastElement.innerHTML = '';

  const extras = [
    { label: 'Rain', value: `${data.rain ?? '--'}%`, icon: rainChanceGif, alt: 'Rain chance' },
    { label: 'UV', value: `${data.uv ?? '--'}`, icon: uvIndexGif, alt: 'UV Index' },
    { label: 'Humidity', value: `${data.humidity ?? '--'}%`, icon: humidityGif, alt: 'Humidity' },
    { label: 'Sunrise', value: formatTime(data.sunrise), icon: sunriseGif, alt: 'Sunrise' },
    { label: 'Sunset', value: formatTime(data.sunset), icon: sunsetGif, alt: 'Sunset' }
  ];

  extras.forEach(({ label, value, icon, alt }) => {
    const div = document.createElement('div');
    div.className = 'forecast-item';
    div.innerHTML = `<p>${label}</p><p>${value}</p><img src="${icon}" alt="${alt}" />`;
    extraForecastElement.appendChild(div);
  });
}

function renderHourlyForecast(hours = [], dayStr = '', temperatureUnit = 'F') {
  if (!Array.isArray(hours) || !hourlyForecastElement) return;
  hourlyForecastElement.innerHTML = '';

  hours.slice(0, 12).forEach(hour => {
    const timeStr = new Date(`${dayStr}T${hour.datetime}`);
    const time = isNaN(timeStr) ? 'N/A' : timeStr.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const temp = formatTemp(hour.temp, temperatureUnit);
    const iconUrl = getIconUrl(hour.icon);
    const iconHTML = iconUrl ? `<img class="weather-icon" src="${iconUrl}" alt="${hour.conditions || 'Hourly'}" />` : '';

    const item = document.createElement('div');
    item.className = 'forecast-item';
    item.innerHTML = `<p>${time}</p><p>${temp}</p>${iconHTML}`;
    hourlyForecastElement.appendChild(item);
  });

  if (window.innerWidth <= 768 && hourlyDrawer) {
    hourlyDrawer.classList.add('open');
  }
}

function renderDailyForecast(days = [], temperatureUnit = 'F') {
  if (!dailyForecastElement) return;
  dailyForecastElement.innerHTML = '';

  days.slice(0, 7).forEach(day => {
    const dayName = new Date(day.datetime).toLocaleDateString(undefined, { weekday: 'short' });
    const high = formatTemp(day.tempmax, temperatureUnit);
    const low = formatTemp(day.tempmin, temperatureUnit);
    const feelsHigh = formatTemp(day.feelslikemax ?? day.feelslike, temperatureUnit);
    const feelsLow = formatTemp(day.feelslikemin ?? day.feelslike, temperatureUnit);
    const iconUrl = getIconUrl(day.icon);
    const iconHTML = iconUrl ? `<img class="weather-icon" src="${iconUrl}" alt="${day.conditions || 'Forecast'}" />` : '';

    const item = document.createElement('div');
    item.className = 'forecast-item';
    item.innerHTML = `
      <p>${dayName}</p>
      <p>↑${high} ↓${low}</p>
      <p>Feels ↑${feelsHigh} ↓${feelsLow}</p>
      ${iconHTML}
    `;
    dailyForecastElement.appendChild(item);
  });
}

function setDayNightTheme(currentEpoch, sunriseEpoch, sunsetEpoch) {
  const isDay = currentEpoch >= sunriseEpoch && currentEpoch < sunsetEpoch;
  document.body.classList.remove('day-mode', 'night-mode');
  document.body.classList.add(isDay ? 'day-mode' : 'night-mode');
}

if (refreshButton && typeof window.refreshWeather === 'function') {
  refreshButton.addEventListener('click', () => {
    refreshButton.disabled = true;
    refreshButton.textContent = '⏳';
    window.refreshWeather().finally(() => {
      refreshButton.disabled = false;
      refreshButton.textContent = '🔄';
    });
  });
}

export { displayWeatherData };