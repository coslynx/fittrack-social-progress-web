import { request } from './api';

/**
 * Sanitizes and validates user credentials.
 *
 * @param {object} credentials - The user credentials object.
 * @param {string} credentials.username - The username to validate.
 * @param {string} credentials.password - The password to validate.
 * @throws {Error} If the username or password is null, empty or exceeds the length limit.
 */
function validateCredentials(credentials) {
    const { username, password } = credentials;
    if (!username || typeof username !== 'string' || username.trim() === '') {
        throw new Error('Username cannot be null or empty.');
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
        throw new Error('Password cannot be null or empty.');
    }

     const trimmedUsername = username.trim();
     const trimmedPassword = password.trim();
      if (trimmedUsername.length > 50) {
         throw new Error('Username cannot exceed 50 characters.');
      }
    if (trimmedPassword.length > 50) {
        throw new Error('Password cannot exceed 50 characters.');
    }
    
    return {
        username: trimmedUsername,
        password: trimmedPassword,
    };
}


/**
 * Makes a POST request to the /auth/login endpoint to log in a user.
 *
 * @param {object} credentials - The user's login credentials.
 * @param {string} credentials.username - The username of the user.
 * @param {string} credentials.password - The password of the user.
 * @returns {Promise<object>} A promise that resolves to an object containing the user and token.
 * @throws {Error} If the login request fails due to network or API errors.
 */
async function loginUser(credentials) {
    try {
        const validatedCredentials = validateCredentials(credentials);
        const response = await request({
            url: '/auth/login',
            method: 'POST',
            data: validatedCredentials,
        });

        if (response && response.user && response.token) {
            return { user: response.user, token: response.token };
        } else {
            throw new Error('Login failed: Invalid response format from server.');
        }
    } catch (error) {
      throw error;
    }
}


/**
 * Makes a POST request to the /auth/logout endpoint to log out a user.
 *
 * @returns {Promise<void>} A promise that resolves when the logout is complete.
 * @throws {Error} If the logout request fails due to network or API errors.
 */
async function logoutUser() {
  try {
    await request({
       url: '/auth/logout',
      method: 'POST',
    });
    } catch (error) {
         throw error;
    }
}

/**
 * Makes a GET request to the /auth/session endpoint to verify user session.
 *
 * @param {string} token - The authentication token to verify.
 * @returns {Promise<object>} A promise that resolves to the user object.
 * @throws {Error} If the session verification request fails due to network or API errors.
 */
async function getUserSession(token) {
    if (!token || typeof token !== 'string' || token.trim() === '') {
        throw new Error('Token cannot be null or empty.');
    }

     const trimmedToken = token.trim();

    try {
        const response = await request({
            url: '/auth/session',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${trimmedToken}`,
            },
        });

        if (response && response.user) {
            return response.user;
        } else {
            throw new Error('Session validation failed: Invalid response format from server.');
        }
    } catch (error) {
        throw error;
    }
}


export { loginUser, logoutUser, getUserSession };


/* Test Cases:
   Test Cases are outlined in `src/context/AuthContext.js`, this file should make sure that all the test cases for this module are fulfilled.

    Test Case 1: loginUser with valid credentials:
        - Should call the api with POST method and `/auth/login` endpoint
        - Should return user and token in an object if the request is successful
        - Should throw an error if response data is not formatted properly

    Test Case 2: loginUser with invalid credentials:
        - Should call the api with POST method and `/auth/login` endpoint
        - Should throw an error if response is not successful
        - Should throw an error when username is empty
        - Should throw an error when password is empty
        - Should throw an error when username is null
        - Should throw an error when password is null
        - Should throw an error if the response does not contain `user` and `token`

    Test Case 3: loginUser should throw a formatted error for API failures:
        - Should throw an error with the message if the API returns an error

    Test Case 4: loginUser handles network failures gracefully:
        - Should throw a network error message if the request fails

    Test Case 5: logoutUser with successful request:
        - Should call the api with POST method and `/auth/logout` endpoint
        - Should not return anything if the request is successful
        - Should not throw an error if the request is successful

    Test Case 6: logoutUser should throw a formatted error for API failures:
        - Should throw an error with the message if the API returns an error

    Test Case 7: logoutUser handles network failures gracefully:
         - Should throw a network error message if the request fails

    Test Case 8: getUserSession with valid token:
         - Should call the api with GET method and `/auth/session` endpoint
         - Should return the user object if the request is successful

    Test Case 9: getUserSession with invalid token:
         - Should call the api with GET method and `/auth/session` endpoint
         - Should throw an error if the token is invalid
         - Should throw an error if the token is an empty string
         - Should throw an error if the token is null

     Test Case 10: getUserSession should throw a formatted error for API failures:
        - Should throw an error with the message if the API returns an error

    Test Case 11: getUserSession handles network failures gracefully:
        - Should throw a network error message if the request fails

     Test Case 12: getUserSession should throw an error if the response does not contain user object

     Test Case 13: Input Sanitization
        - Input username and password strings should be trimmed
        - Should trim token string.

     Test Case 14: Validate Username/Password length
        - Should throw an error when username exceeds max characters
        - Should throw an error when password exceeds max characters
*/