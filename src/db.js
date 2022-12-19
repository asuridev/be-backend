const mongoose = require("mongoose");
require('dotenv').config();


const conectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('mongo db connected....')
  } catch (error) {
    console.errorr(error)
  }
};

module.exports = {
  conectDB
}