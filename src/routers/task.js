const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

//create task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    console.log("reached")
    try {
        await task.save()
        // console.log(task)
        res.status(201).redirect('/test')

    } catch (e) {
        res.status(400).send(e)
    }
})
router.get('/test', async (req, res) => {
    
    res.render('user')
})

//get all tasks
router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}
    
    // console.log("1")
    if (req.query.status) {
        match.status = req.query.status === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 
    }
    // console.log("2")
    try {
        // console.log("3")
        await req.user.populate({ 
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        // console.log("reached")
        // console.log(req.user.tasks)
        // req.user.tasks.username = req.user.name
        req.user.tasks.splice(0,0,{"username":req.user.name});
        // console.log(req.user.tasks)
        res.send(req.user.tasks)
        // console.log(req.user.tasks)
    } catch (e) {

        res.status(500).send(e)
    }
})

//get one task by its id
// router.get('/tasks/:id', auth, async (req, res) =>{
//     const _id = req.params.id


//     try {
//         const task = await Task.findOne({ _id, owner: req.user._id })
//         if (!task) {
//             return res.status(404).send()
//         }
//         res.send(task)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

//update task
router.post('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedupdate = ['topic', 'status']
    const isvalidupdate = updates.every((updat) => allowedupdate.includes(updat))
    
    if (!isvalidupdate) {
        return res.status(400).send({ error: 'Invalid Updates' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }
        
        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()


        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


//delete task
router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})
module.exports = router