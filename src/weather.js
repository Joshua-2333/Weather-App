//weather.js
function processWeatherData(data) {
  if (
    !data ||
    typeof data !== 'object' ||
    !data.currentConditions ||
    !Array.isArray(data.days) ||
    data.days.length === 0
  ) {
    console.warn('⚠️ Invalid or incomplete weather data:', data);
    return defaultWeatherData();
  }

  const current = data.currentConditions;
  const today = data.days[0];

  return {
    temperature: current.temp ?? null,
    feelsLike: current.feelslike ?? null,
    windSpeed: current.windspeed ?? current.windSpeed ?? null,
    humidity: current.humidity ?? null,
    uvIndex: current.uvindex ?? current.uvIndex ?? null,
    rainChance: current.precipprob ?? current.precipProbability ?? null,
    conditions: current.conditions || 'Unavailable',
    icon: current.icon ?? null,
    sunrise: today.sunrise ?? null,
    sunset: today.sunset ?? null
  };
}

function defaultWeatherData() {
  return {
    temperature: null,
    feelsLike: null,
    windSpeed: null,
    humidity: null,
    uvIndex: null,
    rainChance: null,
    conditions: 'Unavailable',
    icon: null,
    sunrise: null,
    sunset: null
  };
}

export { processWeatherData };
