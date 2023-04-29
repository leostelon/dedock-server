const path = require("path");
// Import env
require("dotenv").config({
	path: path.join(__dirname, "../.env"),
});

const express = require("express");
const routes = require("./routes");

const app = express();
app.use(express.static(__dirname));

// Database
require("./polybase");

// CORS
app.use(function (req, res, next) {
	var allowedDomains = process.env.ALLOWED_DOMAINS.split(" ");
	var origin = req.headers.origin;
	if (allowedDomains.indexOf(origin) > -1) {
		res.setHeader("Access-Control-Allow-Origin", origin);
	}
	res.header(
		"Access-Control-Allow-Methods",
		" GET, POST, PATCH, PUT, DELETE, OPTIONS"
	);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	next();
});
app.use(express.json());

// Routes
app.use(routes);

app.get("/", (req, res) => {
	res.send({ message: "Dedock server⚡" });
});

app.listen(3000, () => {
	console.log("App listening on port 3000");
});
