import { useState, useEffect } from 'react';
import { getVipContent } from '../services/api';
import { cacheDramas } from '../services/dramaCache';
import HeroBanner from '../components/HeroBanner';
import DramaCard from '../components/DramaCard';
import './Home.css';

export default function Home() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trendingDramas, setTrendingDramas] = useState([]);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            const data = await getVipContent();
            setSections(data);

            // Cache all dramas for detail pages
            data.forEach(section => {
                if (section.bookList) {
                    cacheDramas(section.bookList);
                }
            });

            // Get trending dramas from first section for banner
            if (data.length > 0 && data[0].bookList?.length > 0) {
                setTrendingDramas(data[0].bookList.slice(0, 5));
            }
            setLoading(false);
        };
        fetchContent();
    }, []);

    return (
        <div className="home-page">
            <main className="home-main container">
                {/* Auto-sliding Banner */}
                {!loading && trendingDramas.length > 0 && (
                    <HeroBanner dramas={trendingDramas} />
                )}

                {/* Loading skeleton for banner */}
                {loading && (
                    <div className="skeleton banner-skeleton" style={{ height: '200px', marginBottom: '16px' }} />
                )}

                {/* Drama Sections - YouTube Grid Style */}
                {loading ? (
                    <div className="drama-grid">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="skeleton-card">
                                <div className="skeleton" style={{ aspectRatio: '3/4' }} />
                                <div className="skeleton" style={{ height: '14px', marginTop: '8px' }} />
                            </div>
                        ))}
                    </div>
                ) : (
                    sections.map((section, idx) => (
                        <div key={section.columnId}>
                            <div className="section-header">
                                <h2 className="section-title">{section.title}</h2>
                            </div>
                            <div className="drama-grid">
                                {section.bookList?.slice(idx === 0 ? 5 : 0).map((drama) => (
                                    <DramaCard
                                        key={drama.bookId}
                                        drama={drama}
                                        size="small"
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
}
