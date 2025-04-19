import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ImageIcon, Send } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, getAccessToken } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const formData = new FormData();
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(`${API_BASE_URL}/posts/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post created successfully:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);

      let errorMessage = "An error occurred while creating the post.";
      if (error.response) {
        console.log("Error response data:", error.response.data);
        errorMessage =
          error.response.data.detail ||
          JSON.stringify(error.response.data) ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response received from server. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-purple-800 bg-opacity-50 backdrop-blur-md rounded-xl p-8 shadow-2xl">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">Create Post</h1>
      {error && <div className="bg-red-500 text-white p-4 rounded-lg mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-purple-300 mb-2">
            What's on your mind?
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 bg-purple-900 bg-opacity-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="4"
            placeholder="Share your thoughts..."
            required
            disabled={isSubmitting}
          ></textarea>
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-purple-300 mb-2 flex items-center">
            <ImageIcon className="mr-2 text-purple-400" /> Add Image (Optional)
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full bg-purple-900 bg-opacity-50 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isSubmitting}
          />
          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="max-h-80 object-cover mx-auto rounded-xl"
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          disabled={isSubmitting}
        >
          <Send className="inline-block mr-2" />
          {isSubmitting ? "Creating..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
