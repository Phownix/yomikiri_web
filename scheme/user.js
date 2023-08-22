const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    idv4: { type: String, required: true, maxLength: 100, index: true},
    username: { type: String, required: true, maxLength: 100 },
    password: { type: String, required: true, maxLength: 100 },
    admin: {type: Boolean, default: false },
    
    last_login: { type: Date, required: true, default: Date.now },
    created: { type: Date, required: true, default: Date.now },
    
    image: { type: String },
    status: { type: String, default: "online" },

    rol: [],
    addedManga: [],
    notifications: [],

    verification_id: { type: Number },
    verified: { type: Boolean },
});

UserSchema.static('findByIdv4', function(idv4) { 
    let ca = this.findOne({ idv4: idv4 })
    return ca;
});

// Export model
module.exports = mongoose.model("Users", UserSchema);
