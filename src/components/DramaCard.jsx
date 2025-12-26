import { Link } from 'react-router-dom';
import './DramaCard.css';

export default function DramaCard({ drama, size = 'medium' }) {
    const id = drama.id || drama.bookId;
    const name = drama.name || drama.bookName;
    const cover = drama.cover || drama.coverWap;
    const playCount = drama.playCount;
    const tags = drama.tags || [];

    return (
        <Link to={`/drama/${id}`} className={`drama-card ${size}`}>
            <div className="drama-card-image">
                <img
                    src={cover}
                    alt={name}
                    loading="lazy"
                />
                <div className="drama-card-overlay">
                    <button className="play-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                </div>
                {playCount && (
                    <div className="play-count">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        {playCount}
                    </div>
                )}
            </div>
            <div className="drama-card-content">
                <h3 className="drama-card-title">{name}</h3>
                {tags.length > 0 && (
                    <div className="drama-card-tags">
                        {tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}
