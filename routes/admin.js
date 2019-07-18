const path = require("path");

const express = require("express");

const adminControllers = require("../controllers/admin");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/add-product", isAuth, adminControllers.getAddProduct);

router.post("/add-product", adminControllers.postAddProduct);

router.get("/products", adminControllers.getAllProduct);

router.get("/edit-product/:productId", adminControllers.getEditProduct);

router.post("/edit-product/:productId", adminControllers.postEditProduct);

router.post("/delete-product/:productId", adminControllers.postDeleteProduct);

module.exports = router;
