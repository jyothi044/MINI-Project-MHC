import React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { HomeIcon, PlusCircle, User, LogOut, Search, Users } from "lucide-react"

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-purple-800 bg-opacity-50 backdrop-blur-md text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-purple-300 transition-colors">
          DevConnect
        </Link>
        <div className="flex items-center space-x-6">
          {user ? (
            <div className="flex items-center space-x-6">
              <Link to="/" className="hover:text-purple-300 transition-colors flex items-center">
                <HomeIcon className="mr-2" /> Home
              </Link>
              <Link to="/create-post" className="hover:text-purple-300 transition-colors flex items-center">
                <PlusCircle className="mr-2" /> Create
              </Link>
              <Link to="/search" className="hover:text-purple-300 transition-colors flex items-center">
                <Search className="mr-2" /> Search
              </Link>
              <Link to="/all-users" className="hover:text-purple-300 transition-colors flex items-center">
                <Users className="mr-2" /> All Users
              </Link>
              <Link
                to={`/profile/${user.username}`}
                className="hover:text-purple-300 transition-colors flex items-center"
              >
                <User className="mr-2" /> Profile
              </Link>
              <button onClick={logout} className="hover:text-red-400 transition-colors flex items-center">
                <LogOut className="mr-2" /> Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="border border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-full transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
