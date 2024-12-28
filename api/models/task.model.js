import mongoose from "mongoose";
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const taskSchema = new mongoose.Schema({
    taskId: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    priority: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED'],
        default: 'PENDING',
        required: true
    }
});

taskSchema.plugin(AutoIncrement, {inc_field: 'taskId'});

const Task = mongoose.model('Task', taskSchema);
export default Task;