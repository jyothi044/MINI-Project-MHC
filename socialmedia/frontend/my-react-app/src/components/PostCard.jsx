import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Heart, MessageCircle, Send } from "lucide-react";
import { API_BASE_URL } from "../config";

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

  const handleLike = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts/${post.id}/like/`);
      setIsLiked(!isLiked);
      setLikesCount(response.data.likes_count); // Ensure API returns updated likes_count
    } catch (error) {
      console.error("Error liking post:", error.response?.data || error.message);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return; // Prevent empty comments
    try {
      const response = await axios.post(`${API_BASE_URL}/posts/${post.id}/comments/`, { content: comment });
      setComments([response.data, ...comments]); // Append the new comment
      setComment("");
    } catch (error) {
      console.error("Error commenting:", error.response?.data || error.message);
    }
  };

  const postImage = post.image || getRandomImage();

  return (
    <div className="bg-purple-800 bg-opacity-50 backdrop-blur-md rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center mb-4">
        <img
          src="https://res.cloudinary.com/teepublic/image/private/s--IxauvPkK--/t_Preview/b_rgb:191919,c_limit,f_jpg,h_630,q_90,w_630/v1514606592/production/designs/2236001_1.jpg"
          alt={post.author?.username}
          className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-purple-400"
        />
        <Link
          to={`/profile/${post.author?.username}`}
          className="font-semibold text-lg hover:text-purple-300 transition-colors"
        >
          {post.author?.username}
        </Link>
      </div>
      {postImage && (
        <img
          src={postImage}
          alt="Post content"
          className="w-full rounded-lg mb-4 max-h-96 object-cover"
        />
      )}
      <p className="text-white mb-4">{post.content}</p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center ${isLiked ? "text-red-500" : "text-gray-300"} hover:text-red-500 transition-colors`}
          >
            <Heart className="mr-2" />
            {likesCount} {likesCount === 1 ? "Like" : "Likes"}
          </button>
          <div className="flex items-center text-gray-300">
            <MessageCircle className="mr-2" />
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </div>
        </div>
      </div>
      <form onSubmit={handleComment} className="flex items-center mb-4">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 bg-purple-900 bg-opacity-50 rounded-l-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
        />
        <button type="submit" className="bg-purple-600 p-2 rounded-r-full hover:bg-purple-700 transition-colors">
          <Send size={20} />
        </button>
      </form>
      <div className="space-y-2">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start bg-purple-900 bg-opacity-50 p-2 rounded-lg">
            <img
              src="https://res.cloudinary.com/teepublic/image/private/s--IxauvPkK--/t_Preview/b_rgb:191919,c_limit,f_jpg,h_630,q_90,w_630/v1514606592/production/designs/2236001_1.jpg"
              alt={comment.author?.username}
              className="w-8 h-8 rounded-full mr-2 object-cover"
            />
            <div>
              <Link
                to={`/profile/${comment.author?.username}`}
                className="font-semibold text-purple-300 hover:text-purple-200 transition-colors"
              >
                {comment.author?.username}
              </Link>
              <p className="text-white">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCard;
