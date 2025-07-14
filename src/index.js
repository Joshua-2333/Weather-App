//index.js
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
let didFetchOnLoad = false;

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

window.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth > 600) {
    hourlyDrawer?.classList.add('open');
  }

  setCurrentDate();

  // Load default weather for Tokyo if geolocation doesn't run first
  if (!didFetchOnLoad) {
    const fallback = 'Tokyo, Japan';
    locationInput.value = fallback;
    currentLocation = fallback;
    locationForm.dispatchEvent(new Event('submit', { bubbles: true }));
    didFetchOnLoad = true;
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

function showLoader() {
  loader.classList.add('visible');
}

function hideLoader() {
  loader.classList.remove('visible');
}

locationForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const location = locationInput.value.trim();
  if (!location) return;

  submitBtn.disabled = true;
  showLoader();
  errorMessage.textContent = '';

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

    if (window.innerWidth <= 768) {
      openDrawer();
    }

    locationForm.dispatchEvent(new Event('weather-updated'));
  } catch (err) {
    console.error('Fetch error:', err);
    errorMessage.textContent = `Unable to get weather for "${location}". Please try a specific city or region.`;
  } finally {
    hideLoader();
    setTimeout(() => {
      submitBtn.disabled = false;
    }, 1000);
  }
});

function refreshWeather() {
  if (!cachedWeatherData) return Promise.resolve();

  displayWeatherData(cachedWeatherData, {
    temperatureUnit,
    windSpeedUnit
  });

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

// Refresh button logic with loader animation
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

// Geolocation on load
navigator.geolocation?.getCurrentPosition(
  async ({ coords: { latitude, longitude } }) => {
    const loc = `${latitude},${longitude}`;
    locationInput.value = loc;
    currentLocation = loc;
    didFetchOnLoad = true;
    locationForm.dispatchEvent(new Event('submit', { bubbles: true }));
  },
  () => {
    if (!didFetchOnLoad) {
      const fallback = 'Tokyo, Japan';
      locationInput.value = fallback;
      currentLocation = fallback;
      locationForm.dispatchEvent(new Event('submit', { bubbles: true }));
      didFetchOnLoad = true;
    }
  }
);

