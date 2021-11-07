const mongoose = require('mongoose')

const { Schema } = mongoose

let forkedRoadmapSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        createdBy: {
            type: String,
            required: true
        },
        originalRoadmapId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        forkedBy: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
        },
        starCount: {
            type: Number,
            default: 0
        },
        forkCount:{
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('forked_roadmaps', forkedRoadmapSchema)