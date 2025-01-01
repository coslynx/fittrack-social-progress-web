import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

/**
 * Reusable button component.
 *
 * @param {object} props - The component props.
 * @param {function} props.onClick - The click handler function.
 * @param {React.ReactNode} props.children - The content to render within the button.
 * @param {string} [props.className] - Optional CSS class name to apply.
 * @returns {JSX.Element} The button element.
 * @throws {Error} If onClick prop is not a function or children prop is missing.
 */
const Button = ({ onClick, children, className }) => {

    if (onClick && typeof onClick !== 'function') {
         if(process.env.NODE_ENV === 'development'){
             console.error('Button Component Error: onClick prop must be a function.');
         }
        return null;
    }

     if (!children) {
        if(process.env.NODE_ENV === 'development'){
            console.error('Button Component Error: children prop is required.');
        }
       return null;
    }


  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      className={`${styles.button} ${className || ''}`}
      onClick={handleClick}
      type="button"
    >
      {children}
    </button>
  );
};


Button.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};


export default Button;