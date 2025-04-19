// EditProfile.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Save, Camera } from 'react-native-feather';
import * as ImagePicker from 'expo-image-picker';

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(user?.profile_picture || null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.uri);
      setPreview(result.uri);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("bio", bio);
    if (profilePicture) {
      formData.append("profile_picture", {
        uri: profilePicture,
        type: 'image/jpeg',
        name: 'profile_picture.jpg',
      });
    }

    const result = await updateProfile(formData);
    if (result.success) {
      navigation.navigate('Profile', { username: user.username });
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity style={styles.avatarContainer} onPress={handleImagePick}>
        <Image
          source={{ uri: preview || "https://via.placeholder.com/150" }}
          style={styles.avatar}
        />
        <View style={styles.cameraIconContainer}>
          <Camera width={24} height={24} color="white" />
        </View>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={bio}
        onChangeText={setBio}
        placeholder="Tell us about yourself..."
        placeholderTextColor="#a0aec0"
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Save width={24} height={24} color="white" />
        <Text style={styles.buttonText}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  cameraIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#805ad5',
    borderRadius: 20,
    padding: 8,
  },
  input: {
    backgroundColor: 'rgba(74, 85, 104, 0.5)',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#805ad5',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  errorText: {
    color: '#fc8181',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default EditProfile;