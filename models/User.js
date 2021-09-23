const mongoose = require('mongoose')

const { Schema } = mongoose

let userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            sparse: true,
        },
        userId: {
            type: String,
            unique: true,
        },
        image: {
            type: String,
            sparse: true,
        },
        provider: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('user', userSchema)
