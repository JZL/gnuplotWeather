echo `date`
cd /srv/org/fbMsgr/gnuplotWeather
/usr/bin/nodejs generateWeatherData.js
/usr/local/bin/gnuplot makePlot.txt
