const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const admin = require('firebase-admin')
require('dotenv').config();

const app = express()


const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});


app.set('trust proxy', 1)
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
  
  app.use(cors({credentials: true, origin: 'https://front-interfazz.herokuapp.com'}));

app.use(bodyParser())

app.use(cookieParser())

app.use('/api',routes())




app.listen(process.env.PORT,function(){
    console.log(`estoy corriendo en puerto ${process.env.PORT}`)
})