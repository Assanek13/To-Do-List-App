import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Calendar, Flag, Bell } from 'lucide-react';
import { generateId } from '../utils/tasksUtils';

// 1. Extraction de l'état initial pour plus de clarté
const INITIAL_STATE = {
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    reminderTime: "",
};

const AddTaskform = ({ onAddTask, isOpen, onToggle }) => {
    const [formData, setFormData] = useState(INITIAL_STATE);

    // 2. Fermeture avec la touche Echap
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onToggle(); };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onToggle]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        onAddTask({
            ...formData,
            id: generateId(),
            title: formData.title.trim(),
            description: formData.description.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
        });

        setFormData(INITIAL_STATE);
        onToggle();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!isOpen) {
        return (
            <button 
                onClick={onToggle}
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-40"
                aria-label="Add task"
            >
                <Plus className="h-7 w-7" />
            </button>
        );
    }

    return (
        <>
            {/* Backdrop avec flou pour un effet premium */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
                onClick={onToggle}
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800">New Task</h2>
                        <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                autoFocus
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="What needs to be done?"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                placeholder="Add more details..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Flag className="h-4 w-4" /> Priority
                                </label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Due Date
                                </label>
                                <input
                                    type="date" // Changé en 'date' pour plus de simplicité, ou garder datetime-local
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Actions boutons côte à côte */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onToggle}
                                className="flex-1 px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
                            >
                                Create Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddTaskform;