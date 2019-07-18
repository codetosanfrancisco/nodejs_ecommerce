const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

const isAuth = require("../middleware/is-auth");

const productController = require("../controllers/products");

router.use("/products", productController.getAllProducts);

router.get("/cart", isAuth, productController.getCart);

router.use("/checkout", isAuth, productController.getCheckout);

router.get("/orders", isAuth, productController.getOrders);

router.post("/orders", productController.postOrders);

router.get("/product/:productId", productController.getProduct);

router.post("/cart", productController.postCart);

router.post("/cart-delete-item", productController.deleteCartItem);

router.use("/", productController.getIndex);

module.exports = router;
