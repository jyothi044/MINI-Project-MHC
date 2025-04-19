import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import { API_BASE_URL } from "../config"
import { Edit, UserPlus, UserMinus } from "lucide-react"

const DEFAULT_PROFILE_PIC = "https://wallpaperaccess.com/full/1111980.jpg"

const Profile = () => {
  const { username } = useParams()
  const { user, updateUser, getAccessToken } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getAccessToken()
        const response = await axios.get(
          `${API_BASE_URL}/users/${username}/`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setProfile(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile")
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username, getAccessToken])

  const handleFollowToggle = async () => {
    try {
      const token = getAccessToken()
      const response = await axios.post(
        `${API_BASE_URL}/users/${profile.id}/follow/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      const { status, followers_count, following_count, is_followed } = response.data

      // Update profile state to reflect the changes
      setProfile(prevProfile => ({
        ...prevProfile,
        is_followed,
        followers_count,
      }))

      // If the user is logged in, update their following count as well
      if (user) {
        updateUser({
          ...user,
          following_count: following_count, // Update following count in the logged-in user's state
        })
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  if (loading) return <div className="text-center text-white mt-8">Loading...</div>
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>
  if (!profile) return <div className="text-center text-white mt-8">Profile not found</div>

  const avatarUrl = imageError ? DEFAULT_PROFILE_PIC : (profile.profile_picture || DEFAULT_PROFILE_PIC)

  return (
    <div className="max-w-4xl mx-auto bg-purple-800 bg-opacity-50 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden">
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-purple-600 to-blue-600"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <img
            src={avatarUrl}
            alt={`${profile.username}'s avatar`}
            onError={handleImageError}
            className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
          />
        </div>
      </div>
      <div className="pt-20 px-6 pb-6 text-center">
        <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
        <p className="text-purple-300 mt-2">{profile.bio || "No bio available"}</p>

        <div className="flex justify-center space-x-6 mt-6 text-white">
          <div className="flex flex-col items-center">
            <span className="font-bold text-2xl">{profile.followers_count}</span>
            <span className="block text-purple-300">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-2xl">{profile.following_count}</span>
            <span className="block text-purple-300">Following</span>
          </div>
        </div>

        {user && user.username !== profile.username && (
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={handleFollowToggle}
              className={`flex items-center px-6 py-3 rounded-full transition-colors ${
                profile.is_followed
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {profile.is_followed ? (
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
        )}

        {user && user.username === profile.username && (
          <div className="mt-6 flex justify-center space-x-4">
            <Link
              to="/edit-profile"
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors"
            >
              <Edit className="mr-2" /> Edit Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

