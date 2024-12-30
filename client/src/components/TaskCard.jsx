import React from 'react'

function TaskCard({ task, onDelete, onEdit }) {
  return (
    <div className="bg-white drop-shadow-lg w-full sm:w-[300px] rounded-md">
        <h1 className='text-purple-600 font-semibold text-xl my-4 mx-2'>{task.title}</h1>
        <div className="flex justify-between my-4 mx-6">
            <button>{task.status}</button>
            <h1>Priority: {task.priority}</h1>
        </div>
        <div className="flex justify-between my-6 mx-8">
            <div className="">
                <h1 className='font-semibold text-gray-700'>Start</h1>
                <h1 className='text-slate-600'>{task.startDate}</h1>
                <h1 className='text-slate-600'>{task.startTimeOnly}</h1>
            </div>
            <div className="">
                <h1 className='font-semibold text-gray-700'>End</h1>
                <h1 className='text-slate-600'>{task.endDate}</h1>
                <h1 className='text-slate-600'>{task.endTimeOnly}</h1>
            </div>
        </div>
        <hr className='border-gray-300'></hr>
        <div className="flex justify-between bg-gray-100 p-4">
            <h1 onClick={() => onEdit(task)} className="cursor-pointer text-blue-500">Edit</h1>
            <h1 onClick={() => onDelete(task._id)} className="cursor-pointer text-red-500">Delete</h1>
        </div>
    </div>
  )
}

export default TaskCard