import React from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const Navigate=useNavigate();
  return (
    <div>
      Dashboard
        <button onClick={()=>Navigate(-1)}>
            Logout
        </button>
    </div>
  )
}

export default Dashboard