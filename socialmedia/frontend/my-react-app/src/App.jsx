import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import Profile from "./components/Profile"
import EditProfile from "./components/EditProfile"
import CreatePost from "./components/CreatePost"
import Search from "./components/Search"
import PrivateRoute from "./components/PrivateRoute"
import AllUsers from "./components/AllUsers"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<Search />} />
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/all-users" element={<AllUsers />} />
              </Route>
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

