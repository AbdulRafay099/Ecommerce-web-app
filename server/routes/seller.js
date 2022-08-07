const router = require("express").Router();
const Product = require("../models/product");

const multer = require("multer");
const upload = multer({dest: 'uploads/'}); //https://www.npmjs.com/package/multer

const checkJWT = require("../middlewares/check-jwt");

router.route("/products/:id").post((req, res) => {
  Product.findByIdAndUpdate({
      _id: req.params.id
    }, {
      isDeleted: true
    },
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

router.route("/products").get(checkJWT, (req, res, next) => {
    Product.find({
        owner: req.decoded.user._id
      })
      .populate("owner")
      .populate("category")
      .exec((err, products) => {
        if (products) {
          res.json({
            success: true,
            message: "Products",
            products: products,
          });
        }
      });
  });

router.route("/products").post(upload.single('productImage'), (req, res, next) => {
    let product = new Product();
    product.owner = null;
    product.category = req.body.categoryId;
    product.title = req.body.title;
    product.price = req.body.price;
    product.quantity = req.body.quantity;
    product.description = req.body.description;
    product.image = req.file.location;
    product.isDeleted = false;
    product.save();
    res.json({
      success: true,
      message: "Successfully Added the product",
    });
  });

router.route("/editproducts").post(checkJWT, (req, res, next) => {
    Product.findByIdAndUpdate({
        _id: req.body.id
      }, {
        owner: req.decoded.user._id,
        category: req.body.categoryId,
        title: req.body.title,
        price: req.body.price,
        quantity: req.body.quantity,
        description: req.body.description,
        image: req.file.location,
        isDeleted: req.body.isDeleted,
      },
      (err, result) => {
        if (err) {
          res.json({
            success: false,
            message: err,
          });
        } else
          res.json({
            success: true,
            message: "Successfully updated the product",
          });
      }
    );
  });

module.exports = router;