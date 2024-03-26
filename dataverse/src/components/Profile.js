import React from "react";
import dp from "../assets/dp.jpg";
import editprofile from "../assets/edit.png";
import logo from "../assets/logo.png";
import "./profile.css";
import ChangePassW from "./pop-ups/changePW";
import DeleteAcc from "./pop-ups/deleteAcc";
import "./edit.css";
import { useState } from "react";

const Profile = () => {
  const [ChangePassWButton, SetChangePassWButton] = useState(false);
  const [DeleteAccButton, SetDeleteAccButton] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("Aleesha");
  const [lastName, setLastName] = useState("Clerreno");
  const [email, setEmail] = useState("allshaCler@gmail.com");
  const [bio, setBio] = useState("Passionate Data Enthusiast");
  const [userName, setUserName] = useState("aleesha@192");
  const [gender, setGender] = useState("Female");
  const [location, setLocation] = useState("Kandy, Sri Lanka");

  return (
    <div className="profile">
      <div className="profile-top">
        <div className="dp">
          <img src={dp} alt="dp"></img>
        </div>
        <div className="Display-name">
          <div>{firstName}</div>
          <div>{lastName}</div>
        </div>
        <div className="logo">
          <img src={logo} alt="logo"></img>
        </div>
      </div>
      <div className="profile-bottom">
        <ChangePassW
          trigger={ChangePassWButton}
          setTrigger={SetChangePassWButton}
        ></ChangePassW>
        <DeleteAcc
          trigger={DeleteAccButton}
          setTrigger={SetDeleteAccButton}
        ></DeleteAcc>
        {isEditing ? null : (
          <div className="edit-profile">
            <button onClick={() => setIsEditing(true)}>
              <img src={editprofile} alt="edit"></img>
            </button>
          </div>
        )}

        <form
          className="profile-details"
          onSubmit={(e) => {
            e.preventDefault();
            setIsEditing(!isEditing);
          }}
        >
          <div>
            <div className="First-name card">
              <span className="label1">First Name:</span>

              {isEditing ? (
                <input
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
              ) : (
                <span className="data1">{firstName}</span>
              )}
            </div>

            <div className="Last-Name card">
              <span className="label1">Last Name:</span>
              {isEditing ? (
                <input
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />
              ) : (
                <span className="data1">{lastName}</span>
              )}
            </div>
            <div className="Email card">
              <span className="label1">E-mail:</span>
              {isEditing ? (
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              ) : (
                <span className="data1">{email}</span>
              )}
            </div>
            <div className="Bio card">
              <span className="label1">Bio:</span>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                  }}
                ></textarea>
              ) : (
                <span className="data1">{bio}</span>
              )}
            </div>
          </div>

          <div>
            <div className="Username card">
              <span className="label1">Username:</span>
              {isEditing ? (
                <input
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
              ) : (
                <span className="data1">{userName}</span>
              )}
            </div>
            <div className="Gender card">
              <span className="label1">Gender:</span>
              {isEditing ? (
                <select
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <span className="data1">{gender}</span>
              )}
            </div>

            <div className="Location card">
              <span className="label1">Location:</span>
              {isEditing ? (
                <input
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                  }}
                />
              ) : (
                <span className="data1">{location}</span>
              )}
            </div>
            {isEditing ? (
              <div
                className="buttons"
                style={{
                  backgroundColor: "rgb(255, 255, 255)",
                  borderRadius: "5px",
                  width: "97%",
                  margin: "0",
                  padding: "0",
                }}
              >
                <span>
                  <button className="save-button" type="submit">
                    Update
                  </button>
                </span>
                <span>
                  <button
                    className="save-button"
                    type="reset"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </span>{" "}
              </div>
            ) : null}
          </div>
        </form>

        <div className="profile-last">
          <div className="ChangePW">
            <button onClick={() => SetChangePassWButton(true)}>
              Change Password
            </button>
          </div>
          <div className="deleteAcc">
            <button onClick={() => SetDeleteAccButton(true)}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
