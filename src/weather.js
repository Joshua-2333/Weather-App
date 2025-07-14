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

  const {
    temp = null,
    feelslike = null,
    windspeed = null,
    windSpeed = null,
    humidity = null,
    uvindex = null,
    precipprob = null,
    conditions = 'Unavailable',
    icon = null
  } = data.currentConditions;

  const {
    sunrise = null,
    sunset = null
  } = data.days[0];

  return {
    temperature: temp,
    feelsLike: feelslike,
    windSpeed: windspeed ?? windSpeed,
    humidity,
    uvIndex: uvindex,
    rainChance: precipprob,
    conditions,
    icon,
    sunrise,
    sunset
  };
}

export { processWeatherData };
