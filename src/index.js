const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const PORT = process.env.PORT || 5000
const cors = require('cors')
const app = express()
const AuthRoute = require('./routes/auth.routes')
const CrudRoute = require('./routes/crud.routes')
const passport = require('./services/passport')
const config = require('./config')
app.use(express.json())
app.use(
    cors({
        origin: [config.CLIENT_URL, config.SERVER_URL],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type',
        credentials: true,
    }),
)
app.use(
    session({
        secret: config.COOKIE_SECRET,
        name: 'minerva',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: true,
            httpOnly: true,
            // 2nd change.
            secure: false,
        },
    }),
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', AuthRoute)
app.use('/api/roadmaps', CrudRoute)

mongoose
    .connect(config.DB.URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to mongo database'))
    .catch((error) => console.error(error))

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))
