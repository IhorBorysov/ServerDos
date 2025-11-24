const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const exphbs = require('express-handlebars')
const session = require('express-session')
const varsMiddleware = require('./middleware/vars');
const doserRoutes = require('./routes/doser')
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const variablesMiddleware = require('./middleware/variables');

const PORT = process.env.PORT || 3000

const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views','views')

app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))


app.use(session({
    secret: 'super secret key for session', 
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } 
}));


app.use(varsMiddleware);
app.use(variablesMiddleware);

app.use(authRoutes);

app.use(doserRoutes)

async function connectDB() {
    if (mongoose.connection.readyState === 0) { 
        try {
            const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://ibuser:qwerzxc149@cluster0.k4sxvyl.mongodb.net/?appName=Cluster0';
            await mongoose.connect(mongoUri);
            console.log("MongoDB connected successfully.");
        } catch (e) {
            console.error("MongoDB connection failed:", e);
        }
    }
}

async function star() {
    try{
        await mongoose.connect('mongodb+srv://ibuser:qwerzxc149@cluster0.k4sxvyl.mongodb.net/?appName=Cluster0')
        module.exports = app;
        app.listen(PORT, () => {
            console.log(`Server has been star: http://localhost:${PORT}`)
        })
        
    } catch (e) {
        console.log(e)
    }
}

const db = mongoose.connection

db.on('error', (err) => {
    console.error(' Помилка підключення MongoDB:', err)
})

db.once('open', () => {
    console.log(' Mongoose успішно підключено до DB!')
})
module.exports = {
    app,
    connectDB 
};
star()