const Product = require("../models/product");
const Order = require("../models/order");

exports.getAllProducts = (req, res, next) => {
  Product.find().then(allProducts => {
    res.render("shop/product-list", {
      products: allProducts,
      path: req.path
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then(product => {
    console.log("singleproduct", product);
    res.render("shop/product", {
      product: product,
      path: res.path
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.find().then(allProducts => {
    res.render("shop/index", {
      products: allProducts,
      path: req.path,
      pageTitle: "Welcome to my shop"
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  Product.findById(prodId).then(product => {
    req.user.addToCart(product).then(data => {
      res.redirect("/cart");
    });
  });
};

exports.getCart = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      console.log(user.cart.items);
      res.render("shop/cart", {
        path: req.path,
        pageTitle: "My Cart",
        products: user.cart.items
      });
    });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: req.path,
    pageTitle: "Welcome to checkout"
  });
};

exports.getOrders = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  Order.find({
    userId: req.user._id
  }).then(orders => {
    console.log(orders);
    res.render("shop/orders", {
      path: req.path,
      pageTitle: "Welcome to order",
      orders: orders
    });
  });
};

exports.postOrders = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      console.log(user.cart.items);
      const products = user.cart.items.map(i => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc }
        };
      });
      const order = new Order({
        products: products,
        userId: req.user
      });

      return order.save();
    })
    .then(() => {
      req.user.cart = { items: [] };
      return req.user.save();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.deleteCartItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteItemFromCart(prodId).then(() => {
    res.redirect("/cart");
  });
};
