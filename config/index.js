if (process.env.NODE_ENV === 'production') {
    
    module.exports = require('./prod')
    console.log(process.env.SECRET)
} else {
    
    module.exports = require('./dev')
}
