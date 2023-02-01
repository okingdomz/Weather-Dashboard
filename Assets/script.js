

var WeatherApiKey = '1ac2966e65ae6ffb0471314f5077b9b0';
var openWeatherUrl = 'http://api.openweathermap.org/data/2.5/onecall?q=';
var OneCallUrl = 'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={1ac2966e65ae6ffb0471314f5077b9b0}';
var userFormEL = $('#city-search');
var col2El = $('.col2');
var cityInputEl = $('#city');
var fiveDayEl = $('#five-day');
var searchHistoryEl = $('#search-history');
var currentDay = moment().format('M/DD/YYYY');
const weatherIcon = 'http://openweathermap.org/img/wn/';
var searchHistoryGroup = localSearchHistory();






// capitalize first string letter for input

function titleSet(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}

function localSearchHistory() {
    var searchHistoryGroup = JSON.parse(localStorage.getItem('search history'));
    if (!searchHistoryGroup) {
        searchHistoryGroup = {
            searchedCity: [],
        };
    } else {
        for (var i = 0; i < searchHistoryGroup.searchedCity.length; i++) {
            searchHistory(searchHistoryGroup.searchedCity[i]);
        }
    }
    return searchHistoryGroup;
}

// local storage 
function SavingSearchHistory() {
    localStorage.setItem('search history', JSON.stringify(searchHistoryGroup));
};

// history buttons
function searchHistory(city) {
    var searchHistoryBtn = $('<button>')
    .addClass('btn')
    .text(city)
    .on('click', function () {
        $('#current-weather').remove();
        $('#five-day-header').remove();
        $('#five-day').empty();
        getWeather(city);
    })
    .attr({
        type: 'button'
    });
    searchHistoryEl.append(searchHistoryBtn);
}

