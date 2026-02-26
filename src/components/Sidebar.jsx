import React from 'react';
import {
    Home,
    CheckSquare,
    Clock,
    AlertCircle,
    Settings,
    CheckCircle2
} from "lucide-react";

const Sidebar = ({ activeFilter, onFilterChange, taskCount = {} }) => {
    
    // Configuration des menus pour faciliter la maintenance
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-blue-500' },
        { id: 'all', label: 'All Tasks', icon: CheckSquare, count: taskCount.all, color: 'text-indigo-500' },
        { id: 'pending', label: 'Pending', icon: Clock, count: taskCount.pending, color: 'text-amber-500' },
        { id: 'completed', label: 'Completed', icon: CheckCircle2, count: taskCount.completed, color: 'text-emerald-500' },
        { id: 'overdue', label: 'Overdue', icon: AlertCircle, count: taskCount.overdue, color: 'text-rose-500' }
    ];

    return (
        <aside className="w-64 bg-white h-screen shadow-xl border-r border-gray-100 flex flex-col">
            {/* Logo Section */}
            <div className="p-6">
                <div className="flex items-center space-x-3 mb-10">
                    <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
                        <CheckSquare className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-xl font-extrabold tracking-tight text-gray-900">TaskMaster</h1>
                </div>

                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeFilter === item.id;
                        const isOverdue = item.id === 'overdue' && item.count > 0;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onFilterChange(item.id)}
                                className={`w-full group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 
                                    ${isActive 
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                                        : 'text-gray-500 hover:bg-gray-50 hover:translate-x-1'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : item.color}`} />
                                    <span className={`font-semibold text-sm`}>{item.label}</span>
                                </div>
                                
                                {item.count !== undefined && item.count !== null && (
                                    <span className={`px-2 py-0.5 text-xs font-bold rounded-lg transition-colors
                                        ${isActive 
                                            ? 'bg-white/20 text-white' 
                                            : isOverdue 
                                                ? 'bg-rose-100 text-rose-600' 
                                                : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                                        }`}>
                                        {item.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section - Settings */}
            <div className="mt-auto p-6 border-t border-gray-50">
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group">
                    <Settings className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:rotate-45 transition-transform duration-300" />
                    <span className="font-semibold text-sm">Settings</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;