const mongoose = require('mongoose');
var Joi        = require('joi');
var bcrypt     = require('bcrypt');

var Schema           = mongoose.Schema;
var SALT_WORK_FACTOR = 10;

//database user schema
var userSchema = new Schema({

    name        :   {type: String, min: 3, max: 36,  required: true},
    username    :   {type: String, min: 5, max: 24,  required: true},
    password    :   {type: String, min: 8, max: 40,   required: true},
    email       :   {type: String, required: true},
    dateJoined  :   {type: Date  , required: false},

});

userSchema.pre('save', function(next)  {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt)  {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash)  {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
//validation user schema
var loginValidation = Joi.object().keys({

    username    : Joi.string().alphanum().max(24).required(),
    password    : Joi.string().max(40).required(),

});

var registerValidation = Joi.object().keys({

    username    : Joi.string().alphanum().min(4).max(24).required(),
    password    : Joi.string().min(8).max(40).required(),
    email       : Joi.string().email().max(40).required(),

});

var UserModel = mongoose.model('User' , userSchema );

module.exports.RegisterValidation = registerValidation;
module.exports.LoginValidation    = loginValidation;
module.exports.UserModel          = UserModel;
