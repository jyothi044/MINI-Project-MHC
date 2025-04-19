// PostCard.js
import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';
import { Heart, MessageCircle, Send } from 'react-native-feather';
import { API_BASE_URL } from '../config';

const randomImages = [
  "https://i.pinimg.com/originals/e0/3e/db/e03edbe588d3866d539e5bbb35d9080c.jpg",
  "https://images.unsplash.com/photo-1698777443732-9f6c2b14183b",
  "https://images.unsplash.com/photo-1700237041284-4c63b1b5a0d4",
  "https://images.unsplash.com/photo-1700961006286-1a294a025892",
  "https://images.unsplash.com/photo-1700336787316-23e224a63ff9",
];

const PostCard = ({ post, onUpdate }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked_by_user);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [comment, setComment] = useState("");

  const getRandomImage = () => {
    return randomImages[Math.floor(Math.random() * randomImages.length)];
  };

  const handleLike = useCallback(async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts/${post.id}/like/`);
      setIsLiked(!isLiked);
      setLikesCount(response.data.likes_count);
    } catch (error) {
      console.error("Error liking post:", error.response?.data || error.message);
    }
  }, [post.id, isLiked]);

  const handleComment = useCallback(async () => {
    if (!comment.trim()) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/posts/${post.id}/comments/`, { content: comment });
      setComments([response.data, ...comments]);
      setComment("");
    } catch (error) {
      console.error("Error commenting:", error.response?.data || error.message);
    }
  }, [post.id, comment, comments]);

  const postImage = post.image || getRandomImage();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://res.cloudinary.com/teepublic/image/private/s--IxauvPkK--/t_Preview/b_rgb:191919,c_limit,f_jpg,h_630,q_90,w_630/v1514606592/production/designs/2236001_1.jpg" }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{post.author?.username}</Text>
      </View>
      {postImage && (
        <Image
          source={{ uri: postImage }}
          style={styles.postImage}
        />
      )}
      <Text style={styles.content}>{post.content}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <Heart width={24} height={24} color={isLiked ? "#e53e3e" : "#a0aec0"} />
          <Text style={styles.actionText}>{likesCount} {likesCount === 1 ? "Like" : "Likes"}</Text>
        </TouchableOpacity>
        <View style={styles.actionButton}>
          <MessageCircle width={24} height={24} color="#a0aec0" />
          <Text style={styles.actionText}>{comments.length} {comments.length === 1 ? "Comment" : "Comments"}</Text>
        </View>
      </View>
      <View style={styles.commentForm}>
        <TextInput
          style={styles.commentInput}
          value={comment}
          onChangeText={setComment}
          placeholder="Add a comment..."
          placeholderTextColor="#a0aec0"
        />
        <TouchableOpacity onPress={handleComment} style={styles.sendButton}>
          <Send width={24} height={24} color="#805ad5" />
        </TouchableOpacity>
      </View>
      {comments.map((comment) => (
        <View key={comment.id} style={styles.commentContainer}>
          <Image
            source={{ uri: comment.author?.profile_picture || "https://via.placeholder.com/150" }}
            style={styles.commentAvatar}
          />
          <View style={styles.commentContent}>
            <Text style={styles.commentUsername}>{comment.author?.username}</Text>
            <Text style={styles.commentText}>{comment.content}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(128, 90, 213, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  content: {
    color: 'white',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#a0aec0',
    marginLeft: 4,
  },
  commentForm: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'rgba(74, 85, 104, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: 'white',
  },
  sendButton: {
    marginLeft: 8,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
    backgroundColor: 'rgba(74, 85, 104, 0.5)',
    borderRadius: 8,
    padding: 8,
  },
  commentUsername: {
    fontWeight: 'bold',
    color: '#d6bcfa',
    marginBottom: 4,
  },
  commentText: {
    color: 'white',
  },
});

export default PostCard;