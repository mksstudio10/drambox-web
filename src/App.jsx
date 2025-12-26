import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Search from './pages/Search';
import Short from './pages/Short';
import Vip from './pages/Vip';
import Profile from './pages/Profile';
import DramaDetail from './pages/DramaDetail';
import Watch from './pages/Watch';
import { getVipContent, getEpisodes } from './services/api';
import { preloadVideos } from './services/videoPreload';

// Preload first 5 Short videos in background when app starts
const preloadShortVideos = async () => {
  try {
    const data = await getVipContent();
    const allDramas = [];

    data.forEach(section => {
      if (section.bookList) {
        allDramas.push(...section.bookList);
      }
    });

    // Get first 5 random dramas
    const shuffled = allDramas.sort(() => Math.random() - 0.5).slice(0, 5);

    // Preload video URLs
    const videoUrls = [];
    for (const drama of shuffled) {
      const episodeData = await getEpisodes(drama.bookId);
      if (episodeData.episodes?.length > 0) {
        videoUrls.push(episodeData.episodes[0].videoPath);
      }
    }

    // Preload all videos in background
    preloadVideos(videoUrls);
    console.log('🎬 Preloaded', videoUrls.length, 'Short videos');
  } catch (error) {
    console.log('Preload skipped:', error.message);
  }
};

function App() {
  useEffect(() => {
    // Start preloading Short videos when app mounts
    preloadShortVideos();
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/short" element={<Short />} />
        <Route path="/vip" element={<Vip />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/drama/:id" element={<DramaDetail />} />
        <Route path="/watch/:id/:episode" element={<Watch />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}

export default App;
