const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const TodoModel = require('./modals/TodoModals')

const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())


/// GET
app.get('/todos', async(req, res) => {
    const todos = await TodoModel.find()
    res.json(todos)
})

/// CREATE
app.post('/todos', async(req, res) => {
    const {text} = req.body
    const todo = new TodoModel({
        text,
    })
    const newTodo = await todo.save()
    res.json(newTodo)
})

/// UPDATE
app.put('/todos/:id', async(req, res) => {
    const {id} = req.params
    const todo = await TodoModel.findById(id)
    todo.text = req.body.text
    todo.complete = req.body.complete
    await todo.save()
    res.json(todo)
})


/// DELETE ALL
app.delete('/todos/all', async(req, res) => {
    await TodoModel.deleteMany({ complete: false})
    res.send('Delete successful')
})

/// DELETE ALL TEXT NO VALUE
app.delete('/todos/deleteNoTxt', async (req, res) => {
    try {
        // Assuming you have a Mongoose model named TodoModel
        const result = await TodoModel.deleteMany({ text: { $exists: false } });

        if (result.deletedCount > 0) {
            res.send('Delete successful');
        } else {
            res.status(404).send('No todos with missing text found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



/// DELETE
app.delete('/todos/:id', async(req, res) => {
    const {id} = req.params
    await TodoModel.deleteOne({_id: id})
    res.send('Delete successful')
})




mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Starting on port 8080')
    app.listen(8080)
})


