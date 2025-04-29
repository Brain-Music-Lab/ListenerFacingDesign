'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import { searchYouTubeVideos, YouTubeSearchResult } from '../lib/youtube';
import { useVideo } from '../contexts/VideoContext';

export default function YouTubeSearch() {
    const router = useRouter();
    const { setSelectedVideo } = useVideo();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<YouTubeSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            const results = await searchYouTubeVideos(searchQuery);
            setSearchResults(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while searching');
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const selectVideo = (result: YouTubeSearchResult) => {
        setSelectedVideo(result);
        router.push('/memory-listening/song-play');
    };

    return (
        <div className="youtube-search-container">
            <Form onSubmit={handleSearch} className="mb-4">
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Search for a song (e.g., 'Love Shack B52s')"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button type="submit" variant="primary" disabled={isLoading}>
                        {isLoading ? 'Searching...' : 'Search'}
                    </Button>
                </InputGroup>
            </Form>
            
            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}
            
            {searchResults.length > 0 && (
                <div className="search-results mb-4">
                    {searchResults.map((result) => (
                        <Card key={result.id} className="mb-2" style={{ cursor: 'pointer' }} onClick={() => selectVideo(result)}>
                            <Card.Body className="d-flex align-items-center">
                                <img 
                                    src={result.thumbnail} 
                                    alt={result.title}
                                    style={{ width: '120px', marginRight: '1rem' }}
                                />
                                <div>
                                    <Card.Title>{result.title}</Card.Title>
                                    <Card.Text>{result.channelTitle}</Card.Text>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}