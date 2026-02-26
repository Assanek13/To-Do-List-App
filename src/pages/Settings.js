import React from 'react';
import { Moon, Sun, User, Bell, Shield, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="p-8 max-w-4xl mx-auto animate-in">
            <h1 className="text-3xl font-black mb-8">Settings</h1>

            <div className="space-y-6">
                {/* Section Apparence */}
                <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Sun className="h-5 w-5 text-blue-500" /> Appearance
                    </h2>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                        <div>
                            <p className="font-bold">Dark Mode</p>
                            <p className="text-sm text-slate-500">Adjust the screen to reduce eye strain</p>
                        </div>
                        <button 
                            onClick={toggleTheme}
                            className={`w-14 h-8 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-300'}`}
                        >
                            <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : ''} flex items-center justify-center`}>
                                {theme === 'dark' ? <Moon className="h-3 w-3 text-blue-600" /> : <Sun className="h-3 w-3 text-amber-500" />}
                            </div>
                        </button>
                    </div>
                </section>

                {/* Section Profil Rapide */}
                <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-emerald-500" /> Profile
                    </h2>
                    <div className="flex items-center gap-4 p-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl">
                            JD
                        </div>
                        <div>
                            <p className="font-bold">John Doe</p>
                            <p className="text-sm text-slate-500">john.doe@example.com</p>
                        </div>
                        <button className="ml-auto text-sm font-bold text-blue-600 hover:underline">Edit</button>
                    </div>
                </section>

                {/* Zone de Danger */}
                <section className="bg-rose-50 dark:bg-rose-900/10 rounded-3xl p-6 border border-rose-100 dark:border-rose-900/30">
                    <h2 className="text-lg font-bold text-rose-700 dark:text-rose-400 mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5" /> Danger Zone
                    </h2>
                    <button className="flex items-center gap-2 text-rose-600 font-bold hover:bg-rose-100 dark:hover:bg-rose-900/20 px-4 py-2 rounded-xl transition-colors">
                        <Trash2 className="h-4 w-4" /> Reset all application data
                    </button>
                </section>
            </div>
        </div>
    );
};

export default Settings;