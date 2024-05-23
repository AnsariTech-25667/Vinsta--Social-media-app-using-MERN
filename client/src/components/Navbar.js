import React, { useContext, useState } from 'react';
import { UserContext } from '../App.js';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { state, dispatch } = useContext(UserContext);
  const history = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderList = () => {
    if (state) {
      return (
        <ul className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/create">Create Post</Link>
          </li>
          <li>
            <Link to="/myfollowingposts">My Following Posts</Link>
          </li>
          <li>
            <button
              className="btn waves-effect waves-light #2196f3 red logout-btn"
              type="Submit"
              onClick={() => {
                localStorage.clear();
                history('/signin');
                dispatch({ type: 'CLEAR' });
              }}
            >
              LOGOUT
            </button>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
          <li>
            <Link to="/signin">Login</Link>
          </li>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
        </ul>
      );
    }
  };

  return (
    <nav className="navbar">
      <Link to={state ? '/' : '/signin'} className="brand-logo">
        Vinsta
      </Link>
      <i className={`menu-icon material-icons ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        menu
      </i>
      {renderList()}
    </nav>
  );
}
