// Navbar Component - Top navigation with logo, links, and auth buttons
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Navigation link type
type NavLink = {
    label: string;
    href: string;
}

// Navbar props type
type NavbarProps = {
    title: string;
    links: NavLink[];
}

// Navbar with responsive layout and auth state
function Navbar({links, title}: NavbarProps) {
    // Track logged in username
    const [username, setUsername] = useState(localStorage.getItem('username'));

    // Listen for auth changes (login/logout)
    useEffect(() => {
        const handleAuthChange = () => {
            setUsername(localStorage.getItem('username'));
        };

        window.addEventListener('authChange', handleAuthChange);
        return () => window.removeEventListener('authChange', handleAuthChange);
    }, []);

  return (
    <nav className="navbar">
        <div className="navbar-inner">
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">
                    {title}
                </Link>
            </div>

            <div className="navbar-center">
                <ul className="navbar-links">
                    {links.map((link) => (
                    <li key={link.href}>
                        <RouterNavLink to={link.href}>
                            {link.label}
                        </RouterNavLink>
                    </li>
                    ))}
                </ul>
            </div>

            <div className="navbar-right">
                {username ? (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span className="user-icon" style={{ cursor: 'default' }}>
                Hello, {username}
            </span>
                        <button
                            onClick={() => {
                                localStorage.clear(); // Clears everything
                                window.location.href = '/login'; // Reboots the app to the login page
                            }}
                            className="auth-button"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="auth-button">
                        Login
                    </Link>
                )}
            </div>
        </div>
    </nav>
  );
}

export default Navbar;
