const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  startCity: String,
  endCity: String,
  miles: Number,
  plane: String,
  startDate: Date,
  endDate: Date,
  direct: Boolean,
  price: Number,
  flyId:String
});

const Fly = mongoose.model("Fly", schema, "fakeAPI");

module.exports = {
  Fly,
};
