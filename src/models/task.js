const mongoose = require('mongoose')
// const validator = require('validator')


const taskSchema = new mongoose.Schema({
    topic: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: String,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})
const Tasks = mongoose.model('task', taskSchema)

module.exports = Tasks