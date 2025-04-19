import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { API_BASE_URL } from "../config"
import { UserPlus, UserMinus } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const AllUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, getAccessToken } = useAuth()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getAccessToken()
        const response = await axios.get(`${API_BASE_URL}/users/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUsers(response.data.filter((u) => u.username !== user.username))
        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
        setError("Failed to load users")
        setLoading(false)
      }
    }

    fetchUsers()
  }, [user.username, getAccessToken])

  const handleFollowToggle = async (userId) => {
    try {
      const token = getAccessToken()
      const response = await axios.post(
        `${API_BASE_URL}/users/${userId}/follow/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setUsers(
        users.map((u) => {
          if (u.id === userId) {
            return {
              ...u,
              is_followed: response.data.status === "Followed",
              followers_count: response.data.followers_count,
            }
          }
          return u
        }),
      )
    } catch (error) {
      console.error("Error toggling follow:", error)
    }
  }

  if (loading) return <div className="text-center text-white mt-8">Loading...</div>
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">All Users</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div key={user.id} className="bg-purple-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-4">
              <img
                src={user.profile_picture || "/placeholder.svg"}
                alt={`${user.username}'s avatar`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <Link
                  to={`/profile/${user.username}`}
                  className="text-lg font-semibold text-white hover:text-purple-300"
                >
                  {user.username}
                </Link>
                <p className="text-purple-300 text-sm">{user.followers_count} followers</p>
              </div>
            </div>
            <button
              onClick={() => handleFollowToggle(user.id)}
              className={`mt-4 w-full flex items-center justify-center px-4 py-2 rounded-full transition-colors ${
                user.is_followed
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {user.is_followed ? (
                <>
                  <UserMinus className="mr-2" /> Unfollow
                </>
              ) : (
                <>
                  <UserPlus className="mr-2" /> Follow
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllUsers

