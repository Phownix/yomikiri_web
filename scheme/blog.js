const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    idv4: { type: String, required: true, maxLength: 100, index: true },
    date: { type: Date, default: Date.now },
    name: { type: String, required: true, maxLength: 100 },
    poster: { type: String },
    entry: { type: String },
});


// Export model
module.exports = mongoose.model("Blog", BlogSchema);
