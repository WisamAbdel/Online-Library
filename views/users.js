const mongoose  = require('mongoose');
const userModel = require('../models/users-model');

var user_model =  userModel.UserModel;



const registerAccount =  (email, username, password, callback) => {
    //check if user exists
    user_model.findOne({
        username    :   username
    }, (err, existingUser)  => {
        if(err){
            console.log(err);
        } else {
            if ( existingUser ){
            callback(err="user already exists");
            } else {
                const user = new user_model({
                    name     :  'name' + username,
                    username : username.toLowerCase(),
                    password : password,
                    email    : email,
                });
                user.save().then( () => callback(null, user));
            }
        }
    })
};

module.exports.registerAccount   = registerAccount;
