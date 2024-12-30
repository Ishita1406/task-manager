import Task from "../models/task.model.js";
import { errorHandeler } from "../utils/error.js";

export const createTask = async (req, res, next) => {
    const { title, priority, status, startTime, endTime } = req.body;

    if (!title || !priority || !status || !startTime || !endTime) {
        return next(errorHandeler(400, 'Missing required fields'));
    }

    try {
        const task = await Task.create({
            title,
            priority,
            status,
            startTime,
            endTime,
        });

        return res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

export const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find();

        const formattedTasks = tasks.map((task) => {
            const startTime = new Date(task.startTime);
            const endTime = new Date(task.endTime);

            return {
                ...task._doc,
                startDate: startTime.toISOString().split('T')[0],
                startTimeOnly: startTime.toTimeString().split(' ')[0],
                endDate: endTime.toISOString().split('T')[0],
                endTimeOnly: endTime.toTimeString().split(' ')[0], 
            };
        });

        return res.status(200).json(formattedTasks);
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    const { id } = req.params; 
    const task = await Task.findById(id);
    if (!task) return next(errorHandeler(404, 'Task not found!'));

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,  
            req.body,
            { new: true }
        );
        return res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
};


export const deleteTask = async (req, res, next) => {
    const { id } = req.params;  

    const task = await Task.findById(id);

    if (!task) return next(errorHandeler(404, 'Task not found!'));

    try {
        await Task.findByIdAndDelete(id); 

        return res.status(200).json('Task deleted successfully!');
    } catch (error) {
        next(error);
    }
};