// api to weather data
function getWeather(city) {
    var apiCoordinatesLink = openWeatherUrl + city + '&appid' + WeatherApiKey;
    fetch(apiCoordinatesLink)
    .then(function (coordinateResponse) {
        if (coordinateResponse.ok) {
            coordinateResponse.json().then(function (data) {
                var cityLatitude = data.coord.lat;
                var cityLongitude = data.coord.lon;
                var apiOneCallLink = oneCallUrl + cityLatitude + '&lon' + cityLongitude + '&appid' + WeatherApiKey + '&units=imperial';
                fetch(apiOneCallLink)
                .then(function (weatherResponse) {
                    if (weatherResponse.ok) {
                        weatherResponse.JSON().then(function (weatherData) {
                            var currentweatherEl = $('<div>')
                            .attr({
                                id: 'current-weather'
                            })
                            var weatherIcon = weatherData.current.weather[0].icon;
                            var cityCurrentWeatherIcon = weatherIcon + '.png';
                            var currentWeatherHeadingEl = $('<h2>')
                            .text(city + ' (' + currentDay + ')');
                            var iconImgEl = $('<img>')
                            .attr({
                                id: 'current-weather-icon',
                                src: cityCurrentWeatherIcon,
                                alt: 'Weather Icon'
                            })
                            var currentWeatherListEl = $('<ul>')
                            var currentWeatherDetails = ['Temp: ' + weatherData.current.temp + 'Fahrenheit', 'Wind: ' + weatherData.currentwind_speed + ' MPH', ' Humidity: ' + weatherData.current.humidity + '%', 'UV Index: ' + weatherData.current.uvi]

                            for (var i = 0; i < currentWeatherDetails.length; i ++) {
                                if (currentWeatherDetails[i] === 'UV Index: ' + weatherData.current.uvi) {
                                    var currentWeatherListItem = $('<li>')
                                    .text('UV Index: ')

                                    currentWeatherListEl.append(currentWeatherListItem);
                                
                                    var uviItem = $('<span>')
                                    .text(weatherData.current.uvi);

                                    if (uviItem.text() <= 2) {
                                        uviItem.addClass('favorable');
                                    } else if (uviItem.text() > 2 && uviItem.text() <= 7) {
                                        uviItem.addClass('moderate');
                                    } else {
                                        uviItem.addClass('bad');
                                    }
                                    currentWeatherListItem.append(uviItem);
                                } else {
                                    var currentWeatherListItem = $('<li>')
                                    .text(currentWeatherDetails[i])
                                    currentweatherEl.append(currentWeatherListItem);
                                }
                            }

                            // appending current weather to col2

                            $('#five-day').before(currentweatherEl);
                            currentweatherEl.append(currentWeatherHeadingEl);
                            currentweatherEl.append(currentWeatherListEl);
                            currentWeatherHeadingEl.append(iconImgEl);
                        })
                        // five day display forecast
                        var fiveDayHeaderEl = $('<h2>')
                        .text('5-day Forecast:')
                        .attr({
                            id: 'five-day-header'
                        })

                        // append to header on col2
                        $('current-weather').after(fiveDayHeaderEl)

                        // array for 5 days ahead
                        var fiveDayGroup = [];

                        for (var i = 0; i < 5; i++) {
                            let forecastDate = moment().add(i + 1, 'days').format('M/DD/YYYY');

                            fiveDayGroup.push(forecastDate);
                        }
// div for each card body and array of each card to include properties of weather
                        for (var i = 0; i < fiveDayGroup.length; i++) {
                            var cardDivEl = $('<div>')
                            .addClass('col3');
// div for card body
                            var cardBodyDivEl = $('<div>')
                            .addClass('card-body');
// card title
                            var cardTitleEl = $('<h3>')
                            .addClass('card-title')
                            .text(fiveDayGroup[i]);

                            // icon for day weather

                            var forecastIcon = weatherData.daily[i].weather[0].icon;

                            var forecastIconEl = $('<img>')
                            .attr({
                                src: weatherIcon + forecastIcon + '.png',
                                alt: 'Weather Icon'
                            });

                            // card details
                            var currentWeatherDetails = ['Temp: ' + weatherData.current.temp + ' Fahrenheit', 'Wind: ' + weatherData.current.wind_speed + ' MPH', 'Humidity: ' + weatherData.current.humidity + '%', 'UV Index: ' + weatherData.current.uvi]
                            // creating temperature variable
                            var tempEl = $('<p>')
                            .addClass('card-text')
                            .text('Temp: ' + weatherData.daily[i].temp.max)
                            // creating humidity variable
                            var humidityEl = $('<p>')
                            .addClass('card-text')
                            .text('Humidity: ' + weatherData.daily[i].humidity + '%')
                            // wind variable
                            var windEl = $('<p>')
                            .addClass('card-text')
                            .text('Wind: ' + weatherData.daily[i].wind_speed + 'MPH')


                            // appending card di elements to the 5 day card container

                            fiveDayEl.append(cardDivEl);
                            cardDivEl.append(cardBodyDivEl);
                            cardBodyDivEl.append(cardTitleEl);
                            cardBodyDivEl.append(forecastIconEl);
                            cardBodyDivEl.append(tempEl);
                            cardBodyDivEl.append(windEl);
                            cardBodyDivEl.append(humidityEl);
                        }
                        // appends above
                    }
                })
            });
        } else {
            alert('Could not find city')
        }
    })
    .catch(function (error) {
        alert('cannot connect to open weather api');
    });
}

// search button

function submitCitySearch(event) {
    event.preventDefault();

    var city = titleSet(cityInputEl.val().trim());

    // prevents them from collecting info from cities in the localstorage
    if (searchHistoryGroup.searchedCity.includes(city)) {
        alert(city + ' shown below. Click the ' + city + ' button to collect weather.');
        cityInputEl.val('');
    } else if (city) {
        getWeather(city);
        searchHistory(city);
        searchHistoryGroup.searchedCity.push(city);
        saveSearchHistory();

        cityInputEl.val('');
    } else {
        alert(' Enter city below ');
    }
}

// button function to collect city in input area

userFormEL.on('submit', submitCitySearch);

$('#search-btn').on('click', function () {
    $('#current-weather').remove();
    $('#five-day-header').remove();
    $('#five-day').empty();
    

})