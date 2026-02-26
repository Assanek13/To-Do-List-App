import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import Sidebar from "./compenents/Sidebar";
import TaskList from "./compenents/TaskList";
import AddTaskForm from "./compenents/AddTaskform";
import Dashboard from "./pages/Dashboard"
import { useLocalStorage } from "./hooks/useLocalStorage"
import { isTaskOverdue } from "./utils/taskUtils";

function App() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentView, SetCurrentView] = useState("dashboard");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [reminders, setReminders] = useState(new Set());

  // Calculate tasks counts for sidebar
  const taskCounts = {
    total: tasks.length,
    pending: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
    overdue: tasks.filter(task => !task.completed && isTaskOverdue(task.dueDate)).length,
  };

  // Handle adding new task
  const handleAddTask = (newTask) => {
    setTasks(prev => [newTask, ...prev]);

    // Set up reminder if specified
    if (newTask.reminderTime) {
      setupReminder(newTask);
    }
  };

  // Handle toggling task completion
  const handleToggleComplete = (taskId) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
        ? { ...task, completed: !task.completed}
        : task
      )
    );
  };

  // Handle deleting task
  const handleDeleteTask = (taskId) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
        ? { ...task, ...updateData }
        : task
      )
    );

    // Update reminder if changed
    const updateTask = { ...tasks.find(t => t.id === taskId), ...updateData };
    if (updateTask.reminderTime) {
      setupReminder(updatedTask);
    }
  };

  // Setup reminder functionality
  const setupReminder = (tasks) => {
    if (!task.reminderTime) return;

    const reminderDate = new Date(task.reminderTime);
    const now = new Date();
    const timeDiff = reminderDate.getTime() - now.getTime();

    if (timeDiff > 0){
      setTimeout(() => {
        if ("Notification" in window) {
          if (Notification.permission === "granted") {
            new Notification(`Reminder: ${task.title}`,{
              body: task.description || "You have a task reminder",
              icon: "flavicon.ico"
            })
          }
        }

        // Also show browser alert as fallback
        alert(`Reminder: ${task.title}\n${task.description || ''}`);
      }, timeDiff);
    }
  }

  // Request notification permission on app load
  useEffect(() => {
    if ("Notification" in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Setup reminders for existing tasks on app load
  useEffect(() => {
    tasks.forEach(task => {
      if (task.reminderTime && !task.completed) {
        const reminderKey = `${task.id}-${task.reminderTime}`;
        if (!reminders.has(reminderKey)) {
          setupReminder(tasks);
          setReminders(prev => new Set([...prev, reminderKey]));
        }
      }
    });
  }, [tasks]);

  // Handle filter change from sidebar
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    SetCurrentView("tasks");
  };

  // Handle view change (dashboard/tasks)
  const handleViewChange = (view) => {
    SetCurrentView(view);
    if (view === "dashboard") {
      setActiveFilter("all");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        activeFilter={currentView === "dashboard" ? "dashboard" :activeFilter}
        onFilterChange={handleFilterChange}
        taskCount={taskCounts}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col"> 
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleViewChange("dashboard")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "dashboard"
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleViewChange("tasks")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "tasks"
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hovver:text-gray-800"
                }`}
              >
                Tasks
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

