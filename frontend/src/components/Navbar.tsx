import React from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Box } from '@mui/material';

function Navbar() {
  const getNavStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
    color: isActive ? '#38bdf8' : '#94a3b8',
    backgroundColor: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
    fontWeight: isActive ? 700 : 500,
    textDecoration: 'none',
    padding: '10px 22px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent'
  });

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1e293b', borderBottom: '1px solid #334155', marginBottom: '30px', boxShadow: 'none' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        <Box sx={{ display: 'flex', gap: '15px' }}>
          <NavLink to="/games" style={getNavStyle}>
            Games
          </NavLink>
          <NavLink to="/publishers" style={getNavStyle}>
            Publishers
          </NavLink>
          <NavLink to="/developers" style={getNavStyle}>
            Developers
          </NavLink>
          <NavLink to="/platforms" style={getNavStyle}>
            Platforms
          </NavLink>
          <NavLink to="/settings" style={getNavStyle}>
            Settings
          </NavLink>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;