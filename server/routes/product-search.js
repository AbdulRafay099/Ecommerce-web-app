const router = require("express").Router();
const async = require("async");

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  const perPage = 10;
  const page = req.query.page;
  var regex = new RegExp([req.query.query].join(""), "i");
  async.parallel(
    [
      function (callback) {
        Product.count({}, (err, count) => {
          var totalProducts = count;
          callback(err, totalProducts);
        });
      },
      function (callback) {
        Product.find({
            isDeleted: false,
            title: regex
          })
          .skip(perPage * page)
          .limit(perPage)
          .populate("category")
          .populate("owner")
          .exec((err, products) => {
            if (err) return next(err);
            callback(err, products);
          });
      },
    ],
    function (err, results) {
      var totalProducts = results[0];
      var products = results[1];

      res.json({
        success: true,
        message: "Product",
        products: products,
        totalProducts: totalProducts,
        pages: Math.ceil(totalProducts / perPage),
        currentProducts: products.length,
      });
    }
  );
});

module.exports = router;