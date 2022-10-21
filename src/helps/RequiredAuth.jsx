import React, { useContext } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function RequiredAuth() {
    const {currentUser} = useContext(AuthContext)
    const location = useLocation();
  return currentUser ? 
  <Outlet />
  : <Navigate to="/sign" state={{ from: location }} replace />
}

export default RequiredAuth