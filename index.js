const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const PORT = process.envPORT || 5000
const { URI, SECRET } = require('./config')
const app = express()
const AuthRoute = require('./routes/AuthRoutes')
const MongoStore = require('connect-mongo')
const passport = require('./services/passport')
require('dotenv').config();
app.use(express.json())
app.use(
    session({
        secret: SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: URI,
            autoRemove: 'interval',
            autoRemoveInterval: 10,
        }),
    }),
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', AuthRoute)

mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to mongo database'))
    .catch((error) => console.error(error))

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))
