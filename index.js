const express = require('express');
const connect = require('./config/dbconfig');
const routes = require('./Routes/user.route');
const passport = require('passport');
const session = require('express-session');
const LocalAuth = require('./Middlewares/local-passport')
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret' }));
LocalAuth(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json());


app.set("view engine", "ejs");
app.set("views",__dirname + "/views");
app.use(express.static(__dirname + "/public"));


app.use("/user", routes);


app.listen(5050,()=>{
    console.log('listening on port 5050');
    connect();

})