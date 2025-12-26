import './Loading.css';

export default function Loading({ text = 'Memuat...', size = 'md' }) {
    return (
        <div className={`loading-container loading-${size}`}>
            <div className="loading-spinner">
                <div className="spinner-ring" />
                <div className="spinner-ring" />
                <div className="spinner-ring" />
            </div>
            {text && <p className="loading-text">{text}</p>}
        </div>
    );
}

// Full page loading
export function PageLoading({ text = 'Memuat halaman...' }) {
    return (
        <div className="page-loading">
            <div className="loading-logo">
                <span className="logo-icon">▶</span>
                <span className="logo-text">DramaBox</span>
            </div>
            <div className="loading-spinner">
                <div className="spinner-ring" />
                <div className="spinner-ring" />
                <div className="spinner-ring" />
            </div>
            <p className="loading-text">{text}</p>
        </div>
    );
}

// Skeleton card loader
export function CardSkeleton({ count = 6 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="card-skeleton">
                    <div className="skeleton-image skeleton" />
                    <div className="skeleton-content">
                        <div className="skeleton-title skeleton" />
                        <div className="skeleton-subtitle skeleton" />
                    </div>
                </div>
            ))}
        </>
    );
}

// Video loading overlay
export function VideoLoading() {
    return (
        <div className="video-loading">
            <div className="video-loading-spinner" />
            <p>Memuat video...</p>
        </div>
    );
}
