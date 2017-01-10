echo `date`
cd /home/20/jzl/gnuplotWeather
/usr/bin/nodejs generateWeatherData.js
/usr/local/bin/gnuplot makePlot.txt
