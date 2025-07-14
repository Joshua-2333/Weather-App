import "./styles.css";
import { getWeatherData } from './api.js';
import { displayWeatherData } from './ui.js';
import { changePageTheme } from './changePageTheme.js';

const temperatureButtons = document.querySelectorAll('.temp-toggle button');
const windSpeedButtons = document.querySelectorAll('.wind-toggle button');
const locationForm = document.getElementById('location-form');
const submitBtn = document.getElementById('submit-btn');
const locationInput = document.getElementById('location-input');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
const hourlyDrawer = document.getElementById('hourly-forecast-drawer');
const hourlyToggleTitle = document.getElementById('hourly-toggle-title');
const currentDateEl = document.getElementById('current-date');
const refreshBtn = document.getElementById('refresh-btn');

let temperatureUnit = 'F';
let windSpeedUnit = 'mph';
let currentLocation = '';
let cachedWeatherData = null;
let hasFetchedWeather = false;

function setCurrentDate() {
  if (currentDateEl) {
    const now = new Date();
    const formatted = now.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    currentDateEl.textContent = formatted;
  }
}

function showLoader() {
  loader.classList.add('visible');
}

function hideLoader() {
  loader.classList.remove('visible');
}

async function loadWeatherFor(location) {
  if (!location || hasFetchedWeather) return;

  showLoader();
  errorMessage.textContent = '';
  submitBtn.disabled = true;
  locationInput.value = location;

  try {
    const data = await getWeatherData(location);

    if (!data || !data.resolvedAddress) {
      throw new Error('Invalid location');
    }

    cachedWeatherData = data;
    displayWeatherData(data, { temperatureUnit, windSpeedUnit });
    changePageTheme(data);
    setCurrentDate();

    currentLocation = location;
    hasFetchedWeather = true;

    if (window.innerWidth <= 768) {
      openDrawer();
    }
  } catch (err) {
    console.error('Fetch error:', err);
    errorMessage.textContent = `Unable to get weather for "${location}". Please try a specific city or region.`;
  } finally {
    hideLoader();
    setTimeout(() => {
      submitBtn.disabled = false;
    }, 1000);
  }
}

async function tryGeolocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve(`${coords.latitude},${coords.longitude}`),
      () => reject('Permission denied or unavailable')
    );
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  if (window.innerWidth > 600) {
    hourlyDrawer?.classList.add('open');
  }

  setCurrentDate();

  try {
    const geoLocation = await tryGeolocation();
    await loadWeatherFor(geoLocation);
  } catch {
    // Fallback only if not already fetched
    if (!hasFetchedWeather) {
      await loadWeatherFor('Tokyo, Japan');
    }
  }
});

temperatureButtons.forEach((button) => {
  button.addEventListener('click', () => {
    temperatureButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    temperatureUnit = button.textContent.includes('F') ? 'F' : 'C';
    refreshWeather();
  });
});

windSpeedButtons.forEach((button) => {
  button.addEventListener('click', () => {
    windSpeedButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    windSpeedUnit = button.textContent.includes('mph') ? 'mph' : 'kmh';
    refreshWeather();
  });
});

locationForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const location = locationInput.value.trim();
  if (location) {
    hasFetchedWeather = false; // allow new fetch
    loadWeatherFor(location);
  }
});

function refreshWeather() {
  if (!cachedWeatherData) return Promise.resolve();
  displayWeatherData(cachedWeatherData, { temperatureUnit, windSpeedUnit });
  return Promise.resolve();
}

window.refreshWeather = refreshWeather;

function toggleDrawer() {
  if (window.innerWidth <= 768) {
    hourlyDrawer?.classList.toggle('open');
  }
}

function openDrawer() {
  if (window.innerWidth <= 768) {
    hourlyDrawer?.classList.add('open');
  }
}

hourlyToggleTitle?.addEventListener('click', toggleDrawer);

if (refreshBtn && typeof window.refreshWeather === 'function') {
  refreshBtn.addEventListener('click', () => {
    refreshBtn.disabled = true;
    refreshBtn.textContent = '⏳';
    showLoader();
    window.refreshWeather().finally(() => {
      setTimeout(() => {
        refreshBtn.disabled = false;
        refreshBtn.textContent = '🔄';
        hideLoader();
      }, 600);
    });
  });
}
