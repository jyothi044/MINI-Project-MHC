// AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAuthToken = async (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await AsyncStorage.setItem('access_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      await AsyncStorage.removeItem('access_token');
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
        refresh: refreshToken,
      });
      const { access } = response.data;
      await setAuthToken(access);
      return access;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      throw error;
    }
  };

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshToken();
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    },
  );

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/me/`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      await setAuthToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        await setAuthToken(token);
        fetchUser();
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [fetchUser]);

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/token/`, credentials);
      const { access, refresh } = response.data;
      await setAuthToken(access);
      await AsyncStorage.setItem('refresh_token', refresh);
      await fetchUser();
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.detail || 'An error occurred during login. Please try again.',
      };
    }
  };

  const logout = async () => {
    await setAuthToken(null);
    await AsyncStorage.removeItem('refresh_token');
    setUser(null);
  };

  const register = async (userData) => {
    try {
      await axios.post(`${API_BASE_URL}/users/register/`, userData);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.detail || 'An error occurred during registration. Please try again.',
      };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/users/me/`, profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(response.data);
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: error.response?.data?.detail || 'An error occurred while updating the profile. Please try again.',
      };
    }
  };

  const getAccessToken = useCallback(async () => {
    return await AsyncStorage.getItem('access_token');
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    updateProfile,
    getAccessToken,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;