import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Save, Camera } from "lucide-react"

const EditProfile = () => {
  const { user, updateProfile } = useAuth()
  const [bio, setBio] = useState(user?.bio || "")
  const [profilePicture, setProfilePicture] = useState(null)
  const [preview, setPreview] = useState(user?.profile_picture || null)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setProfilePicture(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("bio", bio)
    if (profilePicture) {
      formData.append("profile_picture", profilePicture)
    }

    const result = await updateProfile(formData)
    if (result.success) {
      navigate(`/profile/${user.username}`)
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-purple-800 bg-opacity-50 backdrop-blur-md rounded-xl p-8 shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">Edit Profile</h2>

      {error && <div className="bg-red-600 bg-opacity-25 text-red-300 p-3 rounded-lg text-center mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={preview || "/default-avatar.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
            />
            <label
              htmlFor="profilePicture"
              className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transition-colors"
            >
              <Camera size={20} />
              <input type="file" id="profilePicture" onChange={handleImageChange} className="hidden" accept="image/*" />
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-purple-300 mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-4 bg-purple-900 bg-opacity-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="4"
            placeholder="Tell us about yourself..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center"
        >
          <Save className="mr-2" /> Save Changes
        </button>
      </form>
    </div>
  )
}

export default EditProfile

