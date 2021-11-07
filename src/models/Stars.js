const mongoose = require('mongoose')

const { Schema } = mongoose

let starSchema = new Schema(
    {
        roadmapId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        userId: {
            type: String,
            required: true
        }

    })

module.exports = mongoose.model('stars', starSchema)
