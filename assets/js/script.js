var cities = JSON.parse(localStorage.getItem("cities"));
$(document).ready(function () {
    if (cities == null || !localStorage.getItem("cities")) {
        cities = [];
        console.log("No Search history found, setting first search query to Toronto");
        getWeather("Toronto");
    }
    else {
        for (let i = 0; i < cities.length; i++) {

            if ($(".btn-group-vertical").children("button").attr("id") === cities[i]) {
                return;
            } else {
                $(".btn-group-vertical").append($(`<button type="button" class="btn btn-secondary" id="${cities[i]}">${cities[i]}</button>`));
            }

        }
        getWeather(cities[cities.length - 1]);
    }
});

function getWeather(cityName) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=3e8aa64128a8b382a871af127be1e2d0&units=imperial&exclude=current,minutely,hourly`;

    $("#cityName").val("");

    if (cities.includes(cityName)) {
        console.log("City already exists in search history");
    }
    else {
        cities.push(cityName);
        var searchHistoryBtn = $(`<button type="button" class="btn btn-secondary id="${cityName}">${cityName}</button>`);
        $(".btn-group-vertical").append(searchHistoryBtn);
        localStorage.setItem("cities", JSON.stringify(cities));
    }

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    var cityLat = data.city.coord.lat;
                    var cityLong = data.city.coord.lon;

                    console.log(cityLat + "         " + cityLong);

                    var onecallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLong}&exclude=minutely,hourly,alerts&appid=3e8aa64128a8b382a871af127be1e2d0&units=imperial`;

                    fetch(onecallUrl)
                        .then(function (response) {
                            response.json().then(function (data) {
                                var currentTemp = data.current.temp;
                                var currentHumidity = data.current.humidity;
                                var currentWindSpeed = data.current.wind_speed;
                                var currentDate = moment.unix(data.current.dt).format("MM/DD/YYYY");
                                var currentUVIndex = data.current.uvi;
                                var currentWeatherIcon = data.current.weather[0].icon;
                                $(`#cityNameHeader`).html(`<h2>${cityName} (${currentDate}) <img src="https://openweathermap.org/img/w/${currentWeatherIcon}.png" /></h2>`);
                                $(`#cityTemp`).text(`${currentTemp}°F, ${Math.round((currentTemp - 32) / 1.8)}°C`);
                                $(`#cityHumidity`).text(`${currentHumidity} %`);
                                $(`#cityWindSpeed`).text(`${currentWindSpeed} MPH`);
                                $(`#cityUV`).text(`${currentUVIndex}`);

                                if (currentUVIndex < 3) {
                                    $(`#cityUV`).addClass("bg-success p-2 rounded text-white");
                                }
                                else if (currentUVIndex >= 3 && currentUVIndex <= 5) {
                                    $(`#cityUV`).addClass("bg-warning- p-2 rounded text-white");
                                }
                                else if (currentUVIndex >= 5 && currentUVIndex <= 7) {
                                    $(`#cityUV`).addClass("orangeClass p-2 rounded text-white");
                                }
                                else if (currentUVIndex >= 7 && currentUVIndex <= 10) {
                                    $(`#cityUV`).addClass("bg-danger p-2 rounded text-white");
                                }

                                // 5-day forecast
                                for (let i = 1; i <= 5; i++) {
                                    $(`#forecastDate${i}`).text(moment.unix(data.daily[i].dt).format("MM/DD/YYYY"));
                                    $(`#forecastImg${i}`).attr("src", `https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`);
                                    $(`#forecastTemp${i}`).text(data.daily[i].temp.day + "F");
                                    $(`#forecastHumidity${i}`).text(data.daily[i].humidity + "%");
                                }
                            });
                        })
                        .catch(function (error) {
                            console.log(error);
                            console.log("Unable to connect to OpenWeatherMap.com");
                            alert("Unable to connect to OpenWeatherMap.com");
                        });
                })
            }
            else {
                console.log(`Error: ${response.statusText}`);
                alert(`Error: ${response.statusText}`);
                return;
            };
        })
        .catch(function (error) {
            console.log(error);
            console.log("Unable to connect to OpenWeatherMap.com");
            alert("Unable to connect to OpenWeatherMap.com");
        });
}


$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    var cityName = $("#cityName").val().trim();
    if (cityName) {
        getWeather(cityName);
    }
    else {
        return;
    }
});

$("#delete-btn").on("click", function () {
    cities = [];
    localStorage.removeItem("cities");
    $(".btn-group-vertical").empty();
});

$(document).on("click", ".btn-secondary", function (event) {
    getWeather(event.target.innerText);
});



/* TO-DO
- Add error handling for bad response
*/