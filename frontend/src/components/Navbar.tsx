import { Link, NavLink as RouterNavLink } from 'react-router-dom';

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
                <Link to="/login" className="user-icon">
                    Login
                </Link>
            </div>
        </div>
    </nav>
  );
}

export default Navbar;