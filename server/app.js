const express = require("express"); 
const mongoose = require("mongoose"); 
const cors = require("cors"); 

const app = express(); 

mongoose.connect("mongodb://localhost:27017/computer-zone", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Mongoose Init: Success");
  }
});

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cors());

const userRoutes = require("./routes/account");
const mainRoutes = require("./routes/main");
const sellerRoutes = require("./routes/seller");
const productSearchRoutes = require("./routes/product-search");

app.use("/api", mainRoutes);
app.use("/api/accounts", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/search", productSearchRoutes);

app.listen(3030, (err) => {
  console.log("Server Init: <port> " + 3030);
});