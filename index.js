// to set path for 'views' and 'public'
const path = require("path")
const express = require("express");
// to maintain a session
const session = require("express-session");
// to implement environment variables
require("dotenv").config();
// to implement flash messages
const flash = require("connect-flash");
const passport=require("passport")
const  LocalStrategy=require('passport-local')
const Admin=require("./models/admin")
const admin=require("./routes/admin")
var methodOverride = require("method-override");

const app = express();
const PORT = 1600;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// to make use of mongoDB
const mongoose = require("mongoose");
const connection = require("./database");
connection();

// storing sessions in mongoDB
const MongoStore = require("connect-mongo");
const mongoStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions",
    mongooseConnection: mongoose.connection,
});


app.use(session({
    secret: process.env.SessionSecret,
    resave: false,
    saveUninitialized: true,
    store: mongoStore,
}));


app.use(flash());

// passport for admin
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(Admin.authenticate()));


app.use((req, res, next) => {
    //req.user have id of current user
    res.locals.currentUser= req.user;
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})
app.use(admin)

const home = require("./routes/home");
app.use(home);
const donate = require("./routes/donate");
app.use(donate);
const aboutUs = require("./routes/aboutUs");
app.use(aboutUs);
const feedback = require("./routes/feedback");
app.use(feedback);
const registeredNGO = require("./routes/registeredNGO");
app.use(registeredNGO);
const nearbyDonations = require("./routes/nearbyDonations");
app.use(nearbyDonations);
const ngoAuthentication = require("./routes/ngoAuthentication");
app.use(ngoAuthentication);
const userAuthentication = require("./routes/userAuthentication");
app.use(userAuthentication);
const userProfile = require("./routes/userProfile");
app.use(userProfile);
const editProfile = require("./routes/editProfile");
app.use(editProfile);
const ngoProfile = require("./routes/ngoProfile");
app.use(ngoProfile);

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Session destruction error:", err);
            return;
        }
        res.redirect("/");
    });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});