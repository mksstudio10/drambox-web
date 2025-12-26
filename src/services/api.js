const API_BASE = '';  // Use local proxy to bypass CORS

export async function searchDramas(keyword) {
  try {
    const response = await fetch(`${API_BASE}/api/search?keyword=${encodeURIComponent(keyword)}`);
    const data = await response.json();
    if (data.success) {
      return data.data.book || [];
    }
    return [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

export async function getVipContent() {
  try {
    const response = await fetch(`${API_BASE}/api/vip`);
    const data = await response.json();
    if (data.success && data.data?.data?.columnVoList) {
      return data.data.data.columnVoList;
    }
    return [];
  } catch (error) {
    console.error('VIP content error:', error);
    return [];
  }
}

export async function getEpisodes(bookId) {
  try {
    const response = await fetch(`${API_BASE}/download/${bookId}`);
    const data = await response.json();
    if (data.status === 'success') {
      return {
        total: data.total,
        episodes: data.data || []
      };
    }
    return { total: 0, episodes: [] };
  } catch (error) {
    console.error('Episodes error:', error);
    return { total: 0, episodes: [] };
  }
}
