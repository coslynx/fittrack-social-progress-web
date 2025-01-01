import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import useAuth from '../../../hooks/useAuth';
import styles from './DashboardStats.module.css';
import { formatDistance } from 'date-fns';
import { sanitizeInput } from '../../../utils/helpers';


/**
 * React functional component to display user fitness statistics.
 *
 * Uses the `useAuth` hook to fetch user-specific stats and handles loading and error states.
 * Renders fitness statistics, formats the last workout using `date-fns`,
 * and displays error messages as needed. The component employs memoization
 * with `React.memo()` to prevent unnecessary re-renders.
 *
 * @returns {JSX.Element} The DashboardStats component UI.
 */
const DashboardStats = React.memo(() => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { fetchWithAuth } = useAuth();


    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchWithAuth('/api/user/stats', 'GET');

            if (response && response.status === 200 && response.data) {
                setStats(response.data);
            } else if (response && response.status !== 200 ) {
                 setError({ message: `API Error: ${response.status} - ${response?.data?.message || 'Failed to fetch statistics'}`});
             } else {
                setError({ message: 'Failed to fetch statistics' });
             }

        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [fetchWithAuth]);


    useEffect(() => {
        fetchStats();
    }, [fetchStats]);


    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }


    if (error) {
        return <div className={styles.error}>Error: {error?.message || 'An unexpected error occurred'}</div>;
    }


    if (!stats) {
        return <div className={styles.noData}>No stats available</div>;
    }
    
    const sanitizedTotalWorkouts = typeof stats.totalWorkouts === 'number' ? stats.totalWorkouts : 'N/A';
    const sanitizedTotalCaloriesBurned = typeof stats.totalCaloriesBurned === 'number' ? stats.totalCaloriesBurned : 'N/A';
    const sanitizedAverageWorkoutDuration = typeof stats.averageWorkoutDuration === 'number' ? stats.averageWorkoutDuration : 'N/A';
    const sanitizedTotalDistanceCovered = typeof stats.totalDistanceCovered === 'number' ? stats.totalDistanceCovered : 'N/A';
    
      const formatLastWorkout = () => {
        if (!stats.lastWorkout) {
          return 'No recent workout';
        }
          const lastWorkoutDate = new Date(stats.lastWorkout);
        return formatDistance(lastWorkoutDate, new Date(), { addSuffix: true });
      }
  
      const lastWorkoutDisplay = formatLastWorkout();



    return (
        <div className={styles.dashboardStats}>
            <h2>Dashboard Statistics</h2>
            <ul className={styles.statsList}>
                <li><p><span>Total Workouts:</span> {sanitizedTotalWorkouts}</p></li>
                <li><p><span>Total Calories Burned:</span> {sanitizedTotalCaloriesBurned}</p></li>
                <li><p><span>Average Workout Duration:</span> {sanitizedAverageWorkoutDuration} minutes</p></li>
                <li><p><span>Total Distance Covered:</span> {sanitizedTotalDistanceCovered} km</p></li>
                <li><p><span>Last Workout:</span> {sanitizeInput(lastWorkoutDisplay)}</p></li>
            </ul>
        </div>
    );
});


DashboardStats.propTypes = {
    // No props expected
};


export default DashboardStats;