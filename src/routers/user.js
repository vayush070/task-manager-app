const { response } = require('express')
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')

// const localStorage = require('localStorage')
const sharp = require('sharp')
const path = require('path')
// const localStorage = require('node-localstorage')
const { Script } = require('vm')

router.use(express.json());
router.use(express.urlencoded({ extended: true }));




router.get('/', (req, res) => {
    res.clearCookie('token')
    res.render('index')
})
router.get('/profile', auth, (req, res) => {
    res.render('profile')
})
router.get('/signup', (req, res) => {
    res.render('signup')
})
router.get('/about', (req, res) => {
    res.render('about')
})
router.get('/contact', (req, res) => {
    res.render('contact')
})
router.get('/services', (req, res) => {
    res.render('service')
})
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    if (!user) {
        console.log("NO user")
    }
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.cookie("token", token, {
            // expires: new Date(Date.now() + 900000)
            // httpOnly: true
        })
        res.redirect("/test")
    } catch (e) {
        res.status(400).render('signup', {
            error: "Email already exists"
        })
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if (!user) {
            throw new Error()
        }
        if (user) {
            const token = await user.generateAuthToken()
            res.cookie("token", token, {
                // expires: new Date(Date.now() + 900000)
                // httpOnly: true
            }).send()
        }
        return
    } catch (e) {
        res.status(400).send(e)
    }

})

router.get('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.redirect("/")
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()

        res.redirect("/")
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/users/me', auth, async (req, res) => {


    res.send(req.user)
})
router.post('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedupdate = ['name', 'age', 'password', 'email']
    const isvalidupdate = updates.every((updat) => allowedupdate.includes(updat))

    if (!isvalidupdate) {
        return res.status(400).send({ error: 'Invalid Updates' })
    }

    try {

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.post('/users/deleteaccount', auth, async (req, res) => {
    try {

        await req.user.remove()

        res.send("deleted")
    } catch (e) {
        res.status(400).send(e)
    }
})
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})
module.exports = router