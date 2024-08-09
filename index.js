const apiKey = 'Your API key goes here';
const searchBtn = document.getElementById("search");

searchBtn.onclick = (event) => {
          event.preventDefault();
          search();
};


document.addEventListener('DOMContentLoaded', () => {
    initializeWeather('Cairo');
});

async function search() {
    try {
        const userInput = document.getElementById("userInput");
        const input = userInput.value;
        const url = createUrl(input);
        const data = await fetchData(url);
        const extractedData = extractWeatherData(data);
        manipulateDom(extractedData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function createUrl(city) {
    return `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
}

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function extractWeatherData(data) {
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
    }
}
