import { useAuth } from '../context/AuthContext';

// Hook to make authenticated API calls with automatic token refresh
export const useApiCall = () => {
  const { accessToken, refreshToken, logout } = useAuth();

  const apiCall = async (url, options = {}) => {
    let token = accessToken;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    // If 401 (token expired), refresh and retry
    if (response.status === 401) {
      try {
        token = await refreshToken();
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
      } catch (err) {
        logout();
        throw new Error('Session expired. Please login again.');
      }
    }

    return response;
  };

  return apiCall;
};
