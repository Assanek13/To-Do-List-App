import React, { useState } from 'react';
import {
    Check, Edit3, Trash2, Clock, AlertCircle, 
    Calendar, Save, X, Bell
} from 'lucide-react';
import { formatDate, isTaskOverdue, getTaskPriority } from '../utils/tasksUtils';

const TaskItem = ({ task, onToggleComplete, onDeleteTask, onEditTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...task });

    const isOverdue = isTaskOverdue(task.dueDate) && !task.completed;
    const priority = getTaskPriority(task.priority);

    const handleSave = () => {
        if (!editData.title.trim()) return;
        onEditTask(task.id, {
            ...editData,
            title: editData.title.trim(),
            description: editData.description.trim()
        });
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    // --- MODE ÉDITION ---
    if (isEditing) {
        return (
            <div className="bg-blue-50/50 border-2 border-blue-200 rounded-2xl p-4 mb-3 animate-in fade-in duration-200">
                <div className="space-y-3">
                    <input
                        type="text"
                        name="title"
                        autoFocus
                        value={editData.title}
                        onChange={handleChange}
                        className="w-full bg-white px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
                    />
                    <textarea
                        name="description"
                        value={editData.description}
                        onChange={handleChange}
                        rows="2"
                        className="w-full bg-white px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                    />
                    <div className="flex flex-wrap gap-2 justify-between items-center">
                        <div className="flex gap-2">
                            <input 
                                type="datetime-local"
                                name="dueDate"
                                value={editData.dueDate || ''}
                                onChange={handleChange}
                                className="text-xs border rounded-md p-1 outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => setIsEditing(false)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm shadow-blue-200 flex items-center gap-1">
                                <Save className="h-4 w-4" /> Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- MODE AFFICHAGE ---
    return (
        <div className={`group relative bg-white border border-gray-100 rounded-2xl p-4 mb-3 transition-all duration-300 hover:shadow-xl hover:border-blue-100
            ${task.completed ? 'bg-gray-50/50 border-transparent' : ''}
            ${isOverdue ? 'border-l-4 border-l-rose-500' : 'border-l-4 border-l-transparent'}`}>
            
            <div className="flex items-start gap-4">
                {/* Checkbox Custom */}
                <button
                    onClick={() => onToggleComplete(task.id)}
                    className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        task.completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'border-gray-300 group-hover:border-blue-400'
                    }`}
                >
                    {task.completed && <Check className="h-4 w-4 stroke-[3px]" />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className={`font-bold text-gray-800 transition-all ${task.completed ? 'line-through text-gray-400 italic' : ''}`}>
                                {task.title}
                            </h3>
                            {task.description && (
                                <p className={`mt-1 text-sm text-gray-500 line-clamp-2 ${task.completed ? 'text-gray-300' : ''}`}>
                                    {task.description}
                                </p>
                            )}
                        </div>
                        
                        {/* Priority Badge */}
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${priority.color}`}>
                            {priority.label}
                        </span>
                    </div>

                    {/* Meta info & Actions */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex flex-wrap gap-4 text-[11px] font-medium uppercase tracking-tight">
                            {task.dueDate && (
                                <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-rose-600' : 'text-gray-400'}`}>
                                    {isOverdue ? <AlertCircle className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />}
                                    <span>{formatDate(task.dueDate)}</span>
                                </div>
                            )}
                            {task.reminderTime && (
                                <div className="flex items-center gap-1.5 text-blue-500/70">
                                    <Bell className="h-3.5 w-3.5" />
                                    <span>{formatDate(task.reminderTime)}</span>
                                </div>
                            )}
                        </div>

                        {/* Actions : Invisibles par défaut, apparaissent au hover */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Edit task"
                            >
                                <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => onDeleteTask(task.id)}
                                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                title="Delete task"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;