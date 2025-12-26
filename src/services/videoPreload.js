// Video preloading service for faster Short page loading
const preloadedVideos = new Map();
const preloadQueue = [];
let isPreloading = false;

// Preload video URL by creating a video element and loading metadata
export const preloadVideo = async (url) => {
    if (!url || preloadedVideos.has(url)) return;

    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata'; // Only load metadata for speed
        video.muted = true;

        video.onloadedmetadata = () => {
            preloadedVideos.set(url, true);
            resolve(true);
        };

        video.onerror = () => {
            resolve(false);
        };

        video.src = url;
    });
};

// Preload multiple videos in background
export const preloadVideos = async (urls) => {
    if (isPreloading) return;
    isPreloading = true;

    for (const url of urls) {
        if (!preloadedVideos.has(url)) {
            await preloadVideo(url);
        }
    }

    isPreloading = false;
};

// Check if video is preloaded
export const isVideoPreloaded = (url) => {
    return preloadedVideos.has(url);
};

// Get preload status
export const getPreloadStatus = () => ({
    count: preloadedVideos.size,
    isLoading: isPreloading
});

// Clear preloaded cache
export const clearPreloadCache = () => {
    preloadedVideos.clear();
};

export default {
    preloadVideo,
    preloadVideos,
    isVideoPreloaded,
    getPreloadStatus,
    clearPreloadCache
};
