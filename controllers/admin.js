const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render("admin/edit-product", {
    path: "/admin" + req.path,
    editing: false
  });
};

exports.getEditProduct = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const editMode = req.query.edit;
  console.log("editMode", editMode);
  if (!editMode) {
    res.redirect("/");
  }

  const prodId = req.params.productId;

  Product.findById(prodId).then(product => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      path: req.path,
      editing: editMode,
      product: product
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = parseFloat(req.body.price);
  const description = req.body.description;
  const id = req.params.productId;
  Product.findById(id)
    .then(product => {
      if (product.userId.equals(req.user._id)) {
        return res.redirect("/");
      }
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      product.save();
    })
    .then(() => {
      res.redirect("/admin/products");
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id, userId: req.user._id }).then(() => {
    res.redirect("/admin/products");
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = parseFloat(req.body.price);
  const description = req.body.description;
  const product = new Product({
    title: title,
    image: imageUrl,
    description: description,
    price: price,
    userId: req.user
  });
  product.save();
  res.redirect("/admin/products");
};

exports.getAllProduct = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  Product.find({ userId: req.user._id })
    .populate("userId", "name")
    .then(allProducts => {
      console.log(allProducts);
      res.render("admin/product-list", {
        products: allProducts,
        path: "/admin" + req.path
      });
    });
};
