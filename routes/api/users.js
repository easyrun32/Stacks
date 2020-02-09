const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// To upload picture
const upload = require("../../photojs/multer");
const google = require("../../google/uploadgoogle");
const fs = require("fs");
const path = require("path");
router.use(express.json()); // idk why req.file keeps fucking up

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        description: "",
        profilelink: ""
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          description: user.description,
          profilelink: user.profilelink
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.post("/updatedescription", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.id },
    { $set: { description: req.body.description } },
    { new: true }
  ).then(user =>
    res.send({ description: user.description, profilelink: user.profilelink })
  );
});
router.post("/getdetail", (req, res) => {
  User.findById({ _id: req.body.id }).then(user =>
    res.send({ description: user.description, profilelink: user.profilelink })
  );
});

router.post("/updatepicture", upload.single("profilelink"), (req, res) => {
  const googlefolder = {
    file: req.body.email + "/" + req.file.filename
  };
  const photolink =
    "https://storage.googleapis.com" +
    "/" +
    "stormybucket" +
    "/" +
    req.body.email +
    "/" +
    req.file.filename;

  User.findOneAndUpdate(
    { _id: req.body._id },
    { $set: { profilelink: photolink } },
    { new: true }
  ).then(user => {
    google
      .uploadpicture("stormybucket", googlefolder["file"], "./" + req.file.path)
      .then(bool => {
        if (bool == true) {
          //when bool is true then give a response to the client
          res.json({
            description: user.description,
            profilelink: user.profilelink
          });
        }
      });
  });
});
module.exports = router;
