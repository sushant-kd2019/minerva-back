const express = require('express')
const passport = require('passport')

const {
    getUserController,
    githubLoginController,
    LogoutController,
    googleLoginController,
} = require('../controllers/AuthController')

const router = express.Router()

router.get('/logout', LogoutController)

router.get('/me', getUserController)

router.get(
    '/github',
    passport.authenticate('github', { scope: ['read:user', 'user:email'] }),
)

router.get(
    '/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/',
        failureMessage: 'some error occured',
    }),
    githubLoginController,
)

router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['email', 'profile'],
    }),
)

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/',
        failureMessage: 'Error occured',
    }),
    googleLoginController,
)

module.exports = router
