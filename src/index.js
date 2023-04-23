const fs = require("fs");
const path = require("path");
const express = require("express");

require("dotenv").config({
	path: path.join(__dirname, "../.env"),
});

const app = express();

app.get("/", (req, res) => {
	res.send({ message: "Welcome to my app." });
});

app.listen(3000, () => {
	console.log("App listening on port 3000");
});
