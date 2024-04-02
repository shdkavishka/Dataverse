// Home.jsx
import React from 'react';
import './Home.css';
import Logo from '../../assets/logo2.png';
import { useAuthContext } from '@asgardeo/auth-react';
import Dashboard from '../Dashboard/Dashboard';
import { Link } from 'react-router-dom';

const Home = () => {
  const { signIn,state } = useAuthContext();

  return (
    <>{(state.isAuthenticated)?(<Dashboard/>)
    :(<div className="Hero">
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
              <button type='submit'
               onClick={() => signIn()}>Login</button>
            </div>
            <div>
              <button type='submit' >SignIn</button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">@divergent</div>
    </div>)
}</>
  );
};
export default Home;
