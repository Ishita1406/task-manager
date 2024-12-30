import React, { useState, useEffect } from 'react';

function TaskModal({ isOpen, onClose, onAddTask, currentTask }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('1');
  const [status, setStatus] = useState('PENDING');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    console.log(currentTask);
    if (currentTask) {
      setTitle(currentTask.title);
      setPriority(currentTask.priority);
      setStatus(currentTask.status);
      setStartTime(currentTask.startTime);
      setEndTime(currentTask.endTime);
    }
  }, [currentTask]);

  const handleSubmit = () => {
    if (!startTime || !endTime) {
      alert('Start Time and End Time are required!');
      return;
    }

    const task = {
      title,
      priority,
      status,
      startTime,  
      endTime,    
    };

    if (currentTask) {
      onAddTask({ ...task, id: currentTask.id });
    } else {
      onAddTask(task);
    }

    onClose();  
  };

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">
          {currentTask ? 'Edit Task' : 'Add New Task'}
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border rounded w-full p-2"
          >
            {[1, 2, 3, 4, 5].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                value="PENDING"
                checked={status === 'PENDING'}
                onChange={(e) => setStatus(e.target.value)}
              />
              Pending
            </label>
            <label>
              <input
                type="radio"
                value="COMPLETED"
                checked={status === 'COMPLETED'}
                onChange={(e) => setStatus(e.target.value)}
              />
              Completed
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {currentTask ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
