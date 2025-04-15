import { useState, useCallback } from 'react';

const useNotification = () => {
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success', // Có thể là 'success', 'error', 'warning', 'info'
    });

    const showNotification = useCallback((message, severity = 'success') => {
        setNotification({
            open: true,
            message,
            severity,
        });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification((prev) => ({
            ...prev,
            open: false,
        }));
    }, []);

    return { notification, showNotification, closeNotification };
};

export default useNotification;
