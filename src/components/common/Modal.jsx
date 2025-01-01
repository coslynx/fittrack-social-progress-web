import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';
import ReactDOM from 'react-dom';

/**
 * Reusable modal component.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Controls the visibility of the modal. Required.
 * @param {function} props.onClose - Callback function to close the modal. Required.
 * @param {React.ReactNode} props.children - The content to render within the modal. Required.
 * @param {string} [props.className] - Optional CSS class name to apply to the modal root element.
 * @returns {JSX.Element|null} The modal element or null if props are invalid.
 * @throws {Error} If isOpen or onClose props are invalid or children prop is missing.
 */
const Modal = ({ isOpen, onClose, children, className }) => {
    if (typeof isOpen !== 'boolean') {
        if (process.env.NODE_ENV === 'development') {
            console.error('Modal Component Error: isOpen prop must be a boolean.');
        }
        return null;
    }

    if (typeof onClose !== 'function') {
        if (process.env.NODE_ENV === 'development') {
             console.error('Modal Component Error: onClose prop must be a function.');
        }
        return null;
    }

    if (!children) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Modal Component Error: children prop is required.');
        }
        return null;
    }
    
    const modalRef = useRef(null);


    const handleClose = useCallback(() => {
         onClose();
    }, [onClose]);

    const handleOverlayClick = useCallback((event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
           handleClose();
        }
    }, [handleClose, modalRef]);


    const handleKeyDown = useCallback((event) => {
        if (event.key === 'Escape') {
           handleClose();
        }
    }, [handleClose]);


    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleOverlayClick);
             // Ensure focus is trapped within the modal
            if(modalRef.current){
                 const focusableElements = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if(focusableElements.length > 0){
                   focusableElements[0].focus();
                }
            }
         } else {
            document.removeEventListener('keydown', handleKeyDown);
             document.removeEventListener('mousedown', handleOverlayClick);
        }
        return () => {
           document.removeEventListener('keydown', handleKeyDown);
           document.removeEventListener('mousedown', handleOverlayClick);
        };
    }, [isOpen, handleKeyDown, handleOverlayClick]);


    if (!isOpen) {
         return null;
    }


    return ReactDOM.createPortal(
        <div className={`${styles.modal} ${className || ''}`}  role="dialog" aria-modal="true" >
            <div className={styles['modal-overlay']} onClick={handleOverlayClick} />
            <div className={styles['modal-content']} ref={modalRef}>
                {children}
            </div>
        </div>,
       document.body
    );
};


Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Modal;