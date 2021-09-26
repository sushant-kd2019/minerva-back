if (process.env.NODE_ENV === 'production') {
    console.log("HEEE")
    module.exports = require('./prod')
} else {
    
    module.exports = require('./dev')
}
