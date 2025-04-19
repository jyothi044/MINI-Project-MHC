// Home.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import axios from 'axios';
import PostCard from './PostCard';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const LoadingSkeleton = () => (
  <View style={styles.skeletonContainer}>
    {[1, 2, 3].map((i) => (
      <View key={i} style={styles.skeletonItem}>
        <View style={styles.skeletonAvatar} />
        <View style={styles.skeletonContent} />
      </View>
    ))}
  </View>
);

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { getAccessToken } = useAuth();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/posts/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const fetchedPosts = response.data.results || response.data || [];
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, [fetchPosts]);

  const renderItem = ({ item }) => (
    <PostCard post={item} onUpdate={fetchPosts} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Feed</Text>
      {loading && !refreshing ? (
        <LoadingSkeleton />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No posts available.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#2d3748',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  skeletonContainer: {
    flex: 1,
  },
  skeletonItem: {
    backgroundColor: 'rgba(128, 90, 213, 0.2)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  skeletonAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(128, 90, 213, 0.5)',
    marginBottom: 12,
  },
  skeletonContent: {
    height: 100,
    backgroundColor: 'rgba(128, 90, 213, 0.5)',
    borderRadius: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#a0aec0',
    fontSize: 16,
  },
});

export default Home;