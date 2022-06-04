const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const admin = require("firebase-admin");
const ngrok = require("ngrok");
const multer = require("multer");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "https://SECRET.firebaseio.com",
});

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/api", routes());

app.use(express.static("uploads"));

const port = process.env.PORT || 8000


app.listen(port, function () {
  console.log("estoy corriendo en puerto 5000");
});
