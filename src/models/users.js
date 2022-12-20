const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id:Number,
  miles:Number,
  tickets:[{type:String}]
});

const User = mongoose.model("User", schema, "users");

module.exports = {
  User,
};
