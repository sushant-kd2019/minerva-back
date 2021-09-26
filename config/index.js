if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod')
} else {
    console.log("HEEE")
    module.exports = require('./dev')
}
