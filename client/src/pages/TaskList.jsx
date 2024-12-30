import React, { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) {
    return { formattedDate: '', formattedTime: '' }; 
  }

  const formattedDate = date.toISOString().split('T')[0]; 
  const formattedTime = date.toTimeString().split(' ')[0]; 

  return { formattedDate, formattedTime };
};

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/task/get', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await res.json();
        setTasks(data); 
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    let updatedTasks = [...tasks]; 

    if (filterStatus) {
      updatedTasks = updatedTasks.filter((task) => task.status === filterStatus);
    }

    if (filterPriority) {
      updatedTasks = updatedTasks.filter((task) => task.priority === parseInt(filterPriority));
    }

    if (sortOption === 'Start time: ASC') {
      updatedTasks.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    } else if (sortOption === 'Start time: DESC') {
      updatedTasks.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    } else if (sortOption === 'End time: ASC') {
      updatedTasks.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
    } else if (sortOption === 'End time: DESC') {
      updatedTasks.sort((a, b) => new Date(b.endTime) - new Date(a.endTime));
    }

    setFilteredTasks(updatedTasks);
  }, [tasks, filterStatus, filterPriority, sortOption]);

  const handleAddTask = async (newTask) => {
    try {
      const res = await fetch('/api/task/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error Response:', errorData);
        throw new Error('Failed to add task');
      }

      const savedTask = await res.json();
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, savedTask];
        setFilteredTasks(updatedTasks);
        return updatedTasks;
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding task:', error);
      alert(error.message || 'An error occurred while adding the task.');
    }
  };

  const handleEditTask = async (taskData) => {
    if (!taskData || !taskData._id) {
      console.error('Invalid task data:', taskData);
      return;
    }
  
    try {
      const res = await fetch(`/api/task/update/${taskData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error Response:', errorData);
        throw new Error('Failed to edit task');
      }
  
      const updatedTask = await res.json();
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
        setFilteredTasks(updatedTasks);
        return updatedTasks;
      });
  
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error editing task:', error);
      alert(error.message || 'An error occurred while editing the task.');
    }
  };
  

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`/api/task/delete/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="m-6 p-5">
      <h1 className="font-extrabold text-gray-800 text-3xl mb-4">Task List</h1>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          }}
          className="bg-transparent text-purple-600 border border-purple-600 rounded hover:bg-purple-600 hover:text-white py-2 px-4"
        >
          Add task
        </button>
        <div className="flex gap-4">
          <div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-beige text-center p-2 border-slate-500 appearance-none focus:outline-none w-24"
            >
              <option value="" className="hidden">
                Sort
              </option>
              <option value="Start time: ASC">Start time: ASC</option>
              <option value="Start time: DESC">Start time: DESC</option>
              <option value="End time: ASC">End time: ASC</option>
              <option value="End time: DESC">End time: DESC</option>
              <option className="text-red-500" value="">
                Remove Sort
              </option>
            </select>
          </div>
          <div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-transparent text-left border-slate-500 p-2 focus:outline-none w-24"
            >
              <option value="" className="hidden">
                Priority
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="" className="text-red-500">
                Remove filter
              </option>
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-center border-slate-500 p-2 focus:outline-none w-24"
            >
              <option value="" className="hidden">
                Status
              </option>
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="" className="text-red-500">
                Remove Filter
              </option>
            </select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 my-8 gap-12">
        {filteredTasks.map((task) => {
          const { formattedDate: startDate, formattedTime: startTimeOnly } = formatDateTime(task.startTime);
          const { formattedDate: endDate, formattedTime: endTimeOnly } = formatDateTime(task.endTime);

          return (
            <TaskCard
              key={task._id} 
              task={{ ...task, startDate, startTimeOnly, endDate, endTimeOnly }}
              onDelete={handleDeleteTask}
              onEdit={() => {
                setTaskToEdit(task);
                setIsModalOpen(true);
              }}
            />
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <TaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddTask={taskToEdit ? handleEditTask : handleAddTask}
            currentTask={taskToEdit}
          />
        </div>
      )}
    </div>
  );
}

export default TaskList;
