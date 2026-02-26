// Utility functions for task management

/**
 * Génère un ID unique robuste
 */
export const generateId = () => {
    return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Formate la date avec une gestion des erreurs
 */
export const formatDate = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    
    // Vérification si la date est valide
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleDateString('en-US', {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

/**
 * Vérifie si une tâche est en retard
 */
export const isTaskOverdue = (dueDate) => {
    if (!dueDate) return false;
    const date = new Date(dueDate);
    return !isNaN(date.getTime()) && date < new Date();
};

/**
 * Mappe les priorités aux styles UI
 */
export const getTaskPriority = (priority) => {
    const priorities = {
        low: { 
            color: 'bg-emerald-100 text-emerald-700 border border-emerald-200', 
            label: 'Low' 
        },
        medium: { 
            color: 'bg-amber-100 text-amber-700 border border-amber-200', 
            label: 'Medium' 
        },
        high: { 
            color: 'bg-rose-100 text-rose-700 border border-rose-200', 
            label: 'High' 
        },
    };
    return priorities[priority] || priorities.medium;
};

/**
 * Filtre les tâches selon l'onglet sélectionné
 */
export const filterTasks = (tasks = [], filter) => {
    switch (filter) {
        case 'completed':
            return tasks.filter(task => task.completed);
        case 'pending':
            return tasks.filter(task => !task.completed);
        case 'overdue':
            return tasks.filter(task => !task.completed && isTaskOverdue(task.dueDate));
        default:
            return tasks;
    }
};

/**
 * Trie les tâches (Immuable)
 */
export const sortTasks = (tasks = [], sortBy) => {
    const sortedTasks = [...tasks];

    switch (sortBy) {
        case 'dueDate':
            return sortedTasks.sort((a, b) => {
                const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                return dateA - dateB;
            });

        case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return sortedTasks.sort((a, b) => 
                (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
            );

        case 'name':
            return sortedTasks.sort((a, b) => 
                (a.title || "").localeCompare(b.title || "")
            );

        case 'createdAt':
        default:
            return sortedTasks.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA; // Plus récent en premier
            });
    }
};