const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    githubId: Number
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);