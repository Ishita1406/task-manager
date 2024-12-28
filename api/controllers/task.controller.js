import Task from "../models/task.model.js"

export const createTask = async (req, res, next) => {
    try {
        const task = await Task.create(req.body);
        return res.status(201).json(task);
    } catch (error) {
        next(error);
    }
}

export const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find();
        return res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
}

export const updateTask = async (req, res, next) => {
    const task = await Task.findById(req.params.id);
    if (!task) return next(errorHandeler(404, 'Task not found!'));
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        return res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
}

export const deleteTask = async (req, res, next) => {
    const task = await Task.findById(req.params.id);
    if (!task) return next(errorHandeler(404, 'Task not found!'));
    try {
        await Task.findByIdAndDelete(req.params.id);
        return res.status(200).json('Task deleted successfully!');
    } catch (error) {
        next(error);
    }
}