const mongoose = require('mongoose')

const Todoschema = new mongoose.Schema({
    text: {
        type: String,
    },
    complete: {
        type: Boolean,
        default: false
    }
})

const TodoModel = mongoose.model('Todo', Todoschema)

module.exports = TodoModel