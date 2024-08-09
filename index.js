const apiKey = '02cf48b277d14d61a38133434240708';
const searchBtn = document.getElementById("search");

searchBtn.onclick = (event) => {
    event.preventDefault(); // Prevent form submission
    search();
};

// Initialize weather data for Cairo when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeWeather('Cairo');
});

async function search() {
    try {
        const userInput = document.getElementById("userInput");
        const input = userInput.value;
        if (!input.trim()) {
            throw new Error("Please enter a city name, latitude/longitude, or IP address.");
        }
        const url = createUrl(input);
        const data = await fetchData(url);
        const extractedData = extractWeatherData(data);
        manipulateDom(extractedData);
        hideErrorMessage(); // Hide error message if successful
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showErrorMessage(error.message);
    }
}

function createUrl(city) {
    return `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
}

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        if (response.status === 400) {
            throw new Error("Location not found. Please check your input and try again.");
        }
        throw new Error(`Failed to fetch weather data. Please try again later.`);
    }
    return await response.json();
}

function extractWeatherData(data) {
    if (!data.location || !data.current) {
        throw new Error("Invalid data received from the weather API.");
    }
    return {
        countryName: data.location.country,
        cityName: data.location.name,
        conditionText: data.current.condition.text,
        tempInCelsius: data.current.temp_c,
        conditionIcon: data.current.condition.icon,
        windSpeed: data.current.wind_kph,
        humidity: data.current.humidity,
        cloud: data.current.cloud,
    };
}

function manipulateDom(dataObj) {
    const location = document.getElementsByClassName("location")[0];
    const condition = document.getElementsByClassName("condition")[0];
    const temperature = document.getElementsByClassName("temperature")[0];
    const icon = document.getElementsByClassName("icon")[0];
    const cloud = document.getElementsByClassName("cloud-cover")[0];
    const humidity = document.getElementsByClassName("humidity")[0];
    const wind = document.getElementsByClassName("wind-speed")[0];

    location.innerHTML = `<i class="fa-solid fa-location-dot" aria-hidden="true"></i>${dataObj.countryName}, ${dataObj.cityName}`;
    condition.innerHTML = `${dataObj.conditionText}`;
    temperature.innerHTML = `${dataObj.tempInCelsius}°C`;
    icon.innerHTML = `<img src="${dataObj.conditionIcon}" alt="Weather Icon">`;
    cloud.innerHTML = `<i class="fa-solid fa-cloud" aria-hidden="true"></i>${dataObj.cloud}%`;
    humidity.innerHTML = `<i class="fa-solid fa-droplet" aria-hidden="true"></i>${dataObj.humidity}%`;
    wind.innerHTML = `<i class="fa-solid fa-wind" aria-hidden="true"></i>${dataObj.windSpeed} km/h`;
}

async function initializeWeather(city) {
    try {
        const url = createUrl(city);
        const data = await fetchData(url);
        const extractedData = extractWeatherData(data);
        manipulateDom(extractedData);
    } catch (error) {
        console.error('Error initializing weather data:', error);
        showErrorMessage("Failed to load initial weather data. Please try searching for a city.");
    }
}

function showErrorMessage(message) {
    const errorElement = document.getElementById("error-message");
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
    }
}

function hideErrorMessage() {
    const errorElement = document.getElementById("error-message");
    if (errorElement) {
        errorElement.style.display = "none";
    }
}
