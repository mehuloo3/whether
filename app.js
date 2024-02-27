const express = require("express");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    const query = req.body.cityName;
    const apiKey = "eaca953d63f25e5c92608a911ddee6f3";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    https.get(url, function(response) {
        console.log(response.statusCode);

        // Handling response errors
        if (response.statusCode !== 200) {
            res.status(response.statusCode).send("Error getting weather data");
            return;
        }

        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const weatherIcon = weatherData.weather[0].icon;
            const imageURL = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celsius</h1>");
            res.write("<p>The weather is currently " + weatherDescription + "</p>");
            res.write("<img src='" + imageURL + "'>");
            res.send();
        });
    }).on("error", function(error) {
        console.error("Error retrieving weather data: " + error.message);
        res.status(500).send("Error retrieving weather data");
    });
});

app.listen(5000, function() {
    console.log("Server is running on port 5000...");
});

