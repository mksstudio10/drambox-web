import { useState, useEffect } from 'react';
import { getVipContent } from '../services/api';
import { cacheDramas } from '../services/dramaCache';
import DramaCard from '../components/DramaCard';
import './Vip.css';

export default function Vip() {
    const [dramas, setDramas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVip = async () => {
            setLoading(true);
            const data = await getVipContent();

            // Collect all VIP dramas, limit to 30
            const allDramas = [];
            data.forEach(section => {
                if (section.bookList) {
                    allDramas.push(...section.bookList);
                }
            });

            setDramas(allDramas.slice(0, 30));
            cacheDramas(allDramas);
            setLoading(false);
        };
        fetchVip();
    }, []);

    return (
        <div className="vip-page">
            <header className="vip-header">
                <div className="container">
                    <div className="vip-badge">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span>VIP</span>
                    </div>
                    <h1>Konten VIP Eksklusif</h1>
                    <p>Drama premium pilihan untuk kamu</p>
                </div>
            </header>

            <main className="vip-content container">
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
                    <>
                        <p className="vip-count">Menampilkan <strong>{dramas.length}</strong> konten VIP</p>
                        <div className="drama-grid">
                            {dramas.map((drama) => (
                                <DramaCard
                                    key={drama.bookId}
                                    drama={drama}
                                    size="small"
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
