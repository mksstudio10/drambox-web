import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsSearchOpen(false);
        }
    };

    return (
        <header className="header glass">
            <div className="header-container container">
                <Link to="/" className="logo">
                    <span className="logo-icon">▶</span>
                    <span className="logo-text">Drama<span className="gradient-text">Box</span></span>
                </Link>

                <nav className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/search" className="nav-link">Explore</Link>
                </nav>

                <div className={`search-wrapper ${isSearchOpen ? 'open' : ''}`}>
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Cari drama..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                        </button>
                    </form>
                </div>

                <button
                    className="mobile-search-toggle btn btn-icon"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                </button>
            </div>
        </header>
    );
}
