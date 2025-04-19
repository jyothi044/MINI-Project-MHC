// AllUsers.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { UserPlus, UserMinus } from 'react-native-feather';

const AllUsers = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, getAccessToken } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await getAccessToken();
        const response = await axios.get(`${API_BASE_URL}/users/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.filter((u) => u.username !== user.username));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user.username, getAccessToken]);

  const handleFollowToggle = async (userId) => {
    try {
      const token = await getAccessToken();
      const response = await axios.post(
        `${API_BASE_URL}/users/${userId}/follow/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUsers(
        users.map((u) => {
          if (u.id === userId) {
            return {
              ...u,
              is_followed: response.data.status === "Followed",
              followers_count: response.data.followers_count,
            };
          }
          return u;
        }),
      );
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Image
          source={{ uri: item.profile_picture || "https://via.placeholder.com/150" }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.followersCount}>{item.followers_count} followers</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleFollowToggle(item.id)}
        style={[
          styles.followButton,
          { backgroundColor: item.is_followed ? '#e53e3e' : '#805ad5' }
        ]}
      >
        {item.is_followed ? (
          <UserMinus width={20} height={20} color="white" />
        ) : (
          <UserPlus width={20} height={20} color="white" />
        )}
        <Text style={styles.followButtonText}>
          {item.is_followed ? 'Unfollow' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Users</Text>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  userCard: {
    backgroundColor: 'rgba(128, 90, 213, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  followersCount: {
    fontSize: 14,
    color: '#d6bcfa',
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  followButtonText: {
    color: 'white',
    marginLeft: 8,
  },
  loadingText: {
    textAlign: 'center',
    color: 'white',
    marginTop: 32,
  },
  errorText: {
    textAlign: 'center',
    color: '#fc8181',
    marginTop: 32,
  },
});

export default AllUsers;