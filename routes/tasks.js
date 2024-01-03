const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const taskModel = require('../models/task');
const fetchuser = require('../middlewares/fetchuser');

// POST route for creating a new task
router.post('/create', fetchuser, async (req, res) => {
    try {
        let { title, description, tag, isComplete } = req.body;
        //Input Validation
        if (!title) {
            return res.status(400).json({ error: "please provide a title" });
        }
        if (!description) {
            return res.status(400).json({ error: "please provide a description" });
        }

        //check if the user that has made this request exists
        let user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ error: "please provide a valid token" });
        }

        //create the task
        let task = await taskModel.create({
            title, description, tag, isComplete,
            user: req.user.id
        });
        user.tasks.push(task._id);
        await user.save();

        // Respond with a consistent format
        res.status(201).json({ message: "Task created successfully!", success: true, task });
    } catch (error) {
        console.log("error creating task: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//GET route to fetch all tasks
router.get('/alltasks', fetchuser, async (req, res) => {
    try {
        //find the user making the request
        let user = await userModel.findById(req.user.id).populate('tasks');
        if (!user) {
            return res.status(401).json({ error: "please provide a valid token" });
        }

        //segregate the tasks of the user
        let tasks = user.tasks;

        // Respond with a consistent format
        res.status(200).json({ message: "tasks fetched successfully", tasks });
    } catch (error) {
        console.log("error fetching tasks: ", error);
        res.status(500).json({ error: "internal server error" });
    }
})

//PUT route to update a task
router.put('/update/:id', fetchuser, async (req, res) => {
    try {
        let { title, description, tag, isComplete } = req.body;
        //find the user making the request
        let user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ error: "please provide a valid token" });
        }

        //find the task to be updated
        let task = await taskModel.findOne({ _id: req.params.id });
        if (!task) {
            return res.status(404).json({ error: "no task found for the given ID" });
        }

        //check if the user who created the task is requesting the update
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "not authorized to update this task" });
        }

        //create a new updated task
        let updatedTask = {};
        if (title) {
            updatedTask.title = title;
        }
        if (description) {
            updatedTask.description = description;
        }
        if (tag) {
            updatedTask.tag = tag;
        }
        if (isComplete === true) {
            updatedTask.isComplete = true;
        }
        else{
            updatedTask.isComplete = false;
        }

        updatedTask.updatedAt = Date.now();

        //update the existing task
        task = await taskModel.findByIdAndUpdate(req.params.id, { $set: updatedTask }, { new: true });

        // Respond with a consistent format
        res.status(200).json({ message: "Task updated successfully!", success: true, task })

    } catch (error) {
        console.log("error updating task: ", error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
})

//DELETE route to delete a task
router.delete('/delete/:id', fetchuser, async (req, res) => {
    try {
        //find the user making the request
        let user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ error: "please provide a valid token" });
        }

        //find the task to be deleted
        let task = await taskModel.findOne({ _id: req.params.id });
        if (!task) {
            return res.status(404).json({ error: "No task found for the given ID" });
        }

        //check if the user who created the task is requesting the update
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized to update this task" });
        }

        //delete the task
        task = await taskModel.findByIdAndDelete(req.params.id);
        let id = task._id.toString();
        // console.log(id);

        //delete this task from the user's document
        let updatedTasks = user.tasks.filter((currTask) => {
            return currTask.toString() !== id;
        })
        user.tasks = updatedTasks;
        await user.save();

        // Respond with a consistent format
        res.status(200).json({ message: "Task deleted successfully!", success: true, task });
    } catch (error) {
        console.log("error deleting task: ", error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
})

//PUT route to mark completion of a task
router.put('/mark-completion/:id', fetchuser, async (req, res) => {
    try {
        //find the user making the request
        let user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ error: "please provide a valid token" });
        }

        //find the task to be updated
        let task = await taskModel.findOne({ _id: req.params.id });
        if (!task) {
            return res.status(404).json({ error: "no task found for the given ID" });
        }

        //check if the user who created the task is requesting the update
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "not authorized to update this task" });
        }

        //update task completion
        task.isComplete = !task.isComplete;
        task.updatedAt = Date.now();

        await task.save();

        // Respond with a consistent format
        res.status(200).json({ message: "task marked successfully", task })

    } catch (error) {
        console.log("error marking task: ", error);
        res.status(500).json({ error: "internal server error" });
    }
})

module.exports = router;