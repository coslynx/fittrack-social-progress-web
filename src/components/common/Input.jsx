import React from 'react';
import PropTypes from 'prop-types';
import styles from './Input.module.css';
import { sanitizeInput } from '../../utils/helpers';

/**
 * Reusable input component for handling text, email, password, and number input types.
 *
 * @param {object} props - The component props.
 * @param {string} props.type - The input type ('text', 'email', 'password', 'number'). Required.
 * @param {string} props.value - The current input value. Required.
 * @param {function} props.onChange - The callback function for input change events. Required.
 * @param {string} [props.placeholder] - Optional placeholder text.
 * @param {string} [props.className] - Optional CSS class name.
 * @returns {JSX.Element|null} The input element or null if props are invalid.
 */
const Input = ({ type, value, onChange, placeholder, className }) => {
    if (!type || typeof type !== 'string' || !['text', 'email', 'password', 'number'].includes(type)) {
        if (process.env.NODE_ENV === 'development') {
             console.error('Input Component Error: type prop must be one of "text", "email", "password", or "number".');
        }
        return null;
    }

    if (value === null || value === undefined || typeof value !== 'string') {
         if (process.env.NODE_ENV === 'development') {
            console.error('Input Component Error: value prop must be a string.');
        }
        return null;
    }

    if (!onChange || typeof onChange !== 'function') {
        if (process.env.NODE_ENV === 'development') {
            console.error('Input Component Error: onChange prop must be a function.');
        }
        return null;
    }


  const handleChange = (event) => {
        const sanitizedValue = sanitizeInput(event.target.value);
    onChange(sanitizedValue);
  };


  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={`${styles.input} ${className || ''}`}
    />
  );
};


Input.propTypes = {
    type: PropTypes.oneOf(['text', 'email', 'password', 'number']).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
};


export default Input;