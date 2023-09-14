const { Router } = require("express");
const { getSignup, postSignup, getLogin, postLogin, getadmin } = require("../Controllers/user.controller");
const passport = require("passport");
const routes = Router();


routes.get("/",getadmin)
routes.get("/signup", getSignup);
routes.post("/signup", postSignup);
routes.get("/login", getLogin);
routes.post("/login", passport.authenticate("local", {
    failureRedirect: "/user/signup",
}), postLogin


);
module.exports = routes;