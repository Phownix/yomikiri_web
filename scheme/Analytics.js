const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AnalyticsSchema = new Schema({
    idv4: { type: String, required: true, maxLength: 100, index: true},
    date: { type: Date, required: true, default: Date.now },
    visits:[]
});

// Export model
module.exports = mongoose.model("analytics", AnalyticsSchema);
