const passport = require('passport')
const GithubStrategy = require('passport-github2')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
} = require('../config')

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    try {
        let user = await User.findById(id, 'name email _id')
        done(null, user)
    } catch (error) {
        done(error, null)
    }
})

passport.use(
    new GithubStrategy(
        {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: GITHUB_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOne({ userId: profile.id })

                if (user) {
                    return done(null, user)
                } else {
                    console.log(profile)
                    const newUser = new User({
                        username: profile.username,
                        email: profile._json.email,
                        name: profile.displayName,
                        userId: profile.id,
                        image: profile._json.avatar_url,
                        provider: 'Github',
                    })

                    const savedUser = await newUser.save()

                    done(null, savedUser)
                }
            } catch (error) {
                done(error)
            }
        },
    ),
)

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5000/api/auth/google/callback',
            passReqToCallback: true,
        },
        async (request, accessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOne({ userId: profile.id })
                if (user) {
                    return done(null, user)
                } else {
                    console.log(profile)
                    const newUser = new User({
                        username: profile.displayName,
                        email: profile._json.email,
                        name: profile.displayName,
                        userId: profile.id,
                        image: profile._json.picture,
                        provider: 'Google',
                    })

                    const savedUser = await newUser.save()

                    done(null, savedUser)
                }
            } catch (error) {
                done(error)
            }
        },
    ),
)
module.exports = passport
