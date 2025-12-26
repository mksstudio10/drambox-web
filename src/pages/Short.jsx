import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getVipContent, getEpisodes } from '../services/api';
import { cacheDramas } from '../services/dramaCache';
import './Short.css';

const RESOLUTIONS = [
    { label: '144p', value: '144', desc: 'Data Saver' },
    { label: '240p', value: '240', desc: 'Low' },
    { label: '360p', value: '360', desc: 'Medium' },
    { label: '480p', value: '480', desc: 'SD' },
    { label: '720p', value: '720', desc: 'HD' },
];

const DEFAULT_RESOLUTION = '144';

export default function Short() {
    const [dramas, setDramas] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [videoUrl, setVideoUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDetail, setShowDetail] = useState(false);
    const [episodes, setEpisodes] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [resolution, setResolution] = useState(DEFAULT_RESOLUTION);
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const touchStartY = useRef(0);
    const touchStartX = useRef(0);

    useEffect(() => {
        const savedRes = localStorage.getItem('shortResolution');
        if (savedRes) setResolution(savedRes);

        const fetchDramas = async () => {
            setLoading(true);
            const data = await getVipContent();

            const allDramas = [];
            data.forEach(section => {
                if (section.bookList) {
                    allDramas.push(...section.bookList);
                }
            });

            const shuffled = allDramas.sort(() => Math.random() - 0.5);
            setDramas(shuffled);
            cacheDramas(shuffled);
            setLoading(false);
        };
        fetchDramas();
    }, []);

    useEffect(() => {
        const loadVideo = async () => {
            if (!dramas[currentIndex]) return;

            const drama = dramas[currentIndex];
            const data = await getEpisodes(drama.bookId);

            if (data.episodes?.length > 0) {
                setVideoUrl(data.episodes[0].videoPath);
                setEpisodes(data.episodes);
            }
        };
        loadVideo();
    }, [currentIndex, dramas]);

    const handleTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY;
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        const diffY = touchStartY.current - touchEndY;
        const diffX = touchStartX.current - touchEndX;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                setShowDetail(true);
            } else {
                setShowDetail(false);
            }
            return;
        }

        if (Math.abs(diffY) > 50) {
            if (diffY > 0 && currentIndex < dramas.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setShowDetail(false);
            } else if (diffY < 0 && currentIndex > 0) {
                setCurrentIndex(prev => prev - 1);
                setShowDetail(false);
            }
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
        }
    };

    const handleResolutionChange = (res) => {
        setResolution(res);
        localStorage.setItem('shortResolution', res);
        setShowMenu(false);
    };

    if (loading) {
        return (
            <div className="short-page">
                <div className="short-loading">
                    <div className="loader" />
                    <p>Memuat video...</p>
                </div>
            </div>
        );
    }

    const currentDrama = dramas[currentIndex];

    return (
        <div
            className={`short-page ${showDetail ? 'show-detail' : ''}`}
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Video Section */}
            <div className="short-video-container">
                {videoUrl ? (
                    <video
                        ref={videoRef}
                        key={videoUrl}
                        src={videoUrl}
                        className="short-video"
                        autoPlay
                        loop
                        playsInline
                        muted={isMuted}
                    />
                ) : (
                    <div className="short-placeholder">
                        <img src={currentDrama?.coverWap} alt="" className="placeholder-bg" />
                    </div>
                )}

                {/* Top Controls */}
                <div className="short-top-controls">
                    {/* Mute/Unmute Button */}
                    <button className="control-btn" onClick={toggleMute}>
                        {isMuted ? (
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            </svg>
                        )}
                    </button>

                    {/* Menu Button (3 dots) */}
                    <button className="control-btn menu-btn" onClick={() => setShowMenu(!showMenu)}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="19" r="2" />
                        </svg>
                    </button>

                    {/* Resolution Menu */}
                    {showMenu && (
                        <div className="short-menu">
                            <div className="menu-header">Kualitas Video</div>
                            {RESOLUTIONS.map((res) => (
                                <button
                                    key={res.value}
                                    className={`menu-option ${resolution === res.value ? 'active' : ''}`}
                                    onClick={() => handleResolutionChange(res.value)}
                                >
                                    <span className="res-info">
                                        <span className="res-label">{res.label}</span>
                                        <span className="res-desc">{res.desc}</span>
                                    </span>
                                    {resolution === res.value && (
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Resolution Badge */}
                <div className="short-resolution-badge">{resolution}p</div>

                {/* Overlay Info */}
                <div className="short-overlay">
                    <div className="short-info">
                        <h2 className="short-title">{currentDrama?.bookName}</h2>
                        <p className="short-desc">
                            {currentDrama?.introduction?.slice(0, 60)}...
                        </p>
                        <div className="short-tags">
                            {currentDrama?.tags?.slice(0, 2).map((tag, i) => (
                                <span key={i} className="tag">{tag}</span>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="short-actions">
                        <button className="action-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span>{currentDrama?.playCount || '0'}</span>
                        </button>
                        <Link to={`/drama/${currentDrama?.bookId}`} className="action-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span>Detail</span>
                        </Link>
                    </div>
                </div>

                {/* Progress indicator */}
                <div className="short-progress">
                    <span>{currentIndex + 1}</span>
                    <div className="progress-dots">
                        {dramas.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((_, i) => (
                            <span key={i} className={`dot ${i === Math.min(2, currentIndex) ? 'active' : ''}`} />
                        ))}
                    </div>
                    <span>{dramas.length}</span>
                </div>

                {/* Swipe hint */}
                <div className="swipe-hint">
                    <span>← Geser untuk detail</span>
                </div>
            </div>

            {/* Detail Panel */}
            <div className="short-detail-panel">
                <div className="detail-header">
                    <button className="back-btn" onClick={() => setShowDetail(false)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <h3>Detail & Episode</h3>
                </div>

                <div className="detail-content">
                    <div className="detail-drama-info">
                        <img src={currentDrama?.coverWap} alt="" className="detail-poster" />
                        <div className="detail-text">
                            <h4>{currentDrama?.bookName}</h4>
                            <p>{currentDrama?.introduction?.slice(0, 100)}...</p>
                            <Link to={`/drama/${currentDrama?.bookId}`} className="btn btn-primary btn-sm">
                                Lihat Semua
                            </Link>
                        </div>
                    </div>

                    <div className="detail-episodes">
                        <h5>Episode ({episodes.length})</h5>
                        <div className="episode-grid-small">
                            {episodes.slice(0, 20).map((ep, i) => (
                                <Link
                                    key={i}
                                    to={`/watch/${currentDrama?.bookId}/${i}`}
                                    className="ep-btn"
                                >
                                    EP {i + 1}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
