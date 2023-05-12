// creating hooks for all my elements
var apiKey = '3ab0802207811f72f24c99648e7b65db'
var cityPanel = document.querySelector('#cityPanel')
var currentDate = document.querySelector('#currentDate');
var currentEmojii = document.querySelector('#currentEmojii');
var cityName = document.querySelector('#cityName')
var currentTemp = document.querySelector('#currentTemp');
var currentWind = document.querySelector('#currentWind');
var currentHumidity = document.querySelector('#currentHumidity');
var buttons = document.querySelector('#buttons')
var searchBtn = document.querySelector('#search')
var inputEl = document.querySelector('input')
var futureData = document.querySelectorAll('.weatherCard');

// setting history array and getting info out of local storage
var cityHistory = []
cityHistory = localStorage.getItem('cityHistory');
cityHistory = JSON.parse(cityHistory)
if(cityHistory == null) cityHistory = ["Lansing"]
console.log(cityHistory)

// setting current day
var currentDay = dayjs()
currentDate.textContent = dayjs(currentDay).format('(MM/DD/YYYY)');

// creating buttons for history
for(let i=0;i<cityHistory.length;i++) {
    buttons.appendChild(document.createElement("button"));
    buttons.children[i].setAttribute('class', 'cityBtn')
    buttons.children[i].textContent = cityHistory[i]
}

// runnning the main function
load()

// gets latitude and longetude from city name
function load() {
    let geoLocation = 'http://api.openweathermap.org/geo/1.0/direct?q='+inputEl.value+'&limit=1&appid='+apiKey;   

    if (inputEl.value.trim()  == '') {
        geoLocation = 'http://api.openweathermap.org/geo/1.0/direct?q='+buttons.children[0].textContent+'&limit=1&appid='+apiKey;
    }

    fetch(geoLocation)
    .then(response => response.json())
    .then(function(response) {
        getWeather(response[0].name, response[0].lat, response[0].lon)
    }) 
}

// sets weather information for the next 6 days takes lat and lon
function getWeather(name, lat, lon) {
    cityName.textContent = name
    let weather = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+apiKey
    fetch(weather)
    .then(response => response.json())
    .then(function(response) {
        // setting current day information
        currentEmojii.setAttribute('src', 'https://openweathermap.org/img/w/'+response.list[0].weather[0].icon+'.png')
        let tempTemp = response.list[0].main.temp;
        currentTemp.textContent = ((tempTemp-273.15)*9/5+32).toFixed(2);
        let tempWind = response.list[0].wind.speed;
        currentWind.textContent = tempWind + " MPH";
        let tempHumidity = response.list[0].main.humidity;
        currentHumidity.textContent = tempHumidity + "%";
        console.log(response.list[0])
        
        let day = -1;
        for(let i=0;i<futureData.length;i++) {
            // setting future days information
            day = day + 8;
            futureData[i].children[0].textContent = dayjs(response.list[day].dt * 1000).format('MM/DD/YYYY');
            futureData[i].children[1].setAttribute('src', 'https://openweathermap.org/img/w/'+response.list[day].weather[0].icon+'.png')
            let tempTemp = response.list[day].main.temp;
            futureData[i].children[2].children[0].textContent = ((tempTemp-273.15)*9/5+32).toFixed(2);
            let tempWind = response.list[day].wind.speed;
            futureData[i].children[3].children[0].textContent = tempWind + " MPH";
            let tempHumidity = response.list[day].main.humidity;
            futureData[i].children[4].children[0].textContent = tempHumidity + "%";
        }

        // clearing input and setting localstorage history
        inputEl.value = '';
        setLocalStorage()
    })

}

// sets local storage to an array with the last 10 searches
// puts latest search at the front
function setLocalStorage() {
    cityHistory.reverse()
    for(let i=0;i<cityHistory.length;i++) {
        if(cityName.textContent.toLowerCase() == cityHistory[i].toLowerCase()) {
            let tempFirstHalf = cityHistory.slice(0, i);
            let tempSecondHalf = cityHistory.slice(i+1);
            cityHistory = tempFirstHalf.concat(tempSecondHalf);
        }
    }
    cityHistory.push(cityName.textContent);
    if(cityHistory.length > 10)cityHistory = cityHistory.slice(1)   
    cityHistory.reverse();

    let listLen = buttons.children.length;
    for(let i=0;i<listLen;i++) {
        buttons.children[0].remove();
    }
    for(let i=0;i<cityHistory.length;i++) {
        buttons.appendChild(document.createElement("button"));
        buttons.children[i].setAttribute('class', 'cityBtn')
        buttons.children[i].textContent = cityHistory[i]
    }

    let cityHistoryString = JSON.stringify(cityHistory)
    localStorage.setItem('cityHistory', cityHistoryString)
}

// listeners for buttons
searchBtn.addEventListener('click', load)

buttons.addEventListener('click', function(event) {
    if(event.target.className == 'cityBtn') {
        inputEl.value = event.target.textContent
        load()        
    }

})