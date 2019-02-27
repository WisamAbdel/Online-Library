var express         = require('express');
var Joi             = require('joi');
var router          = express.Router();
var userModel       = require('../models/users-model');
var userController  = require('../views/users');
var passport        = require('passport');


router.get('/login',
    ( req , res ) => {

        let message = req.flash('message').toString();
        return res.render('./users/login.html' , { message : message });
        
    }
);

router.post('/login',
    ( req , res , next) => {
        if (req.isAuthenticated() ) return res.redirect('/books') 

        //validation
        let { username , password } = req.body;
        let error = null;
        let  validation = Joi.validate({
            username, password} ,userModel.LoginValidation , ( err, value ) => {
                if(err) {
                    error = err['details'][0]['message'];
                    return res.render('./users/login.html', {error : error , username: username});

                } else {
                    //if validation is successful. Authenticate.
                    passport.authenticate('local' , {
                        successRedirect: '/books/dashboard' ,
                        failureRedirect: '/users/login' ,
                        failureFlash   : req.flash('message' , 'invalid username or password'),
                    })(req , res , next);
                }
            });

    }
)

router.get('/register',
    ( req , res ) => {
        res.render('./users/register.html');
    }
);

router.post('/register',
    ( req , res ) => {
        let { username , password , password2 , email} = req.body;
        let error = null;
        let validation = Joi.validate({
            username , password , email} , userModel.RegisterValidation , (err , value) => {
                if(err) {
                    error = err['details'][0]['message'].toString().replace('"','');
                    res.render('./users/register.html', {error : error , username : username , email : email});

                } else {
                    if( password !== password2 ){
                        error = "Passwords do not match";
                        res.render('./users/register.html', {error : error , username : username , email : email});

                    }
                    //if validation is successful. Register account.
                    userController.registerAccount(email , username , password , (err, user) =>
                    {
                        if(err){
                            res.render('./users/register.html', {error : err , username : username , email : email});
                        } else {
                            req.flash('message' , 'account creation successful');
                            res.redirect('/users/login');

                        }
                    })
                }
            });
        }
);
module.exports = router;
