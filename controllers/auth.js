const User = require("../models/user");
var bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator/check");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    oldInput: {
      email: "",
      password: ""
    }
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }
  User.findOne({ email: email }).then(user => {
    if (!user) {
      return res.redirect("/login");
    }
    bcrypt
      .compare(password, user.password)
      .then(doMatch => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(() => {
            res.redirect("/");
          });
        }
        res.redirect("/login");
      })
      .catch(err => {
        res.redirect("/login");
      });
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getSignUp = (req, res, next) => {
  let messages = req.flash("error");
  if (messages.length === 0) {
    messages = null;
  }
  const isLoggedIn = req.session.isLoggedIn;
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign Up",
    error: messages,
    oldInput: {
      email: "",
      password: "",
      confirmpassword: ""
    },
    validationErrors: []
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Sign Up",
      error: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmpassword: confirmpassword
      },
      validationErrors: errors.array()
    });
  }
  bcrypt
    .hash(password, 12)
    .then(bcryptpassword => {
      const user = new User({
        email: email,
        password: bcryptpassword,
        cart: { items: [] }
      });
      return user.save();
    })
    .then(result => {
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: "nodejs@gmail.com",
        subject: "Sign up succeeded!",
        html: "<h1>You successfulyy signed up! </h1>"
      });
    });
};

exports.getReset = (req, res, next) => {
  let messages = req.flash("error");
  if (messages.length === 0) {
    messages = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    title: "Reset Password",
    error: messages
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash("error", "No account is associated!");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        res.redirect("/");
        return transporter.sendMail({
          to: req.body.email,
          from: "nodejs@gmail.com",
          subject: "Password Reset",
          html: `
          <p>You request a password reset. Click this link to set a new password:</p>
          Click this <a href="http://localhost:3000/reset/${token}">Reset Password</a>
        `
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.getResetPasswordForm = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() }
  }).then(user => {
    res.render("auth/passwordResetForm", {
      tokenReset: token,
      userId: user._id,
      path: "/reset",
      pageTitle: "Reset Password Form",
      error: null
    });
  });
};

exports.postResetPasswordForm = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.tokenReset;
  let resetUser;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(password => {
      resetUser.password = password;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect("/login");
    });
};
