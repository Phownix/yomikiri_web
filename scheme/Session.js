const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  session: Object,
  expires: { type: Date, required: true },
});

module.exports = mongoose.model('Session', sessionSchema);;