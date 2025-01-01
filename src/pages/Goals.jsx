import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GoalItem from '../components/features/goals/GoalItem';
import GoalForm from '../components/features/goals/GoalForm';
import useAuth from '../hooks/useAuth';
import styles from './Goals.module.css';
import '../styles/global.css';

/**
 * React functional component for the Goals page.
 *
 * This component displays a list of user goals and provides a form for creating new goals.
 * It integrates with the existing authentication context and API services.
 *
 * @returns {JSX.Element} The Goals component UI.
 */
const Goals = () => {
    const [goals, setGoals] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, checkSession, fetchWithAuth } = useAuth();
    const navigate = useNavigate();

    const checkUserSession = useCallback(async () => {
        try {
             await checkSession();
            if (!isAuthenticated) {
                navigate('/login');
            }
        } catch (err) {
           if (process.env.NODE_ENV === 'development') {
                console.error('Session check failed:', err);
            }
           navigate('/login');
        }
    }, [checkSession, isAuthenticated, navigate]);


    const fetchGoals = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
             const response = await fetchWithAuth('/api/user/goals', 'GET');
            if (response && response.status === 200 && response.data) {
                setGoals(response.data);
            } else if (response && response.status !== 200) {
                  setError({ message: `API Error: ${response.status} - ${response?.data?.message || 'Failed to fetch goals'}` });
              } else {
                 setError({ message: 'Failed to fetch goals' });
              }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [fetchWithAuth]);


    useEffect(() => {
       checkUserSession();
        fetchGoals();
    }, [fetchGoals, checkUserSession]);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error: {error?.message || 'An unexpected error occurred'}</div>;
    }
  
   if (!isAuthenticated) {
        return null;
    }

    return (
        <div className={styles.goalsContainer}>
            <h2>My Goals</h2>
             <GoalForm />
             <div className={styles.goalsList}>
                {(goals || []).map(goal => (
                    <GoalItem key={goal.id} goal={goal} />
                ))}
            </div>
        </div>
    );
};

export default Goals;