import { useRef } from 'react';
import DramaCard from './DramaCard';
import './DramaCarousel.css';

export default function DramaCarousel({ title, dramas, loading }) {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <section className="drama-carousel">
                <div className="carousel-header">
                    <div className="skeleton" style={{ width: '200px', height: '28px' }} />
                </div>
                <div className="carousel-track">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="skeleton-card">
                            <div className="skeleton" style={{ aspectRatio: '3/4' }} />
                            <div className="skeleton" style={{ height: '20px', marginTop: '12px' }} />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (!dramas || dramas.length === 0) return null;

    return (
        <section className="drama-carousel">
            <div className="carousel-header">
                <h2 className="carousel-title">{title}</h2>
                <div className="carousel-controls">
                    <button className="carousel-btn" onClick={() => scroll('left')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <button className="carousel-btn" onClick={() => scroll('right')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="carousel-track" ref={scrollRef}>
                {dramas.map((drama) => (
                    <DramaCard
                        key={drama.id || drama.bookId}
                        drama={drama}
                        size="medium"
                    />
                ))}
            </div>
        </section>
    );
}
