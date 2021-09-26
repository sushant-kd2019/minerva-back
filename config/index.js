if (process.env.NODE_ENV === 'production') {
    
    module.exports = require('./prod')
    console.log(process.env.SECRET)
    console.log(process.env.URI)
    console.log(process.env.GITHUB_CLIENT_ID)
    console.log(process.env.GITHUB_CLIENT_SECRET)
    console.log(process.env.GITHUB_CALLBACK_URL)
    console.log(process.env.GOOGLE_CLIENT_ID)
    console.log(process.env.GOOGLE_CLIENT_SECRET)
} else {
    
    module.exports = require('./dev')
}
