import React from 'react';
import '../css/Navbar.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="settings-icon">
          <svg width="24" height="24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a7.93 7.93 0 0 0 .6-3 7.93 7.93 0 0 0-.6-3l2.1-1.6-2-3.4-2.5 1a7.89 7.89 0 0 0-2.6-1.5l-.4-2.6h-4l-.4 2.6a7.89 7.89 0 0 0-2.6 1.5l-2.5-1-2 3.4 2.1 1.6a7.93 7.93 0 0 0 0 6l-2.1 1.6 2 3.4 2.5-1a7.89 7.89 0 0 0 2.6 1.5l.4 2.6h4l.4-2.6a7.89 7.89 0 0 0 2.6-1.5l2.5 1 2-3.4-2.1-1.6z" />
          </svg>
        </div>
        <div className="header-title">
          <h1>Admin Dashboard</h1>
          <p>KIET</p>
        </div>
      </div>
      <div className="header-right">
        <div className="user-info">
          
          <span className="user-role">admin</span>
        </div>
        <button className="btn-logout" type="button">Logout</button>
      </div>
    </header>
  )
}

export default Header;
