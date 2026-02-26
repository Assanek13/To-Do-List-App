import { useState, useEffect, useCallback, useRef } from "react";

export const useLocalStorage = (key, initialValue) => {
    // 1. Initialisation sécurisée
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === "undefined") return initialValue;

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // 2. Utilisation de useCallback pour stabiliser la référence de setValue
    const setValue = useCallback((value) => {
        try {
            setStoredValue((prevValue) => {
                // Gère les mises à jour fonctionnelles (ex: setValue(prev => [...prev, newTask]))
                const valueToStore = value instanceof Function ? value(prevValue) : value;
                
                if (typeof window !== "undefined") {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
                
                return valueToStore;
            });
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key]);

    // 3. Synchronisation entre les onglets/fenêtres
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.error("Error parsing storage change:", error);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [key]);

    return [storedValue, setValue];
};