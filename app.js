const express = require('express');
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('./models/user');
const ExpressError = require("./utils/ExpressError");
const userRoutes = require('./router/users')
const taskRoutes = require('./router/tasks')


mongoose.connect("mongodb://root:xHWcbFxgewR8UY6Sjw6okAra@db-task-flow:27017/my-app?authSource=admin");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => console.log("Database connected"));


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisisnotagoodsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport serialize and deserialize
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Passport local strategy
passport.use(new LocalStrategy(User.authenticate()));

// GitHub strategy
passport.use(new GitHubStrategy({
    clientID: 'f935a4b1c88192959437',
    clientSecret: 'b852e327ae3b3c4ff91f7438ce6e53b9f3d1d279',
    callbackURL: 'https://task-flow.liara.run/auth/github/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ 'githubId': profile.id });

            if (!user) {
                // Create a new user in your database with details from GitHub profile
                const newUser = new User({
                    username: profile.username,
                    email: profile.email || `${profile.username}@github.com`,
                    githubId: profile.id
                });

                user = await newUser.save();
            }

            return done(null, user);
        } catch (err) {
            console.error('GitHub Authentication Error:', err);
            return done(err);
        }
    }));



app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.use('/', userRoutes)
app.use('/tasks', taskRoutes)


app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', { err });
});




app.listen(3000, () => {
    console.log('Port 3000');
});
