import { NavLink, useLocation } from 'react-router-dom';
import './BottomNav.css';

export default function BottomNav() {
    const location = useLocation();

    // Hide on watch page
    if (location.pathname.startsWith('/watch')) {
        return null;
    }

    return (
        <nav className="bottom-nav">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>Home</span>
            </NavLink>

            <NavLink to="/short" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="6" y="3" width="12" height="18" rx="2" />
                    <path d="M9 12l3-2 3 2" />
                    <path d="M12 10v5" />
                </svg>
                <span>Short</span>
            </NavLink>

            <NavLink to="/vip" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>VIP</span>
            </NavLink>

            <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Profile</span>
            </NavLink>
        </nav>
    );
}
