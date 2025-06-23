import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo farro-font">
          <Link to="/">TEXTURA</Link>
        </div>
        <nav className="main-nav">
          <ul className="nav-list">
            <li className="nav-item montserrat-font"><a href="#">Men</a></li>
            <li className="nav-item montserrat-font"><a href="#">Ladies</a></li>
            <li className="nav-item montserrat-font"><a href="#">Accessories</a></li>
            <li className="nav-item montserrat-font"><a href="#">Services</a></li>
          </ul>
        </nav>
        <div className="header-icons">
          <div className="search-container">
            <input type="text" className="search-input" placeholder="Search..." />
            <a href="#" className="icon-link search-icon" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;