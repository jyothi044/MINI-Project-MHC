import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const PrivateRoute = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="text-center text-dark-text mt-8">Loading...</div>
  }

  return user ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute

