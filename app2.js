if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// console.log(process.env.SECRET);
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const PORT = 8080;
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
// express-session
const session = require('express-session');
//flash // connect-flash
const flash = require('connect-flash')
const MONGO_URL = process.env.ATLASDB_URL;
// const MongoStore = require('connect-mongo');//for production
const MongoStore = require("connect-mongo").default;
//npm i ejs-mate
const ejsMate = require('ejs-mate');//npm i ejs-mate
//error handlings
const wrapAsync = require('./utils/wrapAsync.js');//error handline utilites
const ExpressErr = require('./utils/ExpressErr.js');
//middleware
const {listingSchema , reviewSchema} = require('./Schema.js');//listings
const Reviews = require("./models/reviews.js")
const listingRoute = require('./routes/listings.js');
const reviewRoute = require('./routes/reviews.js')
const userRoute = require('./routes/user.js')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended :  true}));
app.use(express.json()); // For JSON data
app.use(methodOverride('_method'));//npm i method-override
app.engine('ejs', ejsMate);//include/partial
app.use(express.static(path.join(__dirname , '/public')));



const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600
});

store.on("error",(err)=>{
 console.log("error in Mongo Session Store", err);
});

const sessionOptions = {//cookie track session
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : false,//If true → empty sessions saved in DB
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge :  7 * 24 * 60 * 60 * 1000,
        httpOnly : true

    }

}

app.use(session(sessionOptions));
app.use(flash());

//Passport initialize
app.use(passport.initialize())//middleware that initialize passport
app.use(passport.session());
//passport sessions
//a web application needs ability to identify users as they browse from page to page
//this series of req and res, each associated with same user, is known as a sessions.
passport.use(new LocalStrategy(User.authenticate()));//registers authentication strategy
//gen a function that is used in Passport's LocalStrategy
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//helmet
const helmet = require("helmet");

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],

      scriptSrc: [
        "'self'",
        "'unsafe-inline'",   // allow inline JS (for now)
        "https://cdn.jsdelivr.net",
        "https://unpkg.com"
      ],

      styleSrc: [
        "'self'",
        "'unsafe-inline'",   // allow inline CSS
        "https://cdn.jsdelivr.net",
        "https://unpkg.com",
        "https://cdnjs.cloudflare.com"
      ],

      
  imgSrc: [
  "'self'",
  "data:",
  "https://res.cloudinary.com",
  "https://images.unsplash.com",
  "https://plus.unsplash.com",
  "https://unpkg.com",
  "https://a.tile.openstreetmap.org",
  "https://b.tile.openstreetmap.org",
  "https://c.tile.openstreetmap.org",
],


      connectSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "https://unpkg.com"
      ]
    }
  })
);


app.use((req,res,next)=>{
    res.locals.success = req.flash("success") ;
    res.locals.error = req.flash("error");
    console.log(res.locals.success);
    res.locals.currUser = req.user;
    next();
})

// app.use((req, res, next) => {
//     res.locals.success = req.flash("success") || [];
//     res.locals.error = req.flash("error") || [];
//     res.locals.currUser = req.user || null;
//     next();
// });



mongoose.connect(MONGO_URL)
.then(() => console.log("Mongo connected"))
.catch(err => console.log(err));
// app.get('/', async (req,res)=>{
//     res.send("hi")
// });

app.use('/listings', listingRoute);
app.use('/listings/:id/reviews' , reviewRoute );
app.use('/' , userRoute );


// page not found
// app.all("*/*", (req, res, next) => {
//     next(new ExpressErr(404, "Page not found!"));//call err middleware
// });
// 404 handler (must be AFTER routes)
app.use((req, res, next) => {
    next(new ExpressErr(404, "Page not found!"));
});

//catch err
app.use((err, req, res, next) => {
    let {statusCode = 400, message = "Something went wrong!"} = err // default values
    res.status(statusCode).render("error.ejs", { err });
    //  res.send("Something went wrong!")

});


app.listen(PORT, ()=>console.log(`Server is listening to port ${PORT}`));

// Why use wrapAsync instead of try-catch in every controller?
// Because wrapAsync prevents repetitive try-catch blocks and automatically forwards 
// async errors to Express error middleware using next(err).
//  It keeps controller code clean and readable.