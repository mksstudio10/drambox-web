import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchDramas } from '../services/api';
import { cacheDramas } from '../services/dramaCache';
import DramaCard from '../components/DramaCard';
import './Search.css';

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        const q = searchParams.get('q');
        if (q) {
            setQuery(q);
            performSearch(q);
        }
    }, [searchParams]);

    const performSearch = async (searchQuery) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearched(true);
        const data = await searchDramas(searchQuery);
        setResults(data);
        // Cache results for detail pages
        cacheDramas(data);
        setLoading(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            setSearchParams({ q: query.trim() });
        }
    };

    return (
        <div className="search-page">
            <div className="search-hero">
                <div className="container">
                    <h1 className="search-title">Temukan Drama Favoritmu</h1>
                    <form onSubmit={handleSubmit} className="search-form-large">
                        <input
                            type="text"
                            placeholder="Cari judul drama..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="search-input-large"
                        />
                        <button type="submit" className="btn btn-primary search-submit">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            Cari
                        </button>
                    </form>
                </div>
            </div>

            <main className="search-results container">
                {loading ? (
                    <div className="results-grid">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="skeleton-large">
                                <div className="skeleton" style={{ aspectRatio: '3/4' }} />
                                <div className="skeleton" style={{ height: '20px', marginTop: '12px' }} />
                            </div>
                        ))}
                    </div>
                ) : searched && results.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <h2>Tidak ditemukan hasil</h2>
                        <p>Coba kata kunci lain untuk menemukan drama yang kamu cari</p>
                    </div>
                ) : results.length > 0 ? (
                    <>
                        <p className="results-count">
                            Ditemukan <strong>{results.length}</strong> hasil untuk "<strong>{searchParams.get('q')}</strong>"
                        </p>
                        <div className="results-grid">
                            {results.map((drama) => (
                                <DramaCard key={drama.id} drama={drama} size="large" />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="search-suggestions">
                        <h2>Populer Minggu Ini</h2>
                        <div className="suggestion-tags">
                            {['CEO', 'Romansa', 'Balas Dendam', 'Keluarga', 'Modern'].map((tag) => (
                                <button
                                    key={tag}
                                    className="suggestion-tag"
                                    onClick={() => setSearchParams({ q: tag })}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
