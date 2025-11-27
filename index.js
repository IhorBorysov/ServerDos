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
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://ibuser:qwerzxc149@cluster0.k4sxvyl.mongodb.net/?retryWrites=true&w=majority';

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views','views')

app.use(express.urlencoded({extended: true}))
app.use(express.json());
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
app.use(doserRoutes);

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server started: http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

start()