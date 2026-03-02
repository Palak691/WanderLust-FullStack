const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const passportLocalMongoose = require('passport-local-mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default;
// passport-local-mongoose → helps with authentication (username, password, hashing, login, etc.)

const userSchema = new Schema({
    email : {
        type : String,
        required : true
    }
});
//It automatically adds: username, email, password
userSchema.plugin(passportLocalMongoose);
module.exports  = mongoose.model("User", userSchema);
//hashing algorithum used - pbkdf2
// (Password-Based Key Derivation Function 2)