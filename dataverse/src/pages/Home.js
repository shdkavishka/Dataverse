import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const Navigate=useNavigate();
  return (
    <div>Home
           <button onClick={()=>Navigate('Signin')}>
            Signin
        </button>
        <button onClick={()=>Navigate('Login')}>
            Login
        </button>
    </div>
  )
}

export default Home