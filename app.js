//imports
var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var logger       = require('morgan');


//added imports
const expressNunjucks = require('express-nunjucks');
const mongoose        = require('mongoose');
const session         = require('express-session');
const passport        = require('passport');
const flash           = require('express-flash');



//database setup + connection
mongoose.connect(
    'mongodb://localhost:27018/localLibrary' ,  {useNewUrlParser: true}
).then( 
    ()    => {console.log('Database connection successful.') },
    (err) => {console.log(`Database FAILED to connect: ${err}`) }
    );

//routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var booksRouter = require('./routes/books');


var app = express();
const isDev = app.get('env') === 'development';

//~--middleware--~
//nunjucks
app.set('views', __dirname + '/templates');
const njk = expressNunjucks(app, {
    watch: isDev,
    noCache: isDev
});

//express-session
app.use( session({
    secret          : 'ABC12345',
    resave           : true,
    saveUninitialized: true,

}));

//passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

//flash
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/'      , indexRouter);
app.use('/users' , usersRouter);
app.use('/books' , booksRouter);

module.exports = app;
