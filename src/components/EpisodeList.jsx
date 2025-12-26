import './EpisodeList.css';

export default function EpisodeList({
    episodes,
    currentEpisode,
    onEpisodeSelect,
    loading
}) {
    if (loading) {
        return (
            <div className="episode-list">
                <h3 className="episode-list-title">Episodes</h3>
                <div className="episode-grid">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="skeleton episode-skeleton" />
                    ))}
                </div>
            </div>
        );
    }

    if (!episodes || episodes.length === 0) {
        return (
            <div className="episode-list">
                <h3 className="episode-list-title">Episodes</h3>
                <p className="no-episodes">Tidak ada episode tersedia</p>
            </div>
        );
    }

    return (
        <div className="episode-list">
            <h3 className="episode-list-title">
                Episodes <span className="episode-count">({episodes.length})</span>
            </h3>
            <div className="episode-grid">
                {episodes.map((episode) => (
                    <button
                        key={episode.chapterId}
                        className={`episode-btn ${currentEpisode === episode.chapterIndex ? 'active' : ''}`}
                        onClick={() => onEpisodeSelect(episode)}
                    >
                        {episode.chapterName}
                    </button>
                ))}
            </div>
        </div>
    );
}
