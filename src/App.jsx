import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Bell } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskform';
import Dashboard from './pages/Dashboard';
import { useLocalStorage } from './hooks/useLocalStorage';
import { isTaskOverdue } from './utils/tasksUtils';

function App() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentView, setCurrentView] = useState("dashboard");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [scheduledNotifications] = useState(new Set());

  // 1. Calcul des compteurs mémorisé
  const taskCounts = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
    overdue: tasks.filter(t => !t.completed && isTaskOverdue(t.dueDate)).length
  }), [tasks]);

  // 2. Logique de Notification améliorée
  const setupReminder = useCallback((task) => {
    if (!task.reminderTime || task.completed) return;

    const reminderDate = new Date(task.reminderTime);
    const delay = reminderDate.getTime() - Date.now();
    const reminderKey = `${task.id}-${task.reminderTime}`;

    if (delay > 0 && !scheduledNotifications.has(reminderKey)) {
      scheduledNotifications.add(reminderKey);

      setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification(`Task Reminder`, {
            body: task.title,
            icon: "/logo192.png" // Assure-toi d'avoir une icône valide
          });
        } else {
          alert(`⏰ Reminder: ${task.title}`);
        }
        scheduledNotifications.delete(reminderKey);
      }, delay);
    }
  }, [scheduledNotifications]);

  // Initialisation des permissions et des rappels
  useEffect(() => {
    if ("Notification" in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    tasks.forEach(setupReminder);
  }, [tasks, setupReminder]);

  // 3. Handlers d'actions
  const handleAddTask = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    setIsAddFormOpen(false); // Ferme le modal après ajout
  };

  const handleToggleComplete = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const handleEditTask = (taskId, updatedData) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updatedData } : task
    ));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <Sidebar
        activeFilter={currentView === "dashboard" ? "dashboard" : activeFilter}
        onFilterChange={(filter) => {
          setActiveFilter(filter);
          setCurrentView("tasks");
        }}
        taskCount={taskCounts}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header / Top Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <nav className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setCurrentView("dashboard")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  currentView === "dashboard" ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => { setCurrentView("tasks"); setActiveFilter("all"); }}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  currentView === "tasks" ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                My Tasks
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Today</p>
              <p className="text-sm font-semibold text-slate-700">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <button className="relative p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Main View Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto h-full">
            {currentView === "dashboard" ? (
              <Dashboard tasks={tasks} />
            ) : (
              <TaskList
                tasks={tasks}
                filter={activeFilter}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
              />
            )}
          </div>
        </main>
      </div>

      {/* Floating Action Button (FAB) pour ajouter une tâche */}
      <button 
        onClick={() => setIsAddFormOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl shadow-xl shadow-blue-200 transition-transform hover:scale-110 active:scale-95 z-20"
      >
        <span className="flex items-center gap-2 font-bold px-2">
          <plus className="h-6 w-6" />
          Add Task
        </span>
      </button>

      <AddTaskForm
        onAddTask={handleAddTask}
        isOpen={isAddFormOpen}
        onToggle={() => setIsAddFormOpen(!isAddFormOpen)}
      />
    </div>
  );
}

export default App;