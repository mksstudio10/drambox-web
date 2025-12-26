// Simple drama cache to share data between pages
const dramaCache = new Map();

export function cacheDrama(drama) {
    const id = drama.id || drama.bookId;
    if (id) {
        dramaCache.set(String(id), drama);
    }
}

export function getCachedDrama(id) {
    return dramaCache.get(String(id)) || null;
}

export function cacheDramas(dramas) {
    dramas.forEach(cacheDrama);
}
