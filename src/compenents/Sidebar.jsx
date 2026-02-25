import React from 'react';
import {
    Home,
    CheckSquare,
    Clock,
    AlertCircle,
    Settings
} from "lucide-react";


const Sidebar = ({ activeFilter, onFilterChange, taskCount }) => {
    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            count: null
        },
        {
            id: 'all',
            label: 'All Tasks',
            icon: CheckSquare,
            count: taskCount.all
        },
        {
            id: 'pending',
            label: 'Pending',
            icon: Clock,
            count: taskCount.pending
        },
        {
            id: 'completed',
            label: 'Completed',
            icon: CheckSquare,
            count: taskCount.completed
        },
        {
            id: 'overdue',
            label: 'Overdue',
            icon: AlertCircle,
            count: taskCount.overdue
        }
    ];

    return (
        <div className="w-64 bg-white h-screen shadow-lg border-r border-gray-200">
            <div className="p-6">
                <div className="flex items-center space-x-2 mb-8">
                    <CheckSquare className="h-8 w-8 text-blue-500" />
                    <h1 className="text-xl font-bold text-gray-800">TaskMaster</h1>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeFilter === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onFilterChange(item.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 
                                    ${isActive ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                {item.count > 0 && (
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                        ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {item.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
                <button className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-100 text-gray-600 rounded-lg transition-colors">
                    <Settings className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">Settings</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;