var Roadmapsdb = require('../models/Roadmap')
var Forked_Roadmapsdb = require('../models/Forked_Roadmap')
var Starsdb = require('../models/Stars')

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: 'Content can not be emtpy!' })
        return
    }
    if (!req.user) {
        return res.status(401).json({
            isLoggedIn: false,
            message: 'User is not logged in.',
            user: {
                name: '',
                avatar: '',
            },
        })
    }

    const roadmap = new Roadmapsdb({
        name: req.body.name,
        createdBy: req.user.name,
        description: req.body.description,
    })
    roadmap
        .save(roadmap)
        .then((data) => {
            res.status(200).send({ message: 'Roadmap created.' })
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Error occured while creating roadmap.',
            })
        })
}

exports.find = (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            isLoggedIn: false,
            message: 'User is not logged in.',
            user: {
                name: '',
                avatar: '',
            },
        })
    }
    if (req.query.userId) {
        const userId = req.query.userId
        let type
        if (req.query.type) {
            type = req.query.type // created/forked
        } else {
            type = 'created'
        }

        let query = {}
        if (type == 'forked') {
            query = { forkedBy: userId }
            Forked_Roadmapsdb.find(query)
                .then((data) => {
                    if (!data) {
                        res.status(404).send({
                            message:
                                'No roadmaps found for user with  userId ' +
                                userId,
                        })
                    } else {
                        res.send(data)
                    }
                })
                .catch((err) => {
                    res.status(500).send({
                        message:
                            'Error retrieving roadmaps created by ' + userId,
                    })
                })
        } else {
            query = { createdBy: userId }
            Roadmapsdb.find(query)
                .then((data) => {
                    if (!data) {
                        res.status(404).send({
                            message:
                                'No roadmaps found for user with  userId ' +
                                userId,
                        })
                    } else {
                        res.send(data)
                    }
                })
                .catch((err) => {
                    res.status(500).send({
                        message:
                            'Error retrieving roadmaps created by ' + userId,
                    })
                })
        }
    } else {
        Roadmapsdb.find({})
            .sort({ createdAt: -1 })
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        'Error Occurred while retriving roadmaps.',
                })
            })
    }
}

exports.update = (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            isLoggedIn: false,
            message: 'User is not logged in.',
            user: {
                name: '',
                avatar: '',
            },
        })
    }

    if (!req.body) {
        return res
            .status(400)
            .send({ message: 'Data to update can not be empty' })
    }

    const roadmapId = req.params.roadmapId
    Roadmapsdb.findByIdAndUpdate(roadmapId, req.body, {
        useFindAndModify: false,
    })
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot Update roadmap with ${roadmapId}.`,
                })
            } else {
                res.send(data)
            }
        })
        .catch((err) => {
            res.status(500).send({ message: 'Error in updating roadmap.' })
        })
}

exports.delete = (req, res) => {
    // if (!req.user) {
    //     return res.status(401).json({
    //         isLoggedIn: false,
    //         message: 'User is not logged in.',
    //         user: {
    //             name: '',
    //             avatar: '',
    //         },
    //     })
    // }

    const roadmapId = req.params.roadmapId

    Roadmapsdb.findByIdAndDelete(roadmapId)
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot Delete roadmap with roadmapId ${roadmapId}.`,
                })
            } else {
                res.send({
                    message: 'Roadmap was deleted successfully!',
                })
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Could not delete Roadmap with roadmapId=' + roadmapId,
            })
        })
}

exports.fork = (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            isLoggedIn: false,
            message: 'User is not logged in.',
            user: {
                name: '',
                avatar: '',
            },
        })
    }

    const roadmapId = req.params.roadmapId
    Roadmapsdb.findById(roadmapId)
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: 'No roadmaps found for roadmapId ' + roadmapId,
                })
            } else {
                const forked_roadmap = new Forked_Roadmapsdb({
                    name: data.name,
                    createdBy: data.createdBy,
                    originalRoadmapId: data._id,
                    forkedBy: 'Hello',
                    description: data.description,
                    starCount: data.starCount,
                    forkCount: data.forkCount + 1,
                })
                forked_roadmap.save(forked_roadmap).then((d) => {
                    console.error(data._id)
                    Roadmapsdb.findByIdAndUpdate(
                        data._id,
                        {
                            $inc: { forkCount: 1 },
                        },
                        (err, brote) => {
                            // callback
                            console.log(brote)
                        },
                    )
                    res.status(200).send({ message: 'Roadmap forked.' })
                })
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Could not fork Roadmap with roadmapId=' + roadmapId,
            })
        })
}

exports.search = (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            isLoggedIn: false,
            message: 'User is not logged in.',
            user: {
                name: '',
                avatar: '',
            },
        })
    }
    let q
    if (req.query.q) q = req.query.q
    else q = ''
    console.log(q)
    Roadmapsdb.find(
        {
            $or: [
                {
                    name: { $regex: `.*${q}.*` },
                },
                { description: { $regex: `.*${q}.*` } },
            ],
        },
        (err, lol) => {
            console.error(lol)
            res.send(lol)
        },
    )
        .sort({ createdAt: -1 })
        .then((data) => {
            console.log(data)
            if (!data) {
                res.status(404).send({ message: 'No roadmaps found.' })
            } else {
                res.send(data)
            }
        })
        .catch((err) => {
            res.status(500).send({ message: err })
        })
}

exports.star = (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            isLoggedIn: false,
            message: 'User is not logged in.',
            user: {
                name: '',
                avatar: '',
            },
        })
    }
    Starsdb.findOne({
        roadmapId: req.params.roadmapId,
        userId: 'nope',
    }).then((data) => {
        if (!data) {
            const star = new Starsdb({
                roadmapId: req.params.roadmapId,
                userId: 'nope',
            })
            star.save(star)
                .then((d) => {
                    Roadmapsdb.findByIdAndUpdate(
                        { _id: req.params.roadmapId },
                        {
                            $inc: { starCount: 1 },
                        },
                        (err, brote) => {
                            // callback
                            console.log(brote)
                        },
                    )

                    res.status(200).send({ message: 'Starred.' })
                })
                .catch((err) => {
                    res.status(500).send({
                        message:
                            err.message ||
                            'Error occured while trying to star.',
                    })
                })
        } else {
            Starsdb.findByIdAndDelete(data._id)
                .then((d) => {
                    Roadmapsdb.findByIdAndUpdate(
                        { _id: req.params.roadmapId },
                        {
                            $inc: { starCount: -1 },
                        },
                        (err, brote) => {
                            // callback
                            console.log(brote)
                        },
                    )
                    res.status(200).send({ message: 'Unstarred.' })
                })
                .catch((err) => {
                    res.status(500).send({
                        message:
                            err.message ||
                            'Error occured while trying to star.',
                    })
                })
        }
    })
}
