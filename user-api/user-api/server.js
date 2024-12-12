const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const jwt = require("jsonwebtoken");
const userService = require("./user-service.js");

// Initialize environment variables
dotenv.config();

// Validate necessary environment variables
if (!process.env.JWT_SECRET) {
  console.error("Error: JWT_SECRET is not set in environment variables.");
  process.exit(1);
}

const app = express();
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
    async (jwtPayload, done) => {
      try {
        const user = await userService.getUserById(jwtPayload._id);
        if (user) return done(null, user);
        return done(null, false, { message: "User not found" });
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, userName: user.userName },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Token expires in 1 hour
  );
};

// Routes
// Public Routes
app.post("/api/user/register", async (req, res, next) => {
  try {
    const msg = await userService.registerUser(req.body);
    res.json({ success: true, message: msg });
  } catch (error) {
    next({ status: 422, message: error });
  }
});

app.post("/api/user/login", async (req, res, next) => {
  try {
    const user = await userService.checkUser(req.body);
    const token = generateToken(user);
    res.json({ success: true, message: "Login successful", token });
  } catch (error) {
    next({ status: 422, message: error });
  }
});

// Protected Routes
app.get("/api/user/favourites", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const data = await userService.getFavourites(req.user._id);
    res.json({ success: true, data });
  } catch (error) {
    next({ status: 422, message: error });
  }
});

app.put("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const data = await userService.addFavourite(req.user._id, req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next({ status: 422, message: error });
  }
});

app.delete("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const data = await userService.removeFavourite(req.user._id, req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next({ status: 422, message: error });
  }
});

// User History Routes
app.get("/api/user/history", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const data = await userService.getHistory(req.user._id);
    res.json({ success: true, data });
  } catch (error) {
    next({ status: 422, message: error });
  }
});

app.put("/api/user/history/:id", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const data = await userService.addHistory(req.user._id, req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next({ status: 422, message: error });
  }
});

app.delete("/api/user/history/:id", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const data = await userService.removeHistory(req.user._id, req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next({ status: 422, message: error });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Connect to Database and Start Server
userService
  .connect()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`API listening on port: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to start the server:", err);
    process.exit(1);
  });
