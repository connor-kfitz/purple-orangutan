//Global Variables and Array Keys
var APIKey = "eae30589ae86d52103436bee50214263";
var boxTempDates =['#oneDayDate', '#twoDayDate', '#threeDayDate', '#fourDayDate', '#fiveDayDate'];
var boxTempIDs =['#oneDayTemp', '#twoDayTemp', '#threeDayTemp', '#fourDayTemp', '#fiveDayTemp'];
var boxWindIDs =['#oneDayWind', '#twoDayWind', '#threeDayWind', '#fourDayWind', '#fiveDayWind'];
var boxHumidityIDs =['#oneDayHumidity', '#twoDayHumidity', '#threeDayHumidity', '#fourDayHumidity', '#fiveDayHumidity'];
var boxIconIDs =['#oneDayWeatherIcon', '#twoDayWeatherIcon', '#threeDayWeatherIcon', '#fourDayWeatherIcon', '#fiveDayWeatherIcon'];



var historyMatrixValues = JSON.parse(localStorage.getItem("historyMatrixStorage"));
var historyMatrix = ["","","","",""];

var breakFunction = false;

//Functions
// // Function to collect and display data
function getData(cityName) {
    var temp;
    var wind;
    var humidity;
    var uvIndex;
    var iconCode;
    var fiveDayTemp = [0, 0, 0, 0, 0];
    var fiveDayWind = [0, 0, 0, 0, 0];
    var fiveDayHumidity = [0, 0, 0, 0, 0];
    var fiveDayIconCode = ["", "", "", "", ""];
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?units=metric&q=" + cityName + "&current.uvi=true&appid=" + APIKey;
    fetch(queryURL)
        .then(function (response) {
                breakFunction = true;
                return response.json(); 
        })

        .then(function (data) {
            temp = (data.main.temp); // Cel
            wind = (data.wind.speed); // m/s
            humidity = (data.main.humidity);
            $('#todayLocAndDate').text(cityName + ", " + moment().format('MMM Do YY'));
            $('#todayTemp').text(temp.toString());
            $('#todayWind').text(wind.toString());
            $('#todayHumidity').text(humidity.toString());
            
            var lat = data.coord.lat;
            var long = data.coord.lon;
            var newQueryURL = "http://api.openweathermap.org/data/2.5/onecall?units=metric&lat=" + lat + "&lon=" + long + "&appid=" + APIKey;
            fetch(newQueryURL)
                .then(function (response) {
                return response.json();
            })
                .then(function(data) {
                    uvIndex = data.current.uvi;
                    iconCode = data.current.weather[0].icon;
                    for(var i=0; i < 5; i++){
                        fiveDayIconCode[i] += data.daily[i].weather[0].icon;
                        fiveDayTemp[i] += data.daily[i].temp.day;
                        fiveDayWind[i] += data.daily[i].wind_speed;
                        fiveDayHumidity[i] += data.daily[i].humidity;
                        }
                    $('#weatherIcon').attr("src", "http://openweathermap.org/img/wn/" + iconCode + "@2x.png");
                    $('#todayUV').text(uvIndex.toString());

                    //Set UV Index Colour
                    if(uvIndex < 3) {
                        $('#todayUV').css('background', 'yellow');
                    } 
                    else if(uvIndex < 6) {
                        $('#todayUV').css('background', 'green');
                    } 
                    else {
                        $('#todayUV').css('background', 'red');
                    }

                    //Display collected info on screen
                    for(var i =0; i < 5; i++){
                        $(boxTempDates[i]).text(moment().add(i, 'days').format('MMM Do YY'))
                        $(boxIconIDs[i]).attr("src", "http://openweathermap.org/img/wn/" + fiveDayIconCode[i] + "@2x.png");
                        $(boxTempIDs[i]).text(fiveDayTemp[i]);
                        $(boxWindIDs[i]).text(fiveDayWind[i]);
                        $(boxHumidityIDs[i]).text(fiveDayHumidity[i]);
                    }
                })
        });
}

// //Function to check for a valid city entry
function checkData(cityName) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?units=metric&q=" + cityName + "&current.uvi=true&appid=" + APIKey;
    fetch(queryURL)
        .then(function (response) {
            if(response.status != 200) {
                breakFunction = true;
            }
        })
}

//Set search history buttons
var searchButton1 = $('#searchButton1');
var searchButton2 = $('#searchButton2');
var searchButton3 = $('#searchButton3');
var searchButton4 = $('#searchButton4');
var searchButton5 = $('#searchButton5');

//Utilizing local storage to fill in search history buttons
if(historyMatrixValues){
    historyMatrix = [historyMatrixValues.value0, historyMatrixValues.value1, historyMatrixValues.value2, historyMatrixValues.value3, historyMatrixValues.value4];
    getData(historyMatrix[0]);
    $('#searchButton1').text(historyMatrix[0]);
    $('#searchButton2').text(historyMatrix[1]);
    $('#searchButton3').text(historyMatrix[2]);
    $('#searchButton4').text(historyMatrix[3]);
    $('#searchButton5').text(historyMatrix[4]);
}

searchButton1.on('click', function(){
getData(historyMatrix[0]);
})

searchButton2.on('click', function(){
getData(historyMatrix[1]);
})

searchButton3.on('click', function(){
getData(historyMatrix[2]);
})

searchButton4.on('click', function(){
getData(historyMatrix[3]);
})

searchButton5.on('click', function(){
getData(historyMatrix[4]);
})


//Search button event listener to run required functions
var searchButton = $('#searchButton');
var searchHistory = $('.searchHistory');

searchButton.on('click', function (){
    var city = $('#searchBar').val();
    
    checkData(city)
    if(breakFunction){
        breakFunction = false;
        return;
    }

    getData(city)

    historyMatrix.pop();
      for(var i=0; i < 5; i++){
          historyMatrix[4-i]=historyMatrix[3-i];
      }
    historyMatrix[0] = city;
    $('#searchButton1').text(historyMatrix[0]);
    $('#searchButton2').text(historyMatrix[1]);
    $('#searchButton3').text(historyMatrix[2]);
    $('#searchButton4').text(historyMatrix[3]);
    $('#searchButton5').text(historyMatrix[4]);

    var historyMatrixStorage = {
        value0: historyMatrix[0],
        value1: historyMatrix[1],
        value2: historyMatrix[2],
        value3: historyMatrix[3],
        value4: historyMatrix[4]
    }

    localStorage.setItem("historyMatrixStorage", JSON.stringify(historyMatrixStorage));
})

