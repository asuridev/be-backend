const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  ticketId: String, //C
  rt: Boolean,
  status: String, //C  paid peinding no-paid
  date: Date, //C
  passengers: [
    {
      size: String, // adult, kid, baby
      id: Number,
      name: String,
      lastname: String,
      email: String,
      telephone: Number,
      age: Number,
      percentage: Number, //C
      total: Number, //C
    },
  ],
});

const Ticket = mongoose.model("Ticket", schema);

module.exports = {
  Ticket,
};
