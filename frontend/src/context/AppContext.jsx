import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [emails, setEmails] = useState([]);
    const [events, setEvents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [emailsData, eventsData, tasksData, approvalsData] = await Promise.all([
                api.getEmails(),
                api.getEvents(),
                api.getTasks(),
                api.getApprovals()
            ]);
            
            setEmails(emailsData);
            setEvents(eventsData);
            setTasks(tasksData);
            setApprovals(approvalsData);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const value = {
        emails,
        setEmails,
        events,
        setEvents,
        tasks,
        setTasks,
        approvals,
        setApprovals,
        loading,
        error,
        fetchAllData
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);