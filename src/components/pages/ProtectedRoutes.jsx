import React from 'react'
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({children, requiredRole}) => {
// Get token from localstorage
const token=localStorage.getItem('token');
const user=JSON.parse(localStorage.getItem("user")|| "null");


// Check if token exists
if(!token || !user){
  return <Navigate to="/" replace/>
}


// Check for role mismatch
if(requiredRole && user.role!==requiredRole){
  if(user.role==="student") return <Navigate to="/student" replace/>
  if(user.role==="teacher") return <Navigate to="/teacher" replace/>
  if(user.role==="admin") return <Navigate to="/admin" replace/>
  return <Navigate to="/login" replace/>;

}  

return children;

}

export default ProtectedRoutes;
