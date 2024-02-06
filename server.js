const express = require('express')
const passport = require('passport')
const exphbs = require('express-handlebars')
const flash = require('express-flash')
const app = express()
const validator = require('validator')
const MongoStore = require('connect-mongo')
const session = require('express-session')
const connectDB = require('./config/db')
const methodOverride = require('method-override')
const path = require('path')
const logger = require('morgan')
require('dotenv').config(({ path: './config/.env'}))

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

//Express middleware - it allows for requests body to be jSON and for our CSS and JS to be served on every request
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(flash())

app.use(
    methodOverride(function(req,res) {
        if(req.body && typeof req.body === 'object' && '_method' in req.body){
            let method = req.body._method
            delete req.body._method
            return method
        }
    })
)

//handlebar helpers 
const { if_eq, if_includes } = require('./helpers/hbs')
const bodyParser = require('body-parser')

//Handlebars
app.engine('.hbs', exphbs.engine(
    {  
    helpers: {
        if_eq,
        if_includes,
    },
    defaultLayout: 'main', 
    extname: '.hbs'
}))
app.set('view engine', '.hbs')

//  Setup Sessions - stored in MongoDB
// sessions middleware 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI_STRING
    })
}))

app.use(logger('dev'))

 // Passport middleware
 app.use(passport.initialize());
 app.use(passport.session());

require('./config/passport')(passport)

//ROUTES
app.use('/', require('./routes/main'))
app.use('/post', require('./routes/post'))
app.use('/profile', require('./routes/profile'))
app.use('/search', require('./routes/search'))

const PORT = process.env.PORT || 4747

connectDB().then(app.listen(PORT, () => {
    console.log(`App running on PORT: ${PORT} better go catch it!`)
}))