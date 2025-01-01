import React, { useState } from 'react';
import Button from '../../common/Button';
import Input from '../../common/Input';
import useAuth from '../../../hooks/useAuth';
import styles from './GoalForm.module.css';
import { trimInput } from '../../../utils/helpers';

/**
 * React functional component for creating fitness goals.
 *
 * Manages form inputs for goal details and submission using the useAuth hook.
 * Uses controlled components for form fields, and handles form resets on success.
 * Implements comprehensive error handling for API responses and UI updates.
 *
 * @returns {JSX.Element} The GoalForm component UI.
 */
const GoalForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        target: '',
        unit: '',
    });
    const { fetchWithAuth } = useAuth();
    
    /**
     * Handles changes in input fields by updating the form data state.
     *
     * @param {string} value The new input value.
     * @param {string} fieldName The name of the input field.
     */
    const handleInputChange = (value, fieldName) => {
       setFormData(prevFormData => ({
             ...prevFormData,
           [fieldName]: trimInput(value),
       }));
    };
    /**
     * Handles form submission by making an API call to create a new goal.
     *
     * Manages both successful goal creation and error scenarios.
     * Resets the form after successful submission.
     *
     * @param {object} event The form submit event.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
      try {
            const response = await fetchWithAuth('/api/user/goals', 'POST', formData);
             if (response && response.status === 201 ) {
                 if(process.env.NODE_ENV === 'development'){
                      console.log('Goal created successfully');
                  }
               setFormData({ name: '', description: '', target: '', unit: '' });
            } else if (response && response.status !== 201) {
                 if(process.env.NODE_ENV === 'development'){
                    console.error('Failed to create goal:', response?.message || 'Invalid response from server.');
                }
             }
       } catch (err) {
          if(process.env.NODE_ENV === 'development'){
            console.error('Failed to create goal:', err?.message || 'An unexpected error occurred.');
        }
      }
   };
    return (
        <div className={styles.goalForm}>
            <h2>Create New Goal</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    type="text"
                    value={formData.name}
                    onChange={(value) => handleInputChange(value, 'name')}
                    placeholder="Goal Name"
                    className={styles.input}
                    required
                />
                <Input
                    type="text"
                    value={formData.description}
                    onChange={(value) => handleInputChange(value, 'description')}
                    placeholder="Description"
                    className={styles.input}
                    required
                 />
                <Input
                    type="number"
                    value={formData.target}
                   onChange={(value) => handleInputChange(value, 'target')}
                    placeholder="Target"
                     className={styles.input}
                     required
                />
               <Input
                   type="text"
                   value={formData.unit}
                    onChange={(value) => handleInputChange(value, 'unit')}
                   placeholder="Unit"
                    className={styles.input}
                    required
               />
              <div className={styles.buttonContainer}>
                    <Button type="submit" className={styles.button}>
                        Create Goal
                    </Button>
                 </div>
            </form>
        </div>
    );
};

export default GoalForm;