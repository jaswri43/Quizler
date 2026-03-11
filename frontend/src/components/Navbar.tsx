import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

// individuual links in navbar
type NavLink = {
    label: string;
    href: string;
}

// whole navbar component
type NavbarProps = {
    title: string;
    links: NavLink[];
}

function Navbar({links, title}: NavbarProps) {
    const [username, setUsername] = useState(localStorage.getItem('username'));

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
                    <span className="user-icon" style={{ cursor: 'default' }}>
                        Hello, {localStorage.getItem('username')}
                    </span>
                ) : (
                    <Link to="/login" className="user-icon">
                        Login
                    </Link>
                )}
            </div>
        </div>
    </nav>
  );
}

export default Navbar;
