import React, {useState, useEffect} from "react";
import {
    CheckCircle,
    Clock,
    AlertTriangle,
    
    Calendar,
    Target
} from 'lucide-react';
import { isTaskOverdue, formatDate } from "../utils/taskUtils"

const Dashboard = ({ tasks }) => {
    const [stats, setStats] = useState ({
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0,
        completSonLate: 0,
    });

    const [upcomingTask, setUpcomingTasks] = useState([]);

    useEffect(() => {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = tasks.filter(task => !task.completed).length;
        const overdue = tasks.filter(task => !task.completed && inTaskOverdue(task.dueDate)).length;
        const completSonLate = tasks.filter(task => !task.completed && inTaskOverdue(task.dueDate)).length;
    })
}