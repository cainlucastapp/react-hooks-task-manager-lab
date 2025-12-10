import React, { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);

    // Fetch tasks on mount
    useEffect(() => {
        fetch('http://localhost:6001/tasks')
            .then(r => r.json())
            .then(data => setTasks(data))
    }, []);

    const toggleComplete = (taskId) => {
        setTasks(tasks.map(task => 
            task.id === taskId 
                ? { ...task, completed: !task.completed } 
                : task
        ));
    };

    const addTask = (taskTitle) => {
        const newTask = {
            title: taskTitle,
            completed: false
        };

        // POST to database
        fetch('http://localhost:6001/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask)
        })
        .then(r => r.json())
        .then(savedTask => {
            // Add the task with the ID from the database
            setTasks([...tasks, savedTask]);
        });
    };

    return (
        <TaskContext.Provider value={{ tasks, setTasks, toggleComplete, addTask }}>
            {children}
        </TaskContext.Provider>
    );
}