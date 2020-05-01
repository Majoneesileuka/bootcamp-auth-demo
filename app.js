var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost:27017/auth_demo_app", { useNewUrlParser: true, useUnifiedTopology: true });

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Super secret secret", // To encode/decode information in the session
    resave: false,
    saveUninitialized: false
}));

// To use passport following two are always required
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // Enconding
passport.deserializeUser(User.deserializeUser()); //  Decoding

//==============
// Routes
//==============
app.get("/", function (req, res) {
    res.render("home");
});

app.get("/secret", isLoggedIn, function (req, res) {
    res.render("secret");
});

// Auth routes
// Show sign up form
app.get("/register", function (req, res) {
    res.render("register");
});

// Handle user sign up
app.post("/register", function (req, res) {
    req.body.username
    req.body.password
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/secret");
        });
    });
});

// Log in routes
// Render login fowm
app.get("/login", function (req, res) {
    res.render("login");
});

// Login logic
// middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function (req, res) {
});

app.get("/logout", function (req, res) {
    req.logout(); // Passport does the rest
    res.redirect("/");
});

// Check if user is logged in and use as a middleware before displaying secret page
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

// Start server
app.listen(process.env.PORT || 3000, process.env.IP, function () {
    console.log('Server started...');
});