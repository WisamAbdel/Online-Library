const LocalStrategy = require('passport-local').Strategy;
const mongoose      = require('mongoose');
const bcrypt        = require('bcrypt');
const User          = require('../models/users-model');

var SALT_WORK_FACTOR = 10;
module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField : 'username' },
        (username , password , done) => {
            //search for user
            User.UserModel.findOne( {username : username.toLowerCase()} )
            .then(user => {
                if(!user) {
                    return done(null, false, {message : 'User does not exist.'})
                }
                //If user found, verify password via bcrypt
                bcrypt.compare(password ,  user.password, (err, isMatch) => {
                    if(err) console.log(err);
                    if(!isMatch) return done(null , false , {message : 'Incorrect password for user.'})
                    //correct password
                    done(null , user);
                });
            })
            .catch(err => console.log(err))
        })
    );

    passport.serializeUser( (user , done ) => {
        done(null , user.id)
    });
    passport.deserializeUser( (id , done) => {
        User.UserModel.findById( id , (err , user ) => {
            done( err , user );
        })
    });

}