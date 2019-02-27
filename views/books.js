const mongoose  = require('mongoose');
const bookModel = require('../models/books-model');


var addBook = function (bookTitle, bookAuthor, datePublished, bookReview, imageName ,username) {
    //create the model to add to db
    var book = new bookModel.bookModel( {
        Title         : bookTitle,
        Author        : bookAuthor,
        datePublished : datePublished,
        Review        : bookReview,
        Image         : imageName,
        Rating        : 0,
        Username      : username,
    });

    //attempt to save to db
    book.save ( (err) => {
            if(err) return err;
    })
}