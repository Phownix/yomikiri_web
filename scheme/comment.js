const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    idv4: { type: String, required: true, maxLength: 100, index: true },
    author: { type: String, required: true, maxLength: 100 },
    date: { type: Date, default: Date.now },
    content: { type: String, required: true },
    visible: { type: Boolean, default: true},
    in: { type: String, required: true},
    author: { type: String, required: true },
    comm: { type: String },
});

// Export model
module.exports = mongoose.model("Comments", CommentsSchema);
