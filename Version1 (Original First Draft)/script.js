const apiKey = "1ac5fe9217d14f20bca64622231311"; // Replace with your WeatherAPI key

function getDayName(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getWeather(e) {
    if (e) e.preventDefault();
    const city = document.getElementById("cityInput").value.trim();
    if (!city) return;

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=4&aqi=no&alerts=no`;

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("City not found");
            return res.json();
        })
        .then(data => {
            // Main info
            const location = `${data.location.name}, ${data.location.country}`;
            const dateObj = new Date(data.location.localtime.replace(' ', 'T'));
            const day = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
            const dateStr = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });

            document.getElementById("day").textContent = day;
            document.getElementById("date").textContent = dateStr;
            document.getElementById("location").innerHTML = `<span class="material-icons">location_on</span> ${location}`;
            document.getElementById("main-icon").src = "https:" + data.current.condition.icon;
            document.getElementById("temperature").textContent = Math.round(data.current.temp_c);
            document.getElementById("description").textContent = data.current.condition.text;
            document.getElementById("precipitation").textContent = (data.current.precip_mm || 0) + " mm";
            document.getElementById("humidity").textContent = data.current.humidity + " %";
            document.getElementById("wind").textContent = data.current.wind_kph + " km/h";

            // Forecast
            const forecastDiv = document.getElementById("forecast");
            forecastDiv.innerHTML = "";
            data.forecast.forecastday.forEach((f, idx) => {
                if (idx === 0) return; // skip today
                forecastDiv.innerHTML += `
                    <div class="forecast-day">
                        <img src="https:${f.day.condition.icon}" alt="${f.day.condition.text}">
                        <div class="day-label">${getDayName(f.date)}</div>
                        <div class="temp-label">${Math.round(f.day.maxtemp_c)}°C</div>
                    </div>
                `;
            });
        })
        .catch(() => {
            alert("City not found or API error.");
        });
}

// Optionally, load a default city on page load
window.onload = () => {
    document.getElementById("cityInput").value = "Paris";
    getWeather();
};