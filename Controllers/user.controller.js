const user = require("../Models/user.schema")

const getSignup= (req,  res) => {
    res.render('signup');
};
const postSignup= async(req, res) => {
    await user.create(req.body);
    res.status(200).json({added:true});
    
};

const getLogin = (req, res) => {
    res.render("login");
  };
  const postLogin = async (req, res) => {
    res.send("Welcome to the Google ");
  };



module.exports ={getSignup,postSignup,getLogin,postLogin}
