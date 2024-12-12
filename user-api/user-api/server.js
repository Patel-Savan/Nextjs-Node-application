const express = require('express');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const jwt = require("jsonwebtoken");
const userService = require("./user-service.js");

const HTTP_PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Configure JWT Strategy for Passport
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, done) => {
      userService.getUserById(jwtPayload._id)
        .then(user => done(null, user))
        .catch(err => done(null, false, { message: err }));
    }
  )
);

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ _id: user._id, userName: user.userName }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });
};

// Public Routes
app.post("/api/user/register", (req, res) => {
  userService.registerUser(req.body)
    .then((msg) => res.json({ "message": msg }))
    .catch((msg) => res.status(422).json({ "message": msg }));
});

app.post("/api/user/login", (req, res) => {
  userService.checkUser(req.body)
    .then((user) => {
      const token = generateToken(user); // Generate JWT token
      res.json({ "message": "login successful", "token": token });
    })
    .catch((msg) => res.status(422).json({ "message": msg }));
});

// Protected Routes
app.get("/api/user/favourites", passport.authenticate('jwt', { session: false }), (req, res) => {
  userService.getFavourites(req.user._id)
    .then(data => res.json(data))
    .catch(msg => res.status(422).json({ error: msg }));
});

app.put("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  userService.addFavourite(req.user._id, req.params.id)
    .then(data => res.json(data))
    .catch(msg => res.status(422).json({ error: msg }));
});

app.delete("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  userService.removeFavourite(req.user._id, req.params.id)
    .then(data => res.json(data))
    .catch(msg => res.status(422).json({ error: msg }));
});

app.get("/api/user/history", passport.authenticate('jwt', { session: false }), (req, res) => {
  userService.getHistory(req.user._id)
    .then(data => res.json(data))
    .catch(msg => res.status(422).json({ error: msg }));
});

app.put("/api/user/history/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  userService.addHistory(req.user._id, req.params.id)
    .then(data => res.json(data))
    .catch(msg => res.status(422).json({ error: msg }));
});

app.delete("/api/user/history/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  userService.removeHistory(req.user._id, req.params.id)
    .then(data => res.json(data))
    .catch(msg => res.status(422).json({ error: msg }));
});

// Connect to Database and Start Server
userService.connect()
  .then(() => {
    app.listen(HTTP_PORT, () => { console.log("API listening on: " + HTTP_PORT) });
  })
  .catch((err) => {
    console.log("unable to start the server: " + err);
    process.exit();
  });
