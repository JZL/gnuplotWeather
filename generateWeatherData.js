var https = require("https");
var fs = require('fs');

function getForecast(){
    var dummy = false
//    dummy = true
    if(!dummy){
        https.get("https://api.forecast.io/forecast/2e96d21ace402e85da164cf6d24869c7/39.9068405,-75.357837", function(res) { 
            var body = '';
            res.on('data', function (d) {
                body += d; 
            });
            res.on('end', function () {
                try{
                    var json = JSON.parse(body);
                }catch(e){
                    console.log(body)
                    throw "Couldn't parse JSON: "+body;
                }
                makeWeatherData(json);
            });
        });
    }else{
            fs.readFile("dummy_data", "utf8", function(err, data) {
                makeWeatherData(JSON.parse(data))
            });
        }
    }

    function makeWeatherData(forecast){
        var tempArr = []
        var hourly = forecast.hourly.data
        var minTemp = hourly[0].temperature
        //  var prevTemp = hourly[0].temperature
        var prevTempChange = hourly[1].temperature-hourly[0].temperature
        var lowestTemp = [0, hourly[0].temperature]
        var highestTemp = [0,hourly[0].temperature]
        var previousSummary = ""
        var dateStringArr = []
        var evenDay = true
        var tickArray = []
        var maxPrecip = 0.3
        // for(var i = 0; i<=24; i++){
        for(var i = 0; i<=24; i++){
            var summary = ""
            var icon = ""
            var tempAnnot = null
            var tempAnnotPoints = null
            var tempAnnotColor = null
            var precipColor = "0|0|0"
            tickArray.push(new Date(hourly[i].time*1000).getHours());
            // tickArray.push({f: Utilities.formatDate(new Date(hourly[i].time*1000), "America/New_York", "E hh a"), v: hourly[i].time*1000})
            //    console.log(Utilities.formatDate(new Date(hourly[i].time*1000), "America/New_York", "hh a"))
            //    tempArr.push([Utilities.formatDate(new Date(hourly[i].time*1000), "America/New_York", "hh a"), hourly[i].temperature, hourly[i].precipIntensity])
            
            if(previousSummary!==hourly[i].summary){
                // summary  = hourly[i].summary
                console.log(hourly[i].icon)
                switch(hourly[i].icon){
                case "clear-day":
                    icon = "☀️";
                    break;
                case "clear-night":
                    icon = "🌌";
                    break;
                case "rain":
                    icon = "☔";
                    break;
                case "snow":
                    icon = "❄️";
                    break;
                case "sleet":
                    icon = "❄️☔";
                    break;
                case "wind":
                    icon = "🌀";
                    break;
                case "fog":
                    icon = "🌫";
                    icon = "🌁";
                    break;
                case "cloudy":
                    icon = "☁️";
                    break;
                case "partly-cloudy-night":
                    icon = "⛅️";
                    break;
                case "partly-cloudy-day":
                    icon = "⛅️";
                    break;
                case "hail":
                    icon = "🐱";
                    break;
                case "thunderstorm":
                    icon = "⚡";
                    break;
                case "tornado":
                    icon = "🌪🌀";
                    break;
                }
                summary=hourly[i].summary

                previousSummary = hourly[i].summary
            }
            if(hourly[i].temperature< lowestTemp[1]){
                lowestTemp = [i, hourly[i].temperature]
            }
            if(hourly[i].temperature> highestTemp[1]){
                highestTemp = [i, hourly[i].temperature]
            }
            //used to find peak and trough of temperature
            /*
              if(i>0){
              var tmpTempChange = hourly[i].temperature-hourly[i-1].temperature
              if(prevTempChange*(tmpTempChange) <0 ){
              //-*-=+, +*+=+, only is negative if switches
              tempArr[i-1][5] = hourly[i-1].temperature+"Â°F"
              tempArr[i-1][6] = hourly[i-1].temperature
              prevTempChange = tmpTempChange
              if(prevTempChange <0){
              //high temperatire
              tempArr[i-1][7] = "orange"
              }else{
              tempArr[i-1][7] = "purple"
              }
              //        tempAnnotPoints = hourly[i].temperature
              
              }
              }
            */
            if(hourly[i].precipIntensity!==0){
                if(hourly[i].precipIntensity > maxPrecip){
                    maxPrecip = hourly[i].precipIntensity
                }
                if(hourly[i].precipType == "rain"){
                    if(hourly[i].precipIntensity > 0.3){
                        precipColor="255|69|0" //orangrered
                    }else{
                        precipColor="00|00|204"
                    }
                }else if(hourly[i].precipType == "snow"){
                    precipColor="255|99|71"
                }else if(hourly[i].precipType == "sleet"){
                    precipColor="176|196|222"
                }else{
                    precipColor="00|255|000"
                }
            }
            // console.log((new Date((hourly[i].time*1000))).getHours())
            if((new Date((hourly[i].time*1000))).getHours() == 0){
                // console.log("went")
                evenDay = !evenDay
            }
            
            
            //    tempArr.push([new Date(hourly[i].time*1000), hourly[i].temperature, hourly[i].precipIntensity, "opacity: "+hourly[i].precipProbability+";"+precipColor, summary, tempAnnot, tempAnnotPoints, tempAnnotColor, evenDay?1:0])
            // tempArr.push([hourly[i].time*1000,new Date(hourly[i].time*1000).getHours(), hourly[i].temperature, hourly[i].precipIntensity, "opacity: "+hourly[i].precipProbability+";"+precipColor, summary, tempAnnot, tempAnnotPoints, tempAnnotColor, evenDay?1:0])
            tempArr.push([hourly[i].time*1000,toDateStr(new Date(hourly[i].time*1000)), hourly[i].temperature, hourly[i].precipProbability, hourly[i].precipIntensity, precipColor, icon, summary,"","",hourly[i].apparentTemperature])
            //tempAnnot, tempAnnotPoints, tempAnnotColor, evenDay?1:0,
            
            //    dateStringArr.push(Utilities.formatDate(new Date(hourly[i].time*1000), "America/New_York", "hh a"))
        }
        // tempArr[lowestTemp[0]][8] = hourly[lowestTemp[0]].temperature+"°F"+"\\n\\n"
        tempArr[lowestTemp[0]][8] = hourly[lowestTemp[0]].temperature

        // tempArr[lowestTemp[0]][8] = tempArr[lowestTemp[0]][1]+""
        // tempArr[lowestTemp[0]][5] = "00|00|255"
        
        tempArr[highestTemp[0]][9] =hourly[highestTemp[0]].temperature
        // tempArr[highestTemp[0]][9] = hourly[highestTemp[0]].temperature+"°F"+"\\n\\n"
        // tempArr[highestTemp[0]][8] = tempArr[highestTemp[0]][1]+""
        // tempArr[highestTemp[0]][5] = "255|127|80"

        //  console.log(tempArr)
        // console.log([tempArr, forecast.hourly.summary+"\n"+forecast.daily.summary, lowestTemp[1], dateStringArr, tickArray, maxPrecip])
        var result = "";
        for(var i in tempArr){
            result+=tempArr[i].join("|")+"\n"
        }
        result = (new Date().toString())+"\\n"+forecast.hourly.summary+"\\n"+forecast.daily.summary+"\n"+result
        fs.writeFile("/srv/org/fbMsgr/gnuplotWeather/data", result, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        }); 

        //  https ://api.forecast.io/forecast/2e96d21ace402e85da164cf6d24869c7/39.5010371,-76.5856126
    }
    getForecast();

    function toDateStr(date){
        var daysArr = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        var hours = date.getHours();
        var amPm = (((hours + 11) % 12) + 1) + "\\n"+(hours > 11 ? 'PM' : 'AM');
        return daysArr[date.getDay()]+"\\n" + amPm;
    }
