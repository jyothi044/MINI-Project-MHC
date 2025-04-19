// Search.js
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Search as SearchIcon } from 'react-native-feather';
import { API_BASE_URL } from '../config';

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/search/?q=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error("Error searching:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate('Profile', { username: item.author.username })}
    >
      <Image
        source={{ uri: item.author.profile_picture || "https://via.placeholder.com/150" }}
        style={styles.avatar}
      />
      <View style={styles.resultContent}>
        <Text style={styles.username}>{item.author.username}</Text>
        <Text style={styles.postContent} numberOfLines={2}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search DevConnect</Text>
      <View style={styles.searchContainer}>
        <SearchIcon width={24} height={24} color="#805ad5" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search posts or users..."
          placeholderTextColor="#a0aec0"
          onSubmitEditing={handleSearch}
        />
      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}
      {!loading && results.length === 0 && (
        <Text style={styles.noResultsText}>No results found</Text>
      )}
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.resultsList}
      />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 85, 104, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    paddingVertical: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    color: '#a0aec0',
    fontSize: 16,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#a0aec0',
    fontSize: 16,
    marginTop: 20,
  },
  resultsList: {
    paddingTop: 8,
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(128, 90, 213, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  postContent: {
    color: '#a0aec0',
  },
});

export default Search;