import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEpisodes } from '../services/api';
import { getCachedDrama } from '../services/dramaCache';
import EpisodeList from '../components/EpisodeList';
import './DramaDetail.css';

export default function DramaDetail() {
    const { id } = useParams();
    const [drama, setDrama] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // Get drama info from cache
            const cachedDrama = getCachedDrama(id);
            if (cachedDrama) {
                setDrama(cachedDrama);
            }

            // Fetch episodes
            const episodeData = await getEpisodes(id);
            setEpisodes(episodeData.episodes);

            setLoading(false);
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="drama-detail-page">
                <div className="detail-loading container">
                    <div className="skeleton" style={{ width: '250px', height: '375px' }} />
                    <div className="detail-loading-info">
                        <div className="skeleton" style={{ width: '300px', height: '40px' }} />
                        <div className="skeleton" style={{ width: '100%', height: '100px', marginTop: '20px' }} />
                    </div>
                </div>
            </div>
        );
    }

    const dramaName = drama?.name || drama?.bookName || 'Drama';
    const dramaCover = drama?.cover || drama?.coverWap;
    const dramaIntro = drama?.introduction || '';
    const dramaTags = drama?.tags || [];
    const dramaPlayCount = drama?.playCount;

    return (
        <div className="drama-detail-page">
            {/* Hero Background */}
            <div className="detail-hero">
                {dramaCover && <img src={dramaCover} alt="" className="detail-hero-bg" />}
                <div className="detail-hero-overlay" />
            </div>

            <div className="detail-content container">
                {/* Drama Info */}
                <div className="detail-main">
                    <div className="detail-poster">
                        {dramaCover && <img src={dramaCover} alt={dramaName} />}
                    </div>

                    <div className="detail-info">
                        <h1 className="detail-title">{dramaName}</h1>

                        <div className="detail-stats">
                            {dramaPlayCount && (
                                <span className="stat">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    {dramaPlayCount} views
                                </span>
                            )}
                            <span className="stat">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                                    <polyline points="17 2 12 7 7 2" />
                                </svg>
                                {episodes.length} Episodes
                            </span>
                        </div>

                        {dramaTags.length > 0 && (
                            <div className="detail-tags">
                                {dramaTags.map((tag, i) => (
                                    <span key={i} className="tag">{tag}</span>
                                ))}
                            </div>
                        )}

                        {dramaIntro && (
                            <p className="detail-description">{dramaIntro}</p>
                        )}

                        {episodes.length > 0 && (
                            <Link
                                to={`/watch/${id}/0`}
                                className="btn btn-primary btn-lg watch-btn"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Mulai Menonton
                            </Link>
                        )}
                    </div>
                </div>

                {/* Episodes */}
                <div className="detail-episodes">
                    <EpisodeList
                        episodes={episodes}
                        onEpisodeSelect={(ep) => window.location.href = `/watch/${id}/${ep.chapterIndex}`}
                    />
                </div>
            </div>
        </div>
    );
}
