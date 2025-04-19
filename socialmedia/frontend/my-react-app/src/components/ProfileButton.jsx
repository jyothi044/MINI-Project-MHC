import React from "react"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"

const ProfileButton = () => {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <Link to="/login" className="btn btn-primary">
        Login
      </Link>
    )
  }

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="profileDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {user.username}
      </button>
      <ul className="dropdown-menu" aria-labelledby="profileDropdown">
        <li>
          <Link className="dropdown-item" to={`/profile/${user.username}`}>
            My Profile
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/edit-profile">
            Edit Profile
          </Link>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <button className="dropdown-item" onClick={logout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default ProfileButton

