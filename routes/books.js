var express   = require('express');
var router    = express.Router();
var bookModel = require('../models/books-model');
var Joi       = require('joi');
var multer    = require('multer');
var upload    = multer({dest : 'uploads/'});


router.get( '/' ,
    ( req , res ) => {
        req.flash('info' , 'This works.')
        res.redirect('/books/dashboard');
    }
);

router.get( '/dashboard' ,
    ( req , res ) => {
        if ( req.isAuthenticated() ){
        res.render( './books/index');
        } else {
            req.flash('message' , 'Please login before continuing');
            res.redirect('/users/login')
        }
    }
);

router.post('/upload-test' , upload.single('bookThumbnail') ,( req , res ) => {

    if(req.file) {
        console.log(req.file.filename);
    }
});
router.post('/upload' , upload.single('bookThumbnail') , ( req , res ) => {
    if( req.isAuthenticated() ){

        //grab data from POST
        const { bookTitle , bookAuthor , datePublished , bookReview  } = req.body;
        
        //handle image upload if any
        if(req.file) {
            console.log(`We got a file. Name: ${req.file.filename}`);
        }
        
        //validation
        let error = null;
        let result = Joi.validate({
            Title         : bookTitle,
            Author        : bookAuthor,
            DatePublished : datePublished,
            Review        : bookReview,
        }, bookModel.uploadValidation, (err) => {
            if(err) {
                error = err['details'][0]['message'];
                res.status(405).send(err);
            } else {
                //validation successful, add to DB
                res.status(200).send('upload successful');
            }
        });

    } else {
        res.status(403);
    }

});


module.exports = router;