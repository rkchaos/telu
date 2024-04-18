const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const admin_Schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
      default:"admin"
    },
    gender: {
        type: String,
        required: true
    },
    
});
admin_Schema.plugin(passportLocalMongoose);

const Admin = mongoose.model('Admin', admin_Schema);
module.exports = Admin;
