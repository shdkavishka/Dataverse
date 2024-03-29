import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo2.png';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="Hero">
      <div className="left">
        <img
          src={Logo}
          alt="logo"
          className="logo"
        />
        <div className="heroText">
          <div>
            Create Your Charts&nbsp; &nbsp; &nbsp; &nbsp;<span></span>
          </div>
          <div>
            with JUST chats&nbsp; &nbsp;&nbsp; &nbsp;<span></span>
          </div>
        </div>
      </div>
      <div className="right">
        <div>
          <div className="homeText">Get Started</div>
          <div className="HomeButton">
            <div>
                <button onClick={() => navigate('/Login')}>Login</button>
            </div>
            <div>
              <button onClick={() => navigate('/Signin')}>SignIn</button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">@divergent</div>
    </div>
  );
};

export default Home;
