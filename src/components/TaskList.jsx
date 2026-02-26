import React, { useState, useMemo } from 'react';
import { Search, SortAsc, Filter, Plus, Inbox } from 'lucide-react';
import TaskItem from './TaskItem';
import { filterTasks, sortTasks } from '../utils/tasksUtils';

const TaskList = ({ tasks, filter, onToggleComplete, onDeleteTask, onEditTask }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');

    // 1. Optimisation des performances avec useMemo
    const processedTasks = useMemo(() => {
        const filtered = filterTasks(tasks, filter);
        
        const searched = filtered.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return sortTasks(searched, sortBy);
    }, [tasks, filter, searchTerm, sortBy]);

    const getFilterTitle = () => {
        const titles = {
            completed: 'Completed Tasks',
            pending: 'Pending Tasks',
            overdue: 'Overdue Tasks',
            all: 'All My Tasks'
        };
        return titles[filter] || titles.all;
    };

    return (
        <main className="flex-1 p-8 bg-gray-50/50 min-h-screen">
            {/* Header Section */}
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        {getFilterTitle()}
                    </h2>
                    <p className="text-gray-500 font-medium mt-1">
                        {processedTasks.length} {processedTasks.length <= 1 ? 'task' : 'tasks'} found
                    </p>
                </div>
            </div>

            {/* Toolbar: Search & Sort */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search your tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                    />
                </div>

                <div className="relative inline-block">
                    <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none font-semibold text-gray-700 cursor-pointer min-w-[160px]"
                    >
                        <option value="createdAt">Sort: Latest</option>
                        <option value="dueDate">Sort: Due Date</option>
                        <option value="priority">Sort: Priority</option>
                        <option value="name">Sort: Name</option>
                    </select>
                </div>
            </div>

            {/* Tasks Grid/List */}
            <div className="space-y-3">
                {processedTasks.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-300 rounded-3xl py-20 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                            {searchTerm ? (
                                <Search className="h-10 w-10 text-blue-500" />
                            ) : (
                                <Inbox className="h-10 w-10 text-blue-500" />
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {searchTerm ? `No results for "${searchTerm}"` : 'Clear as a crystal!'}
                        </h3>
                        <p className="text-gray-500 max-w-xs mx-auto mb-6 font-medium">
                            {searchTerm 
                                ? 'Try using different keywords or check your filters.' 
                                : 'You don’t have any tasks here. Enjoy your free time or create a new one!'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {processedTasks.map((task, index) => (
                            <div 
                                key={task.id} 
                                className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <TaskItem
                                    task={task}
                                    onToggleComplete={onToggleComplete}
                                    onDeleteTask={onDeleteTask}
                                    onEditTask={onEditTask}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default TaskList;