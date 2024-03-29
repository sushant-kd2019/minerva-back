const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const PORT = process.envPORT || 5000
const { URI, SECRET } = require('./config')
const app = express()
const AuthRoute = require('./routes/auth.routes')
const CrudRoute = require('./routes/crud.routes')
const MongoStore = require('connect-mongo')
const passport = require('./services/passport')
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
app.use('/api/roadmaps', CrudRoute)

mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to mongo database'))
    .catch((error) => console.error(error))

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))
