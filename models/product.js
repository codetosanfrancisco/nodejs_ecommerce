const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
});

module.exports = mongoose.model("Product", productSchema);

// // const path = require("path");
// // const Cart = require("./cart");
// // var fs = require("fs");
// // const Pool = require("../index");
// const getDb = require("../util/database").getDb;
// const mongoDb = require("mongodb");

// class Product {
//   constructor(title, image_url, description, price, id, userId) {
//     this.title = title;
//     this.image = image_url;
//     this.description = description;
//     this.price = price;
//     this.id = id;
//     this.userId = mongoDb.ObjectID(userId);
//   }

//   static deleteById(id, cb) {
//     const db = getDb();
//     db.collection("products")
//       .deleteOne({ _id: mongoDb.ObjectID(id) })
//       .then(data => {
//         console.log(data);
//         cb();
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this.id) {
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: mongoDb.ObjectID(this.id) }, { $set: this });
//       console.log("update");
//     } else {
//       dbOp = db.collection("products").insertOne(this);
//       console.log("Insert");
//     }
//     return dbOp
//       .then(res => {
//         console.log(res);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static fetchAll(cb) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then(res => {
//         console.log(res);
//         cb(res);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static fetchById(id, cb) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: mongoDb.ObjectID(id) })
//       .next()
//       .then(data => {
//         console.log(data);
//         cb(data);
//       })
//       .catch(err => console.log(err));
//   }
// }

// module.exports = Product;

// // let allProducts;

// // const getAllProductsFromFile = cb => {
// //   fs.readFile(p, (err, fileContent) => {
// //     if (err) {
// //       cb([]);
// //     } else {
// //       allProducts = JSON.parse(fileContent);
// //       cb(allProducts);
// //     }
// //   });
// // };

// // const p = path.join(
// //   path.dirname(process.mainModule.filename),
// //   "data",
// //   "products.json"
// // );

// // module.exports = class Product {
// //   constructor(id, title, image_url, description, price) {
// //     this.id = id;
// //     this.title = title;
// //     this.image = image_url;
// //     this.description = description;
// //     this.price = price;
// //   }

// //   save() {
// //     getAllProductsFromFile(products => {
// //       if (this.id) {
// //         const existingProductIndex = products.findIndex(
// //           prod => prod.id === this.id
// //         );
// //         const updatedProducts = [...products];
// //         updatedProducts[existingProductIndex] = this;
// //         console.log(existingProductIndex);
// //         fs.writeFile(p, JSON.stringify(updatedProducts), err => {
// //           console.log(err);
// //         });
// //       } else {
// //         this.id = Math.floor(Math.random() * 10);
// //         products.push(this);
// //         fs.writeFile(p, JSON.stringify(products), err => {
// //           console.log(err);
// //         });
// //         this.collection = [
// //           this.id,
// //           "'" + this.title + "'",
// //           "'" + this.image + "'",
// //           "'" + this.description + "'",
// //           this.price
// //         ];
// //         let query =
// //           "INSERT INTO Products(id,title,imageUrl,description,price) VALUES (" +
// //           this.collection.join(",") +
// //           ")";
// //         console.log(query);
// //         Pool.query(query, (err, res) => {
// //           console.log(err, res);
// //           Pool.end();
// //         });
// //       }
// //     });
// //   }

// //   static fetchById(id, cb) {
// //     getAllProductsFromFile(products => {
// //       const product = products.find(p => p.id === parseInt(id));
// //       cb(product);
// //     });
// //   }

// //   static fetchAll(cb) {
// //     getAllProductsFromFile(cb);
// //   }

// //   static deleteById(id, cb) {
// //     getAllProductsFromFile(products => {
// //       const product = products.find(prod => prod.id === id);
// //       const updatedProducts = products.filter(prod => prod.id !== id);
// //       fs.writeFile(p, JSON.stringify(updatedProducts), err => {
// //         if (!err) {
// //           Cart.deleteProduct(id, product.price);
// //           cb();
// //         }
// //       });
// //     });
// //   }
// // };
