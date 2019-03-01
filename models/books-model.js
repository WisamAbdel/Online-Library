const mongoose = require('mongoose');
var Joi        = require('joi');

var Schema  = mongoose.Schema;

//Schemas
var bookSchema = new Schema({

    Title         :   {type: String, min: 1, max: 50,  required: true},
    Author        :   {type: String, min: 1, max: 50,  required: true},
    DatePublished :   {type: Date  , required: false},
    Review        :   {type: String, min: 50, max: 500, required: true},
    Image         :   {type: String, required: false},
    Rating        :   {type: Number, min: 0, max: 5 , required: false},
    Username      :   {type: String, required: true},
    DatePosted    :   {type: Date,   required: false},

});

bookSchema.pre('save' , (next) => {
    var user = this;
    this.DatePosted = Date.now();
    next();
});

//Validations
var uploadValidation = Joi.object().keys({

    Title          : Joi.string().min(1).max(50).required(),
    Author         : Joi.string().min(1).max(50).required(),
    DatePublished  : Joi.date(),
    Review         : Joi.string().min(50).max(500),

});

var bookModel = mongoose.model('Book', bookSchema);

module.exports.uploadValidation = uploadValidation;
module.exports.bookSchema       = bookSchema;
module.exports.bookModel        = bookModel;

