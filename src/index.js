const fs = require("fs");
const path = require("path");
const express = require("express");
const routes = require("./routes");

require("dotenv").config({
	path: path.join(__dirname, "../.env"),
});

// Database
require("./polybase");

const app = express();
app.use(routes);

app.get("/", (req, res) => {
	res.send({ message: "Welcome to my app." });
});

app.listen(3000, () => {
	console.log("App listening on port 3000");
});
