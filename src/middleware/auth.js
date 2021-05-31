const jwt = require('jsonwebtoken')
const User = require('../models/user')

// if (typeof localStorage === "undefined" || localStorage === null) {
//     var LocalStorage = require('node-localstorage').LocalStorage;
//     localStorage = new LocalStorage('./scratch');
//   }

const express = require('express');
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

const auth = async (req, res, next) => {


    try {
        // console.log(`this is my token ${document.cookie}`);
        // const token = "ayush"
        const token = req.header('Cookie').replace("token=", "");
        // console.log(tokn)
        // const token = localStorage.getItem('token')
        // const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()

    } catch (e) {

        res.status(401).send({ error: 'please authenticate' })
    }
}

module.exports = auth