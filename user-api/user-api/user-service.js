const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string
let mongoDBConnectionString = process.env.MONGO_URL;

let Schema = mongoose.Schema;

// Define the user schema
let userSchema = new Schema({
  userName: {
    type: String,
    unique: true
  },
  password: String,
  favourites: [String],
  history: [String]
});

let User;

// Function to connect to MongoDB
module.exports.connect = function () {
  return new Promise(function (resolve, reject) {
    // Add TLS/SSL options for secure connection
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      sslValidate: true,
      sslCA: [require('fs').readFileSync('path_to_your_ca.pem')], // Path to CA certificate, if needed
      serverSelectionTimeoutMS: 5000,  // Timeout for server selection
    };

    let db = mongoose.createConnection(mongoDBConnectionString, options);

    db.on('error', (err) => {
      reject(`MongoDB connection error: ${err}`);
    });

    db.once('open', () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

// Add getUserById function
module.exports.getUserById = function (id) {
  return new Promise((resolve, reject) => {
    User.findById(id)
      .exec()
      .then((user) => {
        if (!user) {
          reject(`User with ID ${id} not found`);
        } else {
          resolve(user);
        }
      })
      .catch((err) => reject(`Error finding user with ID ${id}: ${err}`));
  });
};

module.exports.registerUser = function (userData) {
  return new Promise(function (resolve, reject) {
    if (userData.password != userData.password2) {
      reject("Passwords do not match");
    } else {
      bcrypt
        .hash(userData.password, 10)
        .then((hash) => {
          userData.password = hash;

          let newUser = new User(userData);

          newUser
            .save()
            .then(() => {
              resolve("User " + userData.userName + " successfully registered");
            })
            .catch((err) => {
              if (err.code == 11000) {
                reject("User Name already taken");
              } else {
                reject("There was an error creating the user: " + err);
              }
            });
        })
        .catch((err) => reject(err));
    }
  });
};

module.exports.checkUser = function (userData) {
  return new Promise(function (resolve, reject) {
    User.findOne({ userName: userData.userName })
      .exec()
      .then((user) => {
        if (!user) {
          reject("User not found");
        } else {
          bcrypt.compare(userData.password, user.password).then((res) => {
            if (res === true) {
              resolve(user);
            } else {
              reject("Incorrect password for user " + userData.userName);
            }
          });
        }
      })
      .catch((err) => reject(`Error checking user: ${err}`));
  });
};

module.exports.getFavourites = function (id) {
  return User.findById(id)
    .exec()
    .then((user) => user.favourites)
    .catch((err) => Promise.reject(`Unable to get favourites for user with ID: ${id}. Error: ${err}`));
};

module.exports.addFavourite = function (id, favId) {
  return User.findByIdAndUpdate(
    id,
    { $addToSet: { favourites: favId } },
    { new: true }
  )
    .exec()
    .then((user) => user.favourites)
    .catch((err) => Promise.reject(`Unable to update favourites for user with ID: ${id}. Error: ${err}`));
};

module.exports.removeFavourite = function (id, favId) {
  return User.findByIdAndUpdate(
    id,
    { $pull: { favourites: favId } },
    { new: true }
  )
    .exec()
    .then((user) => user.favourites)
    .catch((err) => Promise.reject(`Unable to update favourites for user with ID: ${id}. Error: ${err}`));
};

module.exports.getHistory = function (id) {
  return User.findById(id)
    .exec()
    .then((user) => user.history)
    .catch((err) => Promise.reject(`Unable to get history for user with ID: ${id}. Error: ${err}`));
};

module.exports.addHistory = function (id, historyId) {
  return User.findByIdAndUpdate(
    id,
    { $addToSet: { history: historyId } },
    { new: true }
  )
    .exec()
    .then((user) => user.history)
    .catch((err) => Promise.reject(`Unable to update history for user with ID: ${id}. Error: ${err}`));
};

module.exports.removeHistory = function (id, historyId) {
  return User.findByIdAndUpdate(
    id,
    { $pull: { history: historyId } },
    { new: true }
  )
    .exec()
    .then((user) => user.history)
    .catch((err) => Promise.reject(`Unable to update history for user with ID: ${id}. Error: ${err}`));
};
