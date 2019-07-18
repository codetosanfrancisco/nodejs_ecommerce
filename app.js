const path = require("path");

const express = require("express");

const rootDir = require("./util/path");

const adminRoutes = require("./routes/admin");

const shopRoutes = require("./routes/shop");

const authRoutes = require("./routes/auth");

const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const mongoose = require("mongoose");

const session = require("express-session");

const csrf = require("csurf");

const csrfProtection = csrf();

var flash = require("connect-flash");

const MONGODB_URI =
  "mongodb+srv://voonshunzhi:93332030@cluster0-p9vdf.mongodb.net/shop?w=majority";

const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
});

const User = require("./models/user");

const app = express();

app.use(bodyParser.urlencoded());

app.set("views", "./views");

app.set("view engine", "ejs");

app.use(
  session({
    secret: "my session",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(() => {
      console.log("error");
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.token = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);

app.use(authRoutes);

app.use(shopRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.use(errorController.errorHandler);

mongoose
  .connect(
    "mongodb+srv://voonshunzhi:93332030@cluster0-p9vdf.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then(result => {
    console.log("Connect to mongodb!");
    app.listen(3000, () => console.log("App is listening!"));
  })
  .catch(error => {
    console.log("error occured", error);
  });
