// Navbar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { HomeIcon, PlusCircle, User, LogOut, Search, Users } from 'react-native-feather';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.logo}>DevConnect</Text>
      </TouchableOpacity>
      <View style={styles.navItems}>
        {user ? (
          <>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
              <HomeIcon width={24} height={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('CreatePost')}>
              <PlusCircle width={24} height={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Search')}>
              <Search width={24} height={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AllUsers')}>
              <Users width={24} height={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile', { username: user.username })}>
              <User width={24} height={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={logout}>
              <LogOut width={24} height={24} color="white" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.authButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.authButton, styles.registerButton]} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.authButtonText}>Register</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(128, 90, 213, 0.5)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  navItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    marginLeft: 16,
  },
  authButton: {
    backgroundColor: '#805ad5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#805ad5',
  },
  authButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Navbar;