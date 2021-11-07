const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const GithubStrategy = require('passport-github2')
const User = require('../models/User')
const config = require('../config')

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser(async (user, done) => {
    console.log(user)
    let id = user.id
    let checkUser = await User.findOne({ id: id }).catch((err) => {
        console.log('Cannot deserialize', err)
        done(err, null)
    })

    if (checkUser) {
        console.log('done')
        done(null, checkUser)
    }
})

passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOne({ id: profile.id })

                if (user) {
                    return done(null, user)
                } else {
                    console.log(profile)
                    const newUser = new User({
                        username: profile.username,
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        id: profile.id,
                        avatar: profile.photos[0].value,
                        provider: 'Github',
                    })
                    try {
                        const savedUser = await newUser.save()

                        done(null, savedUser)
                    } catch (err) {
                        console.error(err)
                    }
                }
            } catch (error) {
                console.error(error)
                done(error)
            }
        },
    ),
)

// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: config.GOOGLE_KEY.CLIENT_ID,
//             clientSecret: config.GOOGLE_KEY.CLIENT_SECRET,
//             callbackURL: `${config.SERVER_URL}/api/auth/google/callback`,
//             passReqToCallback: true,
//         },
//         async (req, accesToken, refreshToken, profile, done) => {
//             try {
//                 const user = await User.findOne({ id: profile.id })
//                 if (user) {
//                     return done(null, user)
//                 } else {
//                     const newUser = new User({
//                         username: profile.displayName,
//                         email: profile.emails[0].value,
//                         avatar: profile.photos[0].value,
//                         id: profile.id,
//                         provider: 'Google',
//                     })

//                     const saveUser = await newUser.save()
//                     done(null, saveUser)
//                 }
//             } catch (err) {
//                 done(err)
//             }
//         },
//     ),
// )

module.exports = passport
