var express        = require('express');
var router         = express.Router();
var bookModel      = require('../models/books-model');
var bookController = require('../views/books');
var Joi            = require('joi');
var multer         = require('multer');
var path           = require('path');
var upload         = multer({ dest   : 'uploads/' , 
                         limits : { fileSize : 2000000 }});


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


router.post('/upload' , upload.single('bookThumbnail') , ( req , res ) => {
    if( req.isAuthenticated() ){

        //grab data from POST
        const { bookTitle , bookAuthor , datePublished , bookReview  } = req.body;
        var file_name = '';
        //handle image upload if any
        if(req.file) {
            //file format handle
            let valid_file_formats = ['.png' ,'.jpg' , '.jpeg'];
            if(valid_file_formats.indexOf(path.extname(req.file.originalname).toLowerCase()) == -1) {
                return res.status(405).send('Invalid file format. ( jpeg, png, jpg ) only.');
            } else {
                file_name = req.file.filename;
            }
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
                bookController.addBook(
                    bookTitle,
                    bookAuthor,
                    datePublished,
                    bookReview,
                    file_name,
                    req.user.username,
                    ( err ) => {
                        if( err ) {
                            //db fail to add
                            console.log(err);
                            return res.status(500).send('Backend error. Contact developer');
                        } else {
                            return res.status(200).send('Book added.');

                        }
                    }
                );
            }
        });

    } else {
        res.status(403);
    }

});


module.exports = router;