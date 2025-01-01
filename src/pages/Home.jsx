import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import styles from '../styles/global.css'; // Import global styles
import './Home.module.css'; // Import local styles


/**
 * React functional component for the Home page.
 *
 * This component serves as the landing page of the application,
 * providing a welcoming message and navigation buttons to login or signup.
 *
 * @returns {JSX.Element} The Home component UI.
 * @throws {Error} If the component is not able to import external components, or if other error occurs.
 */
const Home = () => {
    // useNavigate hook to navigate to login and signup pages
    const navigate = useNavigate();

    // Function to navigate to the login page
    const handleLoginClick = () => {
        try {
              navigate('/login');
        } catch (error) {
           if (process.env.NODE_ENV === 'development') {
                console.error('Navigation to /login failed:', error);
           }
        }
    };

    // Function to navigate to the signup page
    const handleSignupClick = () => {
         try {
             navigate('/signup');
         } catch (error) {
             if (process.env.NODE_ENV === 'development') {
                   console.error('Navigation to /signup failed:', error);
             }
         }
    };

    return (
        <div className="homeContainer"  >
            <h1 className="homeTitle">Welcome to Fitness Tracker</h1>
            <div className="homeButtons">
                {/* Login button, navigates to the login page */}
                <Button onClick={handleLoginClick} className="homeButton">
                    Login
                </Button>
                {/* Signup button, navigates to the signup page */}
                <Button onClick={handleSignupClick}  className="homeButton">
                    Signup
                </Button>
            </div>
        </div>
    );
};

export default Home;