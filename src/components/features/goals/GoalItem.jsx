import React from 'react';
import PropTypes from 'prop-types';
import styles from './GoalItem.module.css';
import { format } from 'date-fns';
import { sanitizeInput } from '../../../utils/helpers';

/**
 * React functional component to display a single fitness goal.
 *
 * Renders the goal's name, description, target, and progress.
 * Formats start and end dates if present and sanitizes input to prevent XSS.
 *
 * @param {object} props - The component props.
 * @param {object} props.goal - The goal object with properties: id, name, description, target, unit, progress, startDate, endDate. Required.
 * @returns {JSX.Element} The GoalItem component UI.
 * @throws {Error} If goal prop is not a valid object.
 */
const GoalItem = ({ goal }) => {
    if (!goal || typeof goal !== 'object') {
        if (process.env.NODE_ENV === 'development') {
            console.error('GoalItem Component Error: goal prop must be a valid object.');
        }
        return null;
    }


    const {
        id,
        name,
        description,
        target,
        unit,
        progress,
        startDate,
        endDate
    } = goal;


    const sanitizedName = typeof name === 'string' ? sanitizeInput(name) : 'N/A';
    const sanitizedDescription = typeof description === 'string' ? sanitizeInput(description) : 'No description';
    const sanitizedTarget = typeof target === 'number' ? target : 'N/A';
    const sanitizedUnit = typeof unit === 'string' ? sanitizeInput(unit) : '';
    const sanitizedProgress = typeof progress === 'number' ? progress : 0;


    const formatDateDisplay = (dateString) => {
        if (dateString) {
            try {
                const parsedDate = new Date(dateString);
                if(isNaN(parsedDate)){
                   return 'N/A';
                }
               return format(parsedDate, 'MMM dd, yyyy');
             } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                   console.error('Error formatting date:', error);
                }
                return 'N/A';
            }
        }
        return 'N/A';
    }

    const sanitizedStartDate = formatDateDisplay(startDate);
    const sanitizedEndDate = formatDateDisplay(endDate);


    return (
        <div className={styles.goalItem}>
            <h3 className={styles.goalName}>{sanitizedName}</h3>
            <p className={styles.goalDescription}>{sanitizedDescription}</p>
            <div className={styles.goalDetails}>
                <p>
                    <span className={styles.label}>Target:</span> {sanitizedTarget} {sanitizedUnit}
                </p>
                <p>
                    <span className={styles.label}>Progress:</span> {sanitizedProgress}
                </p>
                {startDate && <p><span className={styles.label}>Start Date:</span> {sanitizeInput(sanitizedStartDate)}</p>}
                {endDate && <p><span className={styles.label}>End Date:</span> {sanitizeInput(sanitizedEndDate)}</p>}
            </div>
        </div>
    );
};


GoalItem.propTypes = {
    goal: PropTypes.shape({
         id: PropTypes.string.isRequired,
         name: PropTypes.string.isRequired,
         description: PropTypes.string,
        target: PropTypes.number.isRequired,
        unit: PropTypes.string.isRequired,
        progress: PropTypes.number,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
    }).isRequired,
};

export default GoalItem;