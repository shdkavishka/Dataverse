import React from 'react'
import { useNavigate } from 'react-router-dom'

const Signin = () => {
  const Navigate=useNavigate();
  return (
    <div>Signin
        <button onClick={()=>Navigate('Dashboard')}>
            Signin
        </button>
    </div>
  )
}

export default Signin