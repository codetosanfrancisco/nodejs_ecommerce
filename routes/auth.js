const express = require("express");

const authController = require("../controllers/auth");

const { check, body } = require("express-validator/check");

const router = express.Router();

const User = require("../models/user");

router.get("/login", authController.getLogin);

router.post("/login",[ body("email","Please enter a valid email.").isEmail()], authController.postLogin);

router.get("/signup", authController.getSignUp);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Invalid Email!")
      .custom((value, { req }) => {
        User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject(
              "Email exists already!PLease pick a different one!"
            );
          }
        });
      }),
    body("password", "Please enter password with more than 5 character.")
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password have to match!");
      }

      return true;
    })
  ],
  authController.postSignUp
);

router.post("/logout", authController.postLogout);

router.post("/resetpassword", authController.postResetPasswordForm);

router.get("/reset/:token", authController.getResetPasswordForm);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

module.exports = router;
