import axios from 'axios';

axios.interceptors.response.use(
  response => response, // Return response if successful
  async error => {
    const originalRequest = error.config;

    // Check if the error is due to an expired token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call your refresh token endpoint
        const response = await axios.post('http://localhost:3001/auth/refresh-token');
        const { accessToken } = response.data;

        // Update the token in localStorage
        localStorage.setItem('accessToken', accessToken);


        // Update the header and resend the original request
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Handle failed refresh here (e.g., redirect to login)
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Export configured Axios instance
export default axios;
