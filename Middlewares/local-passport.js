const user =require("../Models/user.schema")

const LocalStrategy = require("passport-local").Strategy;

const LocalAuth = (passport) => {
    passport.use(
      new LocalStrategy(async (username, password, done) => {
        let User = await user.findOne({ username: username });
        if (!User) return done(null, false,{message: "User not found"});
        if (User.password !== password) return done(null, false,{message: "password mismatch"});
        return done(null, User);
      })
    );
    passport.serializeUser((user, done) => {
      return done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        let User = await user.findById(id);
        return done(null, User);
      });
    };
    
    module.exports = LocalAuth;