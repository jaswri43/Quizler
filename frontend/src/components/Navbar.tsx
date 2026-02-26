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
                <a href="/" className="navbar-logo">
                    {title}
                </a>
            </div>

            <div className="navbar-center">
                <ul className="navbar-links">
                    {links.map((link) => (
                    <li key={link.href}>
                        <a href={link.href}>
                            {link.label}
                        </a>
                    </li>
                    ))}
                </ul>
            </div>

            <div className="navbar-right">
                <a href="/login" className="user-icon">
                    Login
                </a>
            </div>
        </div>
    </nav>
  );
}

export default Navbar;