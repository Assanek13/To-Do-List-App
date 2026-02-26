import React, { useMemo } from "react";
import {
    CheckCircle, Clock, AlertTriangle, TrendingUp,
    Calendar, Target, ChevronRight
} from 'lucide-react';
import { isTaskOverdue, formatDate } from '../utils/tasksUtils';

const Dashboard = ({ tasks = [] }) => {
    // 1. Calcul des statistiques optimisé (ne se re-calcule que si 'tasks' change)
    const stats = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const overdue = tasks.filter(t => !t.completed && isTaskOverdue(t.dueDate)).length;
        
        // Calcul des tâches à venir (7 prochains jours)
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        const upcoming = tasks
            .filter(t => !t.completed && t.dueDate)
            .filter(t => {
                const d = new Date(t.dueDate);
                return d >= now && d <= nextWeek;
            })
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 5);

        return {
            total,
            completed,
            pending: total - completed,
            overdue,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
            upcoming
        };
    }, [tasks]);

    return (
        <div className="flex-1 p-8 bg-gray-50/30 overflow-y-auto">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Overview</h1>
                <p className="text-gray-500 font-medium mt-2 text-lg">
                    You've completed <span className="text-blue-600">{stats.completionRate}%</span> of your goals. Keep it up!
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard icon={Target} title="Total Tasks" value={stats.total} color="blue" />
                <StatCard icon={CheckCircle} title="Completed" value={stats.completed} color="emerald" />
                <StatCard icon={Clock} title="In Progress" value={stats.pending} color="amber" />
                <StatCard icon={AlertTriangle} title="Overdue" value={stats.overdue} color="rose" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Progress Card */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900">Performance Metrics</h3>
                        <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </div>
                    
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between mb-3 items-end">
                                <span className="text-gray-500 font-bold text-sm uppercase tracking-widest">Global Progress</span>
                                <span className="text-3xl font-black text-blue-600">{stats.completionRate}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-2xl h-4 overflow-hidden">
                                <div 
                                    className="bg-blue-600 h-full rounded-2xl transition-all duration-1000 ease-out shadow-lg shadow-blue-200"
                                    style={{ width: `${stats.completionRate}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 pt-4">
                            <MiniStat label="Success" value={stats.completed} sub="Tasks done" color="text-emerald-600" />
                            <MiniStat label="Active" value={stats.pending} sub="To do" color="text-amber-600" />
                            <MiniStat label="Critical" value={stats.overdue} sub="Delayed" color="text-rose-600" />
                        </div>
                    </div>
                </div>

                {/* Upcoming Tasks Section */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Next 7 Days</h3>
                        <Calendar className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-4 flex-1">
                        {stats.upcoming.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10">
                                <Calendar className="h-12 w-12 mb-3" />
                                <p className="font-medium">All clear for now!</p>
                            </div>
                        ) : (
                            stats.upcoming.map(task => (
                                <div key={task.id} className="group flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-100">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 truncate text-sm">{task.title}</p>
                                        <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-tighter">
                                            {formatDate(task.dueDate)}
                                        </p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sous-composants pour la clarté
const StatCard = ({ icon: Icon, title, value, color }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        rose: "bg-rose-50 text-rose-600"
    };
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${colors[color]}`}>
                <Icon className="h-7 w-7" />
            </div>
            <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{title}</p>
                <p className="text-3xl font-black text-gray-900">{value}</p>
            </div>
        </div>
    );
};

const MiniStat = ({ label, value, sub, color }) => (
    <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
        <div className={`text-2xl font-black ${color}`}>{value}</div>
        <div className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">{label}</div>
        <div className="text-[10px] text-gray-400 italic">{sub}</div>
    </div>
);

export default Dashboard;