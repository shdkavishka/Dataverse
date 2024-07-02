import React from 'react'
import './Home.css'
import Logo from "../../assets/logo.png"
import { Link } from 'react-router-dom';
import Footer from "../footer-all/footer"


//AH-- Home 
const Home = () => {

  return (
    <div className="Hero">
      <div className="left">
        <img
          src={Logo}
          alt="logo"
          className="logoh"
        />
        <div className="heroText">
          <div>
            Create Your Charts&nbsp; &nbsp; &nbsp; &nbsp;<span></span>
          </div>
          <br />
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
              <Link to="/Login">
                <button className='Home-But'>Login</button>
              </Link>
            </div>
            <div>
              <Link to="/SignIn">
                <button className='Home-But'>Sign In</button>
              </Link>
            </div>

          </div>
        </div>
      </div>
     <Footer/>
    </div>
  );
};

export default Home

