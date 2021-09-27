require('dotenv').config()

const DB = {
    URI: process.env.URI,
}

const GITHUB_KEY = {
    CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    CLIENT_SECRET: process.env.GITHUB_SECRET,
}

const GOOGLE_KEY = {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_SECRET,
}

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000'

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

const COOKIE_SECRET = process.env.COOKIE

module.exports = {
    DB,
    GITHUB_KEY,
    GOOGLE_KEY,
    SERVER_URL,
    CLIENT_URL,
    COOKIE_SECRET,
}
