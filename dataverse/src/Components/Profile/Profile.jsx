import React, { useState, useEffect } from "react";
import editprofile from "../../assets/edit.png";
import "./profile.css";
import logo from "../../assets/logo.png";
import ChangePassW from "./pop-ups/ChangePW";
import DeleteAcc from "./pop-ups/DeleteAcc";
import DeleteConGoogle from "./pop-ups/deleteconGoogle";
import { Link } from "react-router-dom";
import Toast from "../Toast/Toast";
import Header from "../header-all/Header1";
import Footer from "../footer-all/footer";
import handleLogout from "../Logout/Logout";
import dp from "../../assets/default.png"





//AH-- profile

const Profile = () => {
  //AH-- for current user profile
  const [profile, setProfile] = useState(null);
  //AH-- to handle pop ups appear and disappear
  const [ChangePassWButton, SetChangePassWButton] = useState(false);
  const [DeleteAccButton, SetDeleteAccButton] = useState(false);
  const [DeleteAccSocialButton, SetDeleteAccSocialButton] = useState(false);

  //AH-- to handle edit profile
  const [isEditing, setIsEditing] = useState(false);

  //AH-- for User data
  const [id, setID] = useState("");
  const [first_Name, setFirstName] = useState("");
  const [last_Name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [userName, setUserName] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [google_id, seGoogle_id] = useState("");

  //AH-- State to store the selected profile picture file
  const [profilePicFile, setProfilePicFile] = useState(null);

  //AH-- for toast, types success, error, alert
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  //AH-- Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

 

  // AH-- Send GET request to the user profile endpoint in backend
  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/user", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const profileData = await response.json();
      setProfile(profileData);
      // AH-- Set extracted user data to state variables
      setID(profileData.id);
      setFirstName(profileData.firstName);
      setLastName(profileData.lastName);
      setEmail(profileData.email);
      setBio(profileData.bio);
      setUserName(profileData.name);
      setGender(profileData.gender);
      setLocation(profileData.location);
      seGoogle_id(profileData.google_id);
      setProfilePic(profileData.profilePicture);
    } catch (error) {
      console.error("Error fetching user data:", error);
      showToast("Error fetching user data:", "error");
    }
  };

  //AH-- Handle form submission to update user profile
  // AH-- update button(form submit)

  const handleSubmit = async (e) => {
    e.preventDefault();

    // AH-- creating form data to send to backend
    const data = new FormData();
    data.append("firstName", first_Name);
    data.append("lastName", last_Name);
    data.append("email", email);
    data.append("bio", bio);
    data.append("username", userName);
    data.append("gender", gender);
    data.append("location", location);

    // Append profile picture file if selected
    if (profilePicFile) {
      data.append("profilePicture", profilePicFile);
    }

    // AH-- Send PUT request to the edit profile endpoint in backend
    try {
      const response = await fetch("http://localhost:8000/api/edit_profile/", {
        method: "PUT",
        body: data,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      //AH-- Update state variables to show updates in frontend
      setFirstName(result.firstName);
      setLastName(result.lastName);
      setEmail(result.email);
      setBio(result.bio);
      setUserName(result.name);
      setGender(result.gender);
      setLocation(result.location);
      setProfilePic(result.profilePicture);
      setIsEditing(false);

      showToast("Profile updated successfully", "success");
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to update profile. Please try again.", "error");
    }
  };

  // AH-- Handle canceling edit and revert back to original profile data
  // AH-- cancel button(form reset)

  const handleCancel = (e) => {
    e.preventDefault();
    if (profile) {
      // AH-- reset/get unchanged data from curr profile
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setEmail(profile.email);
      setBio(profile.bio);
      setUserName(profile.name);
      setGender(profile.gender);
      setLocation(profile.location);
      setProfilePic(profile.profilePicture);
    }
    setIsEditing(false);
  };

  // AH-- to Display toast message
  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage("");
      setToastType("");
    }, 3000);
  };

  // AH-- error when editing of username
  const HandleInputKey = () => {
    showToast("Cannot edit username", "error");
  };

  //AH-- handle profile picture change
  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicFile(e.target.files[0]);
    }
  };


 
  const ImageUrl = `http://localhost:8000${profilePic}`;
  console.log(ImageUrl)
  return (
    <>
      {/* AH-- show profile only if authenticated */}
      {id ? (
        <div className="profile">
          {toastMessage && (
            <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />
          )}

          <Header firstName={first_Name || userName} lastName={last_Name} userName={userName} />
          <div className="profile-bottom">
            <div className="profile-card">
              <div className="card-bottom">
              <img src={ImageUrl || dp} id="profilePicture" className="profilePicture" />

                <div className="card-fn">{first_Name || userName}</div>
                <div className="card-ln">{last_Name}</div>
                <hr />
                <div className="card-un">@{userName}</div>
                <div>
                <Link to="/login">
                  <button className="save-button10" onClick={handleLogout}>
                    Logout
                  </button>
                </Link>
              </div>
              </div>
              
            </div>

            <div className="profile-content">
              <ChangePassW trigger={ChangePassWButton} setTrigger={SetChangePassWButton} />
              <DeleteAcc trigger={DeleteAccButton} setTrigger={SetDeleteAccButton} />
              <DeleteConGoogle trigger={DeleteAccSocialButton} setTrigger={SetDeleteAccSocialButton} />

              <div className="edit-profile">
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)}>
                    <img src={editprofile} alt="edit" />
                  </button>
                )}
              </div>

              <form className="profile-details" onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="details-section">
                  <section className="Title-text">{isEditing ? "Edit Profile" : "My Profile"}</section>
                  {isEditing && (
                    <div>
                      <span className="label1"> Profile Picture:</span>
                      <input
                        type="file"
                        accept="image/*"
                        id="profilePicInput"
                        onChange={handleProfilePicChange}
                        name="profilePic"
                      />
                    </div>
                  )}

                  <div className="First-name card">
                    <span className="label1">First Name:</span>
                    {isEditing ? (
                      <input className="input3" value={first_Name} onChange={(e) => setFirstName(e.target.value)} />
                    ) : (
                      <span className="data1">{first_Name}</span>
                    )}
                  </div>
                  <div className="Last-Name card">
                    <span className="label1">Last Name:</span>
                    {isEditing ? (
                      <input className="input3" value={last_Name} onChange={(e) => setLastName(e.target.value)} />
                    ) : (
                      <span className="data1">{last_Name}</span>
                    )}
                  </div>
                  <div className="Email card">
                    <span className="label1">E-mail:</span>
                    {isEditing ? (
                      <input className="input3" value={email} onChange={(e) => setEmail(e.target.value)} />
                    ) : (
                      <span className="data1">{email}</span>
                    )}
                  </div>
                  <div className="Bio card">
                    <span className="label1">Bio:</span>
                    {isEditing ? (
                      <textarea className="input3" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                    ) : (
                      <span className="data1">{bio}</span>
                    )}
                  </div>
                  <div className="Username card">
                    <span className="label1">UserName:</span>
                    {isEditing ? (
                      <textarea className="input3" value={userName} onKeyDown={HandleInputKey}></textarea>
                    ) : (
                      <span className="data1">@{userName}</span>
                    )}
                  </div>
                  <div className="Gender card">
                    <span className="label1">Gender:</span>
                    {isEditing ? (
                      <select className="select3" value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    ) : (
                      <span className="data1">{gender}</span>
                    )}
                  </div>
                  <div className="Location card">
                    <span className="label1">Location:</span>
                    {isEditing ? (
                      <input className="input3" value={location} onChange={(e) => setLocation(e.target.value)} />
                    ) : (
                      <span className="data1">{location}</span>
                    )}
                  </div>
                  {isEditing && (
                    <di className="buttons">
                      <button className="save-button" type="submit">
                        Update
                      </button>
                      <button className="save-button" type="button" onClick={handleCancel}>
                        Cancel
                      </button>
                    </di>
                  )}
                </div>
              </form>
              {!isEditing && (
                <div className="profile-last">
                  {google_id ? (
                    <div className="deleteAcc">
                      <button onClick={() => SetDeleteAccSocialButton(true)}>Delete Account</button>
                    </div>
                  ) : (
                    <>
                      <div className="ChangePW">
                        <button onClick={() => SetChangePassWButton(true)}>Change Password</button>
                      </div>
                      <div className="deleteAcc">
                        <button onClick={() => SetDeleteAccButton(true)}>Delete Account</button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <Footer />
        </div>
      ) : (
        <div>
          <Link className="link2" to="/Home">
            Home
          </Link>
          <div className="proflogin">
            <img src={logo} alt="logo-login" className="logo-login2" />
            <p className="opentext">You are not logged in</p>
            <Link to="/Login">
              <button className="login-btn">Login</button>
            </Link>
            
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Profile;
