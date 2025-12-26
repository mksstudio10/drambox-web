import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

export default function HeroBanner({ dramas }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const trackRef = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Auto-slide every 4 seconds
    useEffect(() => {
        if (!isAutoPlay || !dramas?.length) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % dramas.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isAutoPlay, dramas?.length]);

    // Handle touch/swipe
    const handleTouchStart = (e) => {
        setIsAutoPlay(false);
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        const threshold = 50;

        if (diff > threshold) {
            // Swipe left - next
            setCurrentIndex((prev) => (prev + 1) % dramas.length);
        } else if (diff < -threshold) {
            // Swipe right - previous
            setCurrentIndex((prev) => (prev - 1 + dramas.length) % dramas.length);
        }

        // Resume autoplay after 5 seconds
        setTimeout(() => setIsAutoPlay(true), 5000);
    };

    // Handle mouse drag for desktop
    const handleMouseDown = (e) => {
        setIsAutoPlay(false);
        touchStartX.current = e.clientX;
    };

    const handleMouseUp = (e) => {
        const diff = touchStartX.current - e.clientX;
        const threshold = 50;

        if (diff > threshold) {
            setCurrentIndex((prev) => (prev + 1) % dramas.length);
        } else if (diff < -threshold) {
            setCurrentIndex((prev) => (prev - 1 + dramas.length) % dramas.length);
        }

        setTimeout(() => setIsAutoPlay(true), 5000);
    };

    if (!dramas?.length) return null;

    const currentDrama = dramas[currentIndex];

    return (
        <div className="hero-banner">
            {/* Background */}
            <div className="banner-bg">
                <img
                    src={currentDrama.coverWap}
                    alt=""
                    className="banner-bg-image"
                    key={currentIndex}
                />
                <div className="banner-overlay" />
            </div>

            {/* Slider Track */}
            <div
                className="banner-track"
                ref={trackRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            >
                <div className="banner-content">
                    <div className="banner-poster">
                        <img src={currentDrama.coverWap} alt={currentDrama.bookName} />
                    </div>
                    <div className="banner-info">
                        <span className="banner-badge">🔥 Trending #{currentIndex + 1}</span>
                        <h2 className="banner-title">{currentDrama.bookName}</h2>
                        <p className="banner-desc">
                            {currentDrama.introduction?.slice(0, 80) || 'Drama populer minggu ini'}...
                        </p>
                        <div className="banner-tags">
                            {currentDrama.tags?.slice(0, 3).map((tag, i) => (
                                <span key={i} className="tag">{tag}</span>
                            ))}
                        </div>
                        <Link to={`/drama/${currentDrama.bookId}`} className="btn btn-primary">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Tonton
                        </Link>
                    </div>
                </div>
            </div>

            {/* Dots Indicator */}
            <div className="banner-dots">
                {dramas.slice(0, 5).map((_, i) => (
                    <button
                        key={i}
                        className={`dot ${i === currentIndex ? 'active' : ''}`}
                        onClick={() => {
                            setCurrentIndex(i);
                            setIsAutoPlay(false);
                            setTimeout(() => setIsAutoPlay(true), 5000);
                        }}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="banner-progress">
                <div
                    className="progress-bar"
                    style={{
                        width: `${((currentIndex + 1) / Math.min(dramas.length, 5)) * 100}%`
                    }}
                />
            </div>
        </div>
    );
}
