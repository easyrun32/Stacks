const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const users = require("./routes/api/users");
const projects = require("./routes/api/projects");
const publicusers = require("./routes/api/publicusers");
const comments = require("./routes/api/comments");
const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

mongoose.set("useFindAndModify", false);
// Passport middleware
app.use(express.static(path.join(__dirname, "client/build")));
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/projects", projects);

app.use("/api/publicuser", publicusers);
app.use("/api/comments", comments);

// Serve static assets (build folder) if in production
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
server = app.listen(port);

console.log(`data being sent on localhost ${port}`);
