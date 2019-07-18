const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product"
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = function(product) {
  const cartProductIndex =
    this.cart.items > 0
      ? this.cart.items.findIndex(cp => {
          return cp.productId.equals(product._id);
        })
      : -1;

  let newCount = 1;
  let updatedCartItems = this.cart.items > 0 ? [...this.cart.items] : [];
  let updatedCart = {};

  console.log("cartproductindex", cartProductIndex);

  if (cartProductIndex >= 0) {
    let newCount = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newCount;
    updatedCart = {
      items: [...updatedCartItems]
    };
  } else {
    updatedCart = {
      items: [...updatedCartItems, { productId: product._id, quantity: 1 }]
    };
  }
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteItemFromCart = function(productId) {
  console.log(productId);
  const updatedCartItems = this.cart.items.filter(i => {
    return !i.productId.equals(productId);
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const getDb = require("../util/database").getDb;
// const mongodb = require("mongodb");

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; //{ items:[] }
//     this._id = id;
//   }

//   addToCart(product) {
//     const cartProductIndex =
//       this.cart.items > 0
//         ? this.cart.items.findIndex(cp => {
//             return cp.productId.equals(product._id);
//           })
//         : -1;

//     let newCount = 1;
//     let updatedCartItems = this.cart ? [...this.cart.items] : [];
//     let updatedCart = {};

//     console.log("cartproductindex", cartProductIndex);

//     if (cartProductIndex >= 0) {
//       let newCount = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newCount;
//       updatedCart = {
//         items: [...updatedCartItems]
//       };
//     } else {
//       updatedCart = {
//         items: [
//           ...updatedCartItems,
//           { productId: mongodb.ObjectID(product._id), quantity: 1 }
//         ]
//       };
//     }
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: mongodb.ObjectID(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then(cart => {
//         console.log("cart", cart);
//         const order = {
//           items: cart,
//           user: {
//             _id: mongodb.ObjectID(this._id),
//             username: this.name
//           }
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then(result => {
//         console.log("addorder");
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: mongodb.ObjectID(this._id) },
//             { $set: { cart: this.cart } }
//           );
//       });
//   }

//   getOrder() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": mongodb.ObjectID(this._id) })
//       .toArray();
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   static findById(id) {
//     const db = getDb();
//     return db.collection("users").findOne({ _id: new mongodb.ObjectId(id) });
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: [...productIds] } })
//       .toArray()
//       .then(products => {
//         return products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(i => {
//               return i.productId.equals(p._id);
//             }).quantity
//           };
//         });
//       });
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(i => {
//       return !i.productId.equals(productId);
//     });
//     const db = getDb();
//     return db.collection("users").updateOne(
//       {
//         _id: mongodb.ObjectID(this._id)
//       },
//       {
//         $set: { cart: { items: [...updatedCartItems] } }
//       }
//     );
//   }
// }

// module.exports = User;
