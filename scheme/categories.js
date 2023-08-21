const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
    idv4: { type: String, required: true, maxLength: 100, index: true },
    name: { type: String, required: true, maxLength: 100 },
    nsfw: { type: Boolean },
    visible: { type: Boolean },
});


// Virtual for author's URL
CategoriesSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/cat/${this.idv4}`;
});

// Export model
module.exports = mongoose.model("Categories", CategoriesSchema);
