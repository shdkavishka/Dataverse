import React, { useState, useRef, useEffect } from 'react';
import './Searchbar.css';
import UserCardList from './UserCardList';

const Searchbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Ucard, setUserCard] = useState(false);
  const userCardListRef = useRef(null);
    //AH-- for toast, types success, error, alert
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("");
  // AH-- to Display toast message
  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage("");
      setToastType("");
    }, 3000);
  };  

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const searchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/search_user', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ query: searchValue }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setUserCard(true)

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      showToast("Failed to fetch users. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchUsers();
  };

  const handleClickOutside = (event) => {
    if (userCardListRef.current && !userCardListRef.current.contains(event.target)) {
      setUsers([]);
      setUserCard(false)
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="searchcontainer">
        {toastMessage && (
            <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />
          )}
      <input
        type="text"
        className="searchInput"
        placeholder="Search..."
        value={searchValue}
        onChange={handleInputChange}
      />
      <button className="searchButton" onClick={handleSearch} disabled={loading || searchValue==""}>
        <img
          src="https://img.icons8.com/ios-filled/50/000000/search.png"
          alt="search"
          className="searchIcon"
        />
      </button>
      <div ref={userCardListRef}>
        {Ucard?<UserCardList users={users} />:null}
        
      </div>
    </div>
  );
};

export default Searchbar;
