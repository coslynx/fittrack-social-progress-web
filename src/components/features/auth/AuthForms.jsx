import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button';
import Input from '../../common/Input';
import useAuth from '../../../hooks/useAuth';
import styles from './AuthForms.module.css';
import { trimInput } from '../../../utils/helpers';

/**
 * Component for user authentication forms (login and signup).
 *
 * Manages form toggling, input values, and submission logic
 * using a local state and the imported useAuth hook for authentication.
 *
 * @returns {JSX.Element} The authentication forms.
 */
const AuthForms = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();


    /**
     * Handles input changes in the form by trimming and setting the value in the state.
     *
     * @param {string} fieldName - The name of the input field.
     * @param {string} value - The new value of the input.
     */
    const handleInputChange = (value, fieldName) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [fieldName]: trimInput(value),
        }));
    };


    /**
     * Handles the form submission for both login and signup.
     *
     * Calls the appropriate authentication function from the useAuth hook
     * and redirects to the dashboard on success or logs the error on failure.
     *
     * @param {object} event - The form submission event.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await login(formData);
             navigate('/dashboard');
        } catch (err) {
            if(process.env.NODE_ENV === 'development'){
                 console.error('Authentication failed:', err);
            }
        }
    };

     /**
     * Toggles the form between login and signup modes.
     */
    const toggleForm = () => {
        setIsLogin(!isLogin);
    };


    return (
        <div className={styles.authForm}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>{isLogin ? 'Login' : 'Signup'}</h2>
                <Input
                    type="text"
                    value={formData.username}
                    onChange={(value) => handleInputChange(value, 'username')}
                    placeholder="Username"
                    className={styles.input}
                />
                <Input
                    type="password"
                    value={formData.password}
                   onChange={(value) => handleInputChange(value, 'password')}
                    placeholder="Password"
                    className={styles.input}
                />
                <Button type="submit" className={styles.button}>
                    {isLogin ? 'Login' : 'Signup'}
                </Button>
            </form>
           <Button  onClick={toggleForm} className={styles.button}>
                {isLogin ? 'Switch to Signup' : 'Switch to Login'}
            </Button>
        </div>
    );
};

export default AuthForms;