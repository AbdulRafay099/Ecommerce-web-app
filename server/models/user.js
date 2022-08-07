const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true
  },
  name: String,
  password: String,
  isSeller: {
    type: Boolean,
    default: false
  },
  address: {
    addr1: String,
    addr2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  created: {
    type: Date,
    default: Date.now
  },
});

UserSchema.pre("save", function (next) {
  var user = this;

  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, null, null, function (err, hash) {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);