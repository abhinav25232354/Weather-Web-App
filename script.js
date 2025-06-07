const apiKey = "1ac5fe9217d14f20bca64622231311"; // <-- Replace with your WeatherAPI key

const videoMap = [
    { keywords: ["sunny", "clear"], src: "videos/sunny.mp4" },
    { keywords: ["cloud", "overcast"], src: "videos/cloudy.mp4" },
    { keywords: ["rain", "drizzle", "shower"], src: "videos/rainy.mp4" },
    { keywords: ["snow", "ice", "sleet", "blizzard"], src: "videos/snowy.mp4" },
    { keywords: ["thunder", "storm"], src: "videos/thunder.mp4" },
    // fallback
    { keywords: [], src: "videos/default.mp4" }
];

function setBackgroundVideo(conditionText) {
    const bgVideo = document.getElementById("bgVideo");
    let found = videoMap.find(v => v.keywords.some(k => conditionText.toLowerCase().includes(k)));
    if (!found) found = videoMap[videoMap.length - 1];
    const newSrc = found.src;
    const source = bgVideo.querySelector("source");
    if (!source.src.endsWith(newSrc)) {
        bgVideo.classList.add("fade-out");
        bgVideo.addEventListener("transitionend", function handler() {
            source.src = newSrc;
            bgVideo.load();
            bgVideo.classList.remove("fade-out");
            bgVideo.classList.add("fade-in");
            setTimeout(() => bgVideo.classList.remove("fade-in"), 600);
            bgVideo.removeEventListener("transitionend", handler);
        });
    }
}

async function getWeather(e) {
    if (e) e.preventDefault();
    const city = document.getElementById("cityInput").value.trim();
    if (!city) return;
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=yes`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("City not found");
        const data = await res.json();
        // Defensive: fallback for missing fields
        const c = data.current || {};
        const l = data.location || {};
        const cond = (c.condition && c.condition.text) ? c.condition.text : "-";
        // Fill all details
        document.getElementById("weatherCard").style.display = "flex";
        document.getElementById("location").textContent = `${l.name || "-"}, ${l.country || "-"}`;
        document.getElementById("icon").src = c.condition && c.condition.icon ? "https:" + c.condition.icon : "";
        document.getElementById("icon").alt = cond;
        document.getElementById("temp").textContent = c.temp_c !== undefined ? Math.round(c.temp_c) : "-";
        document.getElementById("desc").textContent = cond;
        document.getElementById("feelslike").textContent = c.feelslike_c !== undefined ? `${Math.round(c.feelslike_c)}°C` : "-";
        document.getElementById("humidity").textContent = c.humidity !== undefined ? `${c.humidity}%` : "-";
        document.getElementById("wind").textContent = c.wind_kph !== undefined ? `${c.wind_kph} km/h` : "-";
        document.getElementById("uv").textContent = c.uv !== undefined ? c.uv : "-";
        document.getElementById("pressure").textContent = c.pressure_mb !== undefined ? `${c.pressure_mb} mb` : "-";
        document.getElementById("vis").textContent = c.vis_km !== undefined ? `${c.vis_km} km` : "-";
        document.getElementById("cloud").textContent = c.cloud !== undefined ? `${c.cloud}%` : "-";
        document.getElementById("gust").textContent = c.gust_kph !== undefined ? `${c.gust_kph} km/h` : "-";
        document.getElementById("precip").textContent = c.precip_mm !== undefined ? `${c.precip_mm} mm` : "-";
        document.getElementById("dewpoint").textContent = c.dewpoint_c !== undefined ? `${c.dewpoint_c}°C` : "-";
        document.getElementById("updated").textContent = c.last_updated || "-";
        document.getElementById("winddir").textContent = c.wind_dir || "-";
        document.getElementById("winddegree").textContent = c.wind_degree !== undefined ? c.wind_degree : "-";
        document.getElementById("pressure_in").textContent = c.pressure_in !== undefined ? `${c.pressure_in} in` : "-";
        document.getElementById("precip_in").textContent = c.precip_in !== undefined ? `${c.precip_in} in` : "-";
        document.getElementById("feelslike_f").textContent = c.feelslike_f !== undefined ? `${Math.round(c.feelslike_f)}°F` : "-";
        document.getElementById("temp_f").textContent = c.temp_f !== undefined ? `${Math.round(c.temp_f)}°F` : "-";
        document.getElementById("is_day").textContent = c.is_day !== undefined ? (c.is_day ? "Yes" : "No") : "-";
        document.getElementById("cond_code").textContent = c.condition && c.condition.code !== undefined ? c.condition.code : "-";
        document.getElementById("country").textContent = l.country || "-";
        setBackgroundVideo(cond);
    } catch (err) {
        // Show a friendly message, but never break the UI
        document.getElementById("weatherCard").style.display = "none";
        alert("City not found. Please try another location.");
    }
}

// Optionally, show a default city on load
window.onload = () => {
    document.getElementById("cityInput").value = "San Francisco";
    getWeather();
};