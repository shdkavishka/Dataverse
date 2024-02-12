import React from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const Navigate=useNavigate();
  return (
    <div>Login
        <button onClick={()=>Navigate('Dashboard')}>
            Login
        </button>
    </div>
  )
}

export default Login