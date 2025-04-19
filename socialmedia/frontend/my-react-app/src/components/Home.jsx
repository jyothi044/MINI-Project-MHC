import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import PostCard from "./PostCard"
import { API_BASE_URL } from "../config"
import { useAuth } from "../context/AuthContext"

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { getAccessToken } = useAuth()

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      const token = await getAccessToken()
      const response = await axios.get(`${API_BASE_URL}/posts/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const fetchedPosts = response.data.results || response.data || []
      setPosts(fetchedPosts)
    } catch (error) {
      console.error("Error fetching posts:", error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [getAccessToken])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-300">Home Feed</h1>
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
        </div>
      ) : Array.isArray(posts) && posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onUpdate={fetchPosts} 
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-300">No posts available.</p>
      )}
    </div>
  )
}

export default Home