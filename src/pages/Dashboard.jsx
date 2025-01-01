import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardStats from '../components/features/dashboard/DashboardStats';
import useAuth from '../hooks/useAuth';
import styles from './Dashboard.module.css';
import '../styles/global.css';


/**
 * React functional component for the Dashboard page.
 *
 * This component serves as the main dashboard page for authenticated users.
 * It checks for user authentication using the useAuth hook and redirects unauthenticated
 * users to the login page. It displays user statistics via DashboardStats component and
 * includes a navigation button to the goals page. Handles errors related to authentication and navigation.
 *
 * @returns {JSX.Element} The Dashboard component UI.
 *
 */
const Dashboard = () => {
    const { isAuthenticated, checkSession, loading, error } = useAuth();
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

    useEffect(() => {
        checkUserSession();
    }, [checkUserSession]);


    const handleViewGoals = () => {
       try {
           navigate('/goals');
       } catch (err) {
           if (process.env.NODE_ENV === 'development') {
                console.error('Navigation to /goals failed:', err);
           }
       }
   };

    if(loading){
        return  <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
       return <div className={styles.error}>Error: {error?.message || 'An unexpected error occurred'}</div>;
    }


    if (!isAuthenticated) {
       return null;
    }

    return (
        <div className={styles.dashboardContainer}>
            <DashboardStats />
            <button onClick={handleViewGoals} className={styles.viewGoalsButton}>
                View Goals
            </button>
        </div>
    );
};

export default Dashboard;

/* Test Cases:
 Test Case 1: Mount the component without authentication.
     - Mock the useAuth hook to return that the user is not authenticated.
     - Assert that the component redirects to the login page.
 Test Case 2: Mount the component with authentication.
     - Mock the useAuth hook to return that the user is authenticated.
     - Assert that the component renders the DashboardStats component and the View Goals button.
 Test Case 3: Simulate a loading state.
     - Mock the useAuth hook to return a loading state.
      - Assert that the component renders the loading message.
 Test Case 4: Simulate an error state.
     - Mock the useAuth hook to return an error state.
      - Assert that the component renders the error message.
 Test Case 5: Test the view goals button functionality
     - Mock the useNavigate and useAuth hooks.
     - Assert that the onClick event on the button navigates to the /goals route.
 Test Case 6: Simulate initial check session loading state
     - Mock the `useAuth` to return that the component is loading.
     - Assert that loading message is shown
 Test Case 7: Simulate initial check session error state
      - Mock the `useAuth` hook to return an error during check session.
      - Assert that the component redirects to the login page.
 Test Case 8: Handle navigation failure
      - Mock the navigate hook to throw an error
      - Assert that if the NODE_ENV is development an error is logged
*/