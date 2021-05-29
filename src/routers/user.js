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



// router.use(express.static(path.join(__dirname, "..", "..", "..", "public")))
router.get('/', (req, res) => {
    res.cookie("token", "macks")
    res.render('index')
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// router.use(express.static(path.join(__dirname, "..", "..", "frontend")))

// router.get("/" , async (req, res) => {
//     res.sendFile(path.join(__dirname, "..", "..", "frontend", "html", "index.html"))
// })
// router.get('/users/login', async (req, res) => {

// })
router.post('/users/login', async (req, res) => {
    try {
        // res.cookie("token", "daldhaskdjahsd");
        // console.log(req.body)
        const user = await User.findByCredentials(req.body.email, req.body.password)

        // // res.send({ user, token })
        // // var email = await document.getElementById("inputEmail3")
        // // var click = await document.getElementById("click")

        // // // console.log(email)
        // // click.onclick = function() {
        // //     console.log(email.value)
        // // }

        // // console.log(typeof(token))
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

        // console.log(req.cookies.token)
        // const token1 = req.cookies.token;
        // console.log(cookie)
        // res.send(user)
        // console.log("going1")
        // window.localStorage.setItem("value1", true);
        // localStorage.setItem('token2', "token2")
        // console.log(localStorage.getItem('token'))

        // const t = localStorage.getItem('token')
        // console.log(t)
        // console.log("going2")
        // res.redirect("/tasks")
        // res.render('user')
        return
    } catch (e) {
        res.status(400).send(e)
    }

})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/users/me', auth, async (req, res) => {


    res.send(req.user)
})
router.patch('/users/me', auth, async (req, res) => {
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
router.delete('/users/me', auth, async (req, res) => {
    try {

        await req.user.remove()

        res.send(req.user)
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