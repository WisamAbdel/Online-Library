const LocalStrategy = require('passport-local').Strategy;
const mongoose      = require('mongoose');
const bcrypt        = require('bcrypt');
const User          = require('../models/users-model');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField : 'username' },
        (email , password , done) => {
            //search for user
            User.findOne( {username : username} )
            .then(user => {
                if(!user) {
                    return done(null, false, {message : 'User does not exist.'})
                }
                //If user found, verify password via bcrypt
                bcrypt.compare(user.password , password , (err, isMatch) => {
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
        User.findById( id , (err , user ) => {
            done( err , user );
        })
    });

}