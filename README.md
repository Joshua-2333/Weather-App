# Weather App

A sleek, responsive weather forecast web application built with HTML, CSS, and JavaScript. It uses the [Visual Crossing Weather API](https://www.visualcrossing.com/weather-api) to display real-time weather conditions, hourly forecasts, 7-day forecasts, and additional details such as humidity, UV index, sunrise, and sunset.

## Features

-Search weather by city name, country, or coordinates
-Dynamic theme: auto day/night background and styling
-Current temperature, feels like, wind speed, and weather description
-12-hour scrollable hourly forecast with icons
-7-day forecast with high/low and feels-like temps
-Extra forecast section: Rain % | UV Index | Humidity | Sunrise | Sunset
-Unit toggles for temperature (°F/°C) and wind speed (mph/km/h)
-Manual refresh button with "Last Updated" timestamp
-Animated loading skeletons and icon hover effects
-Responsive layout with a collapsible hourly drawer on mobile

## Visuals

- Custom animated weather GIFs stored in `/gifs`
- Backgrounds change based on weather condition and time of day, stored in `/images`

## Tech Stack

- HTML5
- CSS3 (responsive, flexbox-based layout, transitions)
- JavaScript (ES6+)
- Webpack (for bundling assets and modules)

## Installation & Usage

```bash
# Clone the repo
git clone https://github.com/josh2333/Weather-App.git
cd Weather-App

# Install dependencies
npm install

# Start local development server
npm start

# Build for production
npm run build
