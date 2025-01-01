import { useState, useEffect, useMemo } from 'react';
import { request } from '../services/api';

/**
 * Custom React hook for making API requests with loading and error handling.
 *
 * @param {string} url - The API endpoint URL.
 * @param {object} [config] - Optional configuration object.
 * @param {string} [config.method='GET'] - The HTTP method (GET, POST, PUT, DELETE, PATCH).
 * @param {object} [config.data] - The request body data (for POST, PUT, and PATCH).
 * @returns {{data: any, loading: boolean, error: object | null}} An object containing the data, loading state, and error information.
 */
const useFetch = (url, config = {}) => {
    // Initialize data, loading, and error states
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Reset states and perform the API request when the URL or config changes
        const fetchData = async () => {
            if (typeof url !== 'string') {
                setError({ message: 'URL must be a string.' });
                return;
             }
            
            setLoading(true);
            setError(null);
            setData(null);


            try {
                 // Make API request using imported request function from src/services/api.js
                const response = await request({
                    url,
                    method: config.method || 'GET',
                    data: config.data,
                });
               
                // Update data if successful
                setData(response);
            } catch (err) {
                  // Set the error object with all the information
                   setError(err);
            } finally {
                // Set loading to false, regardless of outcome
                setLoading(false);
            }
        };
        fetchData();
    }, [url, JSON.stringify(config)]);


    // Memoize the returned object to prevent unnecessary re-renders
    const value = useMemo(() => ({
        data,
        loading,
        error,
    }), [data, loading, error]);

    return value;
};

export default useFetch;

/* Test Cases:
    Test Case 1: Successful GET request
        - Mock the api.request to return a successful response with data.
        - Call the useFetch hook with a GET request.
        - Assert that the hook returns the expected data.
        - Assert that loading is false after the request is complete.
        - Assert that no errors were returned.
    Test Case 2: Successful POST request
         - Mock the api.request to return a successful response with data.
         - Call the useFetch hook with a POST request and data.
         - Assert that the hook returns the expected data.
        - Assert that loading is false after the request is complete.
        - Assert that no errors were returned.
    Test Case 3: API error with status code 400
        - Mock the api.request to return an error response with status 400 and error data.
        - Call the useFetch hook and expect an error to be returned.
        - Assert that the error contains the status code and error data.
        - Assert that loading is false after the request is complete.
    Test Case 4: API error with status code 500
       - Mock the api.request to return an error response with status 500 and error data.
       - Call the useFetch hook and expect an error to be returned.
       - Assert that the error contains the status code and error data.
       - Assert that loading is false after the request is complete.
    Test Case 5: Network error
       - Mock the api.request to simulate a network error.
       - Call the useFetch hook and expect an error to be returned.
       - Assert that the error message indicates a network error.
       - Assert that loading is false after the request is complete.
    Test Case 6: Invalid URL
        - Call useFetch with an invalid URL
        - Assert that the error state is set with a specific message
    Test Case 7: Default method is GET
        - Call useFetch without specifying method
        - Assert that it defaults to GET method
   Test Case 8: Data is null when no data is returned.
        - Mock request that returns no data
        - Assert data returns null
   Test Case 9: Config is not required
        - Call useFetch without a config.
        - Should not throw an error.
   Test Case 10: Loading is true while requesting.
        - Assert loading is true while fetching.
*/