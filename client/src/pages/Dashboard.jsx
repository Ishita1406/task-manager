import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/task/get', {
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
        setError('Failed to load tasks. Please try again.');
      }
    };

    fetchTasks();
  }, []);


  if (error) {
    return <div className="m-6 p-5 text-center text-red-600">{error}</div>;
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
  const pendingTasks = totalTasks - completedTasks;

  const completedPercentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pendingPercentage = 100 - completedPercentage;

  const averageTimePerCompletedTask = tasks
    .filter(task => task.status === 'COMPLETED')
    .reduce((total, task) => {
      const startTime = task.startTime ? new Date(task.startTime) : null;
      const endTime = task.endTime ? new Date(task.endTime) : null;
      return startTime && endTime ? total + (endTime - startTime) / (1000 * 60 * 60) : total;
    }, 0) / completedTasks || 0;

  const totalTimeLapsed = tasks
    .filter(task => task.status === 'PENDING')
    .reduce((total, task) => {
      const startTime = task.startTime ? new Date(task.startTime) : null;
      const now = new Date();
      return startTime ? total + (now - startTime) / (1000 * 60 * 60) : total;
    }, 0);

  const totalTimeToFinish = tasks
    .filter(task => task.status === 'PENDING')
    .reduce((total, task) => {
      const now = new Date();
      const endTime = task.endTime ? new Date(task.endTime) : null;
      return endTime && endTime > now ? total + (endTime - now) / (1000 * 60 * 60) : total;
    }, 0);

  const priorities = [1, 2, 3, 4, 5];
  const priorityData = priorities.map(priority => {
    const tasksByPriority = tasks.filter(task => task.priority === priority && task.status === 'PENDING');
    const pendingCount = tasksByPriority.length;
    const timeLapsed = tasksByPriority.reduce((total, task) => {
      const startTime = task.startTime ? new Date(task.startTime) : null;
      const now = new Date();
      return startTime ? total + (now - startTime) / (1000 * 60 * 60) : total;
    }, 0);
    const timeToFinish = tasksByPriority.reduce((total, task) => {
      const now = new Date();
      const endTime = task.endTime ? new Date(task.endTime) : null;
      return endTime && endTime > now ? total + (endTime - now) / (1000 * 60 * 60) : total;
    }, 0);

    return {
      priority,
      pendingCount,
      timeLapsed: timeLapsed.toFixed(1),
      timeToFinish: timeToFinish.toFixed(1),
    };
  });

  return (
    <div className="m-6 p-5">
      <h1 className="font-extrabold text-gray-800 text-3xl">Dashboard</h1>
      <div className="my-10">
        <h2 className="text-xl my-5 text-slate-700 font-medium">Summary</h2>
        <div className="flex items-start gap-16 flex-wrap">
          <DashboardStat label="Total tasks" value={totalTasks} />
          <DashboardStat label="Task Completed" value={`${completedPercentage}%`} />
          <DashboardStat label="Tasks Pending" value={`${pendingPercentage}%`} />
          <DashboardStat label="Avg. Time Per Task" value={`${averageTimePerCompletedTask.toFixed(1)} hrs`} />
        </div>
      </div>
      <div className="my-12">
        <h2 className="text-xl my-5 text-slate-700 font-medium">Pending Task Summary</h2>
        <div className="flex items-start gap-16 flex-wrap">
          <DashboardStat label="Pending Tasks" value={pendingTasks} />
          <DashboardStat label="Total Time Lapsed" value={`${totalTimeLapsed.toFixed(1)} hrs`} />
          <DashboardStat label="Total Time to Finish" value={`${totalTimeToFinish.toFixed(1)} hrs`} />
        </div>
      </div>
      <div className="my-12">
        <h2 className="text-xl my-5 text-slate-700 font-medium">Task Priority Table</h2>
        <table className="w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Task Priority</th>
              <th className="border border-gray-300 p-2">Pending Tasks</th>
              <th className="border border-gray-300 p-2">Time Lapsed (hrs)</th>
              <th className="border border-gray-300 p-2">Time to Finish (hrs)</th>
            </tr>
          </thead>
          <tbody>
            {priorityData.map(row => (
              <tr key={row.priority}>
                <td className="border border-gray-300 p-2">{row.priority}</td>
                <td className="border border-gray-300 p-2">{row.pendingCount}</td>
                <td className="border border-gray-300 p-2">{row.timeLapsed}</td>
                <td className="border border-gray-300 p-2">{row.timeToFinish}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DashboardStat({ label, value }) {
  return (
    <div className="flex flex-col items-center w-full sm:w-auto">
      <h1 className="font-extrabold text-purple-600 text-3xl">{value}</h1>
      <p className="text-slate-600 text-center">{label}</p>
    </div>
  );
}

export default Dashboard;
