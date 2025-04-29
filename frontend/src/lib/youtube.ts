const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

export interface YouTubeSearchResult {
    id: string;
    title: string;
    thumbnail: string;
    channelTitle: string;
}

export async function searchYouTubeVideos(query: string): Promise<YouTubeSearchResult[]> {
    if (!YOUTUBE_API_KEY) {
        console.error('YouTube API key is not configured');
        throw new Error('YouTube API key is not configured');
    }

    const params = new URLSearchParams({
        part: 'snippet',
        maxResults: '5',
        q: query,
        type: 'video',
        key: YOUTUBE_API_KEY,
    });

    try {
        const response = await fetch(`${YOUTUBE_API_URL}?${params}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const data = await response.json().catch(() => null);
            throw new Error(data?.error?.message || `YouTube API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.items) {
            throw new Error('No results found');
        }

        return data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
            channelTitle: item.snippet.channelTitle,
        }));
    } catch (error) {
        console.error('Error searching YouTube:', error);
        throw error; // Re-throw to handle in the component
    }
}