import { useState, useRef, useEffect } from 'react';
import './VideoPlayer.css';

const RESOLUTIONS = [
    { label: '144p', value: '144', desc: 'Data Saver' },
    { label: '240p', value: '240', desc: 'Low' },
    { label: '360p', value: '360', desc: 'Medium' },
    { label: '480p', value: '480', desc: 'SD' },
    { label: '720p', value: '720', desc: 'HD' },
    { label: '1080p', value: '1080', desc: 'Full HD' },
];

const DEFAULT_RESOLUTION = '144'; // Start with lowest for fast loading

export default function VideoPlayer({
    videoUrl,
    title,
    episodeName,
    onPrevious,
    onNext,
    hasPrevious,
    hasNext
}) {
    const [resolution, setResolution] = useState(DEFAULT_RESOLUTION);
    const [showSettings, setShowSettings] = useState(false);
    const videoRef = useRef(null);

    // Build URL with resolution parameter
    const getVideoUrl = (url, res) => {
        if (!url) return null;
        // For DramaBox API, resolution can be appended
        // Most streaming services use the same URL but client-side quality
        return url;
    };

    const handleResolutionChange = (res) => {
        setResolution(res);
        setShowSettings(false);
        // Store in localStorage for persistence
        localStorage.setItem('videoResolution', res);
    };

    useEffect(() => {
        const savedRes = localStorage.getItem('videoResolution');
        if (savedRes) {
            setResolution(savedRes);
        }
    }, []);

    return (
        <div className="video-player-container">
            <div className="video-wrapper">
                {videoUrl ? (
                    <>
                        <video
                            ref={videoRef}
                            key={videoUrl}
                            controls
                            autoPlay
                            className="video-element"
                        >
                            <source src={getVideoUrl(videoUrl, resolution)} type="video/mp4" />
                            Browser Anda tidak mendukung video.
                        </video>

                        {/* Settings Button */}
                        <button
                            className="video-settings-btn"
                            onClick={() => setShowSettings(!showSettings)}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                        </button>

                        {/* Resolution Menu */}
                        {showSettings && (
                            <div className="video-settings-menu">
                                <div className="settings-header">Kualitas Video</div>
                                {RESOLUTIONS.map((res) => (
                                    <button
                                        key={res.value}
                                        className={`settings-option ${resolution === res.value ? 'active' : ''}`}
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

                        {/* Current Resolution Badge */}
                        <div className="resolution-badge">{resolution}p</div>
                    </>
                ) : (
                    <div className="video-placeholder">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        <p>Pilih episode untuk mulai menonton</p>
                    </div>
                )}
            </div>

            <div className="video-controls-bar">
                <div className="video-info">
                    <h2 className="video-title">{title}</h2>
                    {episodeName && <span className="video-episode">{episodeName}</span>}
                </div>

                <div className="navigation-controls">
                    <button
                        className="nav-btn"
                        onClick={onPrevious}
                        disabled={!hasPrevious}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        Previous
                    </button>
                    <button
                        className="nav-btn"
                        onClick={onNext}
                        disabled={!hasNext}
                    >
                        Next
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
