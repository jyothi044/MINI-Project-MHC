// PrivateRoute.js
import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#a0aec0' }}>Loading...</Text>
      </View>
    );
  }

  return user ? children : null;
};

export default PrivateRoute;