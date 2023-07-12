const express = require('express')
const router = express.Router()
const Idea = require('../models/Idea')

// get all ideas
router.get('/', async (req, res) => {
    try {
        const ideas = await Idea.find()
        res.json({ success: true, data: ideas })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: 'Something Went Wrong' })
    }
})

// get single idea
router.get('/:id', async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id)
        res.json({ success: true, data: idea })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: 'Something Went Wrong' })
    }
})

// add an idea

router.post('/', async (req, res) => {
    const idea = new Idea({
        text: req.body.text,
        tag: req.body.tag,
        username: req.body.username,
    })

    try {
        const saveidea = await idea.save()
        res.json({ success: true, data: saveidea })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: 'Something Went Wrong' })
    }
})

// update idea
router.put('/:id', async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id)
        // if matches user name
        if (idea.username === req.body.username) {
            const updatedIdea = await Idea.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        text: req.body.text,
                        tag: req.body.tag,
                    },
                },
                { new: true }
            )
            return res.json({ success: true, data: updatedIdea })
        }
        //  if username names do not match
        res.status(403).json({ success: false, error: 'You are not Authorized to Update this Username' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: 'Something Went Wrong' })
    }
})

// delete idea

router.delete('/:id', async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id)

        // if matches username
        if (idea.username === req.body.username) {
            await Idea.findByIdAndDelete(req.params.id)
            return res.json({ success: true, data: {} })
        }

        //  if  dont not matches username
        res.status(403).json({ success: false, error: 'You are not Authorized to delete this Username' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: 'Something Went Wrong' })
    }
})

module.exports = router
