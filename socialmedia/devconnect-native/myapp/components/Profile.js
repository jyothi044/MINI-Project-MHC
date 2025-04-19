// Profile.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Edit, UserPlus, UserMinus } from 'react-native-feather';

const DEFAULT_PROFILE_PIC = "https://wallpaperaccess.com/full/1111980.jpg";

const Profile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { username } = route.params;
  const { user, updateUser, getAccessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getAccessToken();
        const response = await axios.get(
          `${API_BASE_URL}/users/${username}/`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, getAccessToken]);

  const handleFollowToggle = async () => {
    try {
      const token = await getAccessToken();
      const response = await axios.post(
        `${API_BASE_URL}/users/${profile.id}/follow/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const { status, followers_count, following_count, is_followed } = response.data;

      setProfile(prevProfile => ({
        ...prevProfile,
        is_followed,
        followers_count,
      }));

      if (user) {
        updateUser({
          ...user,
          following_count: following_count,
        });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;
  if (!profile) return <Text style={styles.errorText}>Profile not found</Text>;

  const avatarUrl = imageError ? DEFAULT_PROFILE_PIC : (profile.profile_picture || DEFAULT_PROFILE_PIC);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: avatarUrl }}
          style={styles.avatar}
          onError={() => setImageError(true)}
        />
        <Text style={styles.username}>{profile.username}</Text>
        <Text style={styles.bio}>{profile.bio || "No bio available"}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.followers_count}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.following_count}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {user && user.username !== profile.username && (
        <TouchableOpacity
          style={[styles.button, profile.is_followed ? styles.unfollowButton : styles.followButton]}
          onPress={handleFollowToggle}
        >
          {profile.is_followed ? (
            <UserMinus width={24} height={24} color="white" />
          ) : (
            <UserPlus width={24} height={24} color="white" />
          )}
          <Text style={styles.buttonText}>
            {profile.is_followed ? 'Unfollow' : 'Follow'}
          </Text>
        </TouchableOpacity>
      )}

      {user && user.username === profile.username && (
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Edit width={24} height={24} color="white" />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d3748',
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 14,
    color: '#a0aec0',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  followButton: {
    backgroundColor: '#805ad5',
  },
  unfollowButton: {
    backgroundColor: '#e53e3e',
  },
  editButton: {
    backgroundColor: '#4299e1',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  loadingText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    color: '#fc8181',
    fontSize: 18,
    marginTop: 20,
  },
});

export default Profile;