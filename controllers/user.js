const User = require('../models/user');

//signup
module.exports.signup = async (req,res)=>{
  try{
  let {username, email, password} = req.body;
  const newUser = new User({email, username});
  const registeredUser = await User.register(newUser, password);
  console.log(registeredUser);
  //
  req.login(registeredUser,(err)=>{
    if(err){
      return next();
    }
    req.flash("success", "Welcome to Wanderlust!");
  res.redirect('/listings');
  })
  
  }catch(err){
    req.flash('error',err.message);
    res.redirect('/listings');

  }
  
};

module.exports.renderSignupForm  = (req,res)=>{
  res.render('users/signup.ejs');
};

// login
module.exports.renderLoginForm = (req,res)=>{
  res.render('users/login.ejs');
};

module.exports.Login = async(req,res)=>{
  req.flash("success","welcome back wanderlust!!");
  // res.redirect(req.locals.redirectUrl);//flaw
  let redirectUrl = res.locals.redirectUrl || '/listings';
  res.redirect(redirectUrl);
};
//Logout
module.exports.logout = async (req,res)=>{
  req.logout((err)=>{
    if(err){
     return next(err)
    }
    req.flash("success","you are loggedout");
    res.redirect('/listings');

  });
}