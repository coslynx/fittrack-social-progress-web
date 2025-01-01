import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

/**
 * Makes an API request using axios.
 *
 * @param {object} options - The request options.
 * @param {string} options.url - The request URL (relative to BASE_URL).
 * @param {string} [options.method='GET'] - The HTTP method (GET, POST, PUT, DELETE).
 * @param {object} [options.data] - The request body data (for POST, PUT, and PATCH).
 * @param {object} [options.headers] - Custom headers to include in the request.
 * @returns {Promise<any>} A promise that resolves to the API response data.
 * @throws {Error} If the request fails due to network or API errors.
 */
async function request({ url, method = 'GET', data, headers }) {
  if (typeof url !== 'string') {
    throw new Error('URL must be a string.');
  }

  const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    if (!validMethods.includes(method.toUpperCase())) {
    throw new Error(`Invalid HTTP method: ${method}. Must be one of GET, POST, PUT, DELETE, or PATCH`);
    }

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const config = {
      url: `${BASE_URL}${url}`,
      method: method.toUpperCase(),
      headers: requestHeaders,
    };

  if (data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT' || method.toUpperCase() === 'PATCH')) {
     config.data = data;
   }

  console.log(`API Request: ${method.toUpperCase()} ${BASE_URL}${url}`);


  try {
    const response = await axios(config);

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
        let errorData = null;
        if(response.data){
             errorData = response.data;
            }
      throw {
            status: response.status,
           data: errorData,
            message: `API Error: ${response.status} - ${errorData?.message || 'Request failed'}`,
       };
    }
  } catch (error) {
      if(error.response){
         let errorData = null;
        if(error.response.data){
            errorData = error.response.data
            }
         throw {
                status: error.response.status,
                data: errorData,
                message: `API Error: ${error.response.status} - ${errorData?.message || 'Request failed'}`
            };
      }else if (error.request){
            console.error('Network Error:', error.message);
           throw {
             message: `Network Error: ${error.message}`
            };
      } else{
        console.error('Request Setup Error:', error.message);
         throw {
           message: `Request Setup Error: ${error.message}`
           };
      }
  }
}


export { request };


/* Test Cases:

   Test Case 1: Successful GET request
        - Mock the axios call to return a successful response with data.
        - Call the api.request with a GET request.
        - Assert that the function returns the expected data.
        - Assert that no errors were thrown.

   Test Case 2: Successful POST request
        - Mock the axios call to return a successful response with data.
        - Call the api.request with a POST request and data.
        - Assert that the function returns the expected data.
        - Assert that no errors were thrown.

   Test Case 3: API error with status code 400
        - Mock the axios call to return an error response with status 400 and error data.
        - Call the api.request and expect an error to be thrown
        - Assert that the error contains the status code and error data.

   Test Case 4: API error with status code 500
        - Mock the axios call to return an error response with status 500 and error data.
        - Call the api.request and expect an error to be thrown.
         - Assert that the error contains the status code and error data.

   Test Case 5: Network error
        - Mock the axios call to simulate a network error.
        - Call the api.request and expect an error to be thrown.
        - Assert that the error message indicates a network error.

   Test Case 6: Invalid URL
        - Call api.request with an invalid URL
        - Assert that the function throws an error with 'URL must be a string.' message

   Test Case 7: Invalid method
        - Call api.request with an invalid method
        - Assert that the function throws an error with the proper error message.

   Test Case 8:  Default method is GET
        - Call the function without specifying a method
        - Assert that the function makes a GET request

  Test Case 9:  Data is sent for POST, PUT, PATCH
         - Mock axios with the relevant data
         - Call the api with a POST, PUT and Patch method
         - Assert that axios receives the data

   Test Case 10:  Data is NOT sent for GET
        - Call the function with GET method and data
        - Assert that data is not sent
*/