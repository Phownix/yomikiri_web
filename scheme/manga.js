const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MangaSchema = new Schema({
    idv4: { type: String, required: true, maxLength: 100, index: true},
    user_id: { type: String, required: true, maxLength: 100 },
    
    // basico
    name: { type: String, required: true, maxLength: 100, index: true},
    artist: { type: String },
    type: { type: String, required: true, maxLength: 100 },
    description: { type: String },
    
    url_img: { type: String },

    // dates
    created: { type: Date, default: Date.now},
    update: { type: Date, default: Date.now},

    // clasificacion
    tags:[],
    categorie: [],
    qualification: [],
    visits: { type: Number, default: 0},
    nsfw: { type: Boolean, default: false },
    
    // show
    images: [],


    // more
    visible: { type: Boolean, default: true},
    server: {
        name: { type: String, default: 'Server Default'},
        server: { type: String, default: process.env.SERVER }
    }
});

// Export model
module.exports = mongoose.model("Mangas", MangaSchema);
