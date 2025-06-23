// Weather code mappings
const weatherCodes = {
    "0": "Clear", "1": "Clear", "2": "Cloudy", "3": "Cloudy", "45": "Fog",
    "51": "Drizzle", "53": "Drizzle", "61": "Rain", "63": "Rain", "65": "Heavy Rain",
    "71": "Snow", "73": "Snow", "75": "Heavy Snow", "80": "Rain", "95": "Thunderstorm"
};

// Load default weather on page load
window.onload = function() {
    getWeather();
};

// Allow Enter key to trigger search
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cityInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getWeather();
        }
    });
});

async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    const result = document.getElementById('result');
    
    if (!city) {
        result.innerHTML = 'Please enter a city name';
        return;
    }
    
    result.innerHTML = 'Loading...';
    
    try {
        // Get coordinates for the city
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            result.innerHTML = 'City not found';
            return;
        }
        
        const lat = geoData.results[0].latitude;
        const lon = geoData.results[0].longitude;
        const cityName = geoData.results[0].name;
        
        // Get weather data
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`);
        const weatherData = await weatherResponse.json();
        
        const temp = Math.round(weatherData.current.temperature_2m);
        const weatherCode = weatherData.current.weather_code;
        const condition = weatherCodes[weatherCode] || 'Unknown';
        
        result.innerHTML = `
            <strong>${cityName}</strong><br>
            ${temp}°C<br>
            ${condition}
        `;
        
    } catch (error) {
        result.innerHTML = 'Error getting weather';
    }
}