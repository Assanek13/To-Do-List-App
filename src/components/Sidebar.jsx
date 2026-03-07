import React, { useState } from 'react';
import {
    Home,
    CheckSquare,
    Clock,
    AlertCircle,
    Settings,
    CheckCircle2,
    Menu,
    X
} from "lucide-react";

const Sidebar = ({ activeFilter, onFilterChange, taskCount = {} }) => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-blue-500' },
        { id: 'all', label: 'All Tasks', icon: CheckSquare, count: taskCount.all, color: 'text-indigo-500' },
        { id: 'pending', label: 'En attente', icon: Clock, count: taskCount.pending, color: 'text-amber-500' },
        { id: 'completed', label: 'Terminées', icon: CheckCircle2, count: taskCount.completed, color: 'text-emerald-500' },
        { id: 'overdue', label: 'En cours', icon: AlertCircle, count: taskCount.overdue, color: 'text-rose-500' }
    ];

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 px-4 flex items-center justify-between z-40">
                <div className="flex items-center space-x-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <CheckSquare className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-900">TaskMaster</span>
                </div>
                <button 
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-100 flex flex-col transform transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
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
                                    onClick={() => {
                                        onFilterChange(item.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 
                                        ${isActive 
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                                            : 'text-gray-500 hover:bg-gray-50 hover:translate-x-1'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Icon className={`h-5 w-5 ${isActive ? 'text-white' : item.color}`} />
                                        <span className="font-semibold text-sm">{item.label}</span>
                                    </div>
                                    
                                    {item.count !== undefined && (
                                        <span className={`px-2 py-0.5 text-xs font-bold rounded-lg 
                                            ${isActive 
                                                ? 'bg-white/20 text-white' 
                                                : isOverdue 
                                                    ? 'bg-rose-100 text-rose-600' 
                                                    : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {item.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="mt-auto p-6 border-t border-gray-50">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group">
                        <Settings className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:rotate-45 transition-transform duration-300" />
                        <span className="font-semibold text-sm">Paramètres</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;