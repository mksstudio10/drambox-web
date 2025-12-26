import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEpisodes } from '../services/api';
import { getCachedDrama } from '../services/dramaCache';
import VideoPlayer from '../components/VideoPlayer';
import EpisodeList from '../components/EpisodeList';
import './Watch.css';

export default function Watch() {
    const { id, episode } = useParams();
    const [drama, setDrama] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [currentEpisode, setCurrentEpisode] = useState(parseInt(episode) || 0);
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

    useEffect(() => {
        setCurrentEpisode(parseInt(episode) || 0);
    }, [episode]);

    const currentVideo = episodes[currentEpisode];
    const dramaName = drama?.name || drama?.bookName || 'Drama';
    const dramaCover = drama?.cover || drama?.coverWap;
    const dramaPlayCount = drama?.playCount;

    const handleEpisodeSelect = (ep) => {
        setCurrentEpisode(ep.chapterIndex);
        window.history.pushState({}, '', `/watch/${id}/${ep.chapterIndex}`);
    };

    const handlePrevious = () => {
        if (currentEpisode > 0) {
            const newEp = currentEpisode - 1;
            setCurrentEpisode(newEp);
            window.history.pushState({}, '', `/watch/${id}/${newEp}`);
        }
    };

    const handleNext = () => {
        if (currentEpisode < episodes.length - 1) {
            const newEp = currentEpisode + 1;
            setCurrentEpisode(newEp);
            window.history.pushState({}, '', `/watch/${id}/${newEp}`);
        }
    };

    if (loading) {
        return (
            <div className="watch-page">
                <div className="container">
                    <div className="skeleton" style={{ aspectRatio: '16/9', borderRadius: '16px' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="watch-page">
            <div className="watch-container container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to={`/drama/${id}`}>{dramaName}</Link>
                    <span>/</span>
                    <span className="current">{currentVideo?.chapterName || `Episode ${currentEpisode + 1}`}</span>
                </nav>

                <div className="watch-layout">
                    {/* Video Player */}
                    <div className="watch-main">
                        <VideoPlayer
                            videoUrl={currentVideo?.videoPath}
                            title={dramaName}
                            episodeName={currentVideo?.chapterName}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                            hasPrevious={currentEpisode > 0}
                            hasNext={currentEpisode < episodes.length - 1}
                        />
                    </div>

                    {/* Sidebar */}
                    <aside className="watch-sidebar">
                        {/* Drama Info Card */}
                        <div className="drama-info-card glass">
                            {dramaCover && (
                                <>
                                    <img src={dramaCover} alt={dramaName} className="info-card-image" />
                                    <div className="info-card-content">
                                        <h3>{dramaName}</h3>
                                        {dramaPlayCount && <p>{dramaPlayCount} views</p>}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Episode List */}
                        <EpisodeList
                            episodes={episodes}
                            currentEpisode={currentEpisode}
                            onEpisodeSelect={handleEpisodeSelect}
                        />
                    </aside>
                </div>
            </div>
        </div>
    );
}
