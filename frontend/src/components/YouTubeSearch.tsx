'use client'

import { useState, RefObject } from 'react';
import { useRouter } from 'next/navigation';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import { searchYouTubeVideos, YouTubeSearchResult } from '../lib/youtube';
import { useVideo } from '../contexts/VideoContext';
import Image from 'next/image';

interface YouTubeSearchProps {
    searchRef?: RefObject<HTMLInputElement | null>;
    videoRefs?: RefObject<HTMLDivElement[]>;
    selectedVideoIndex?: number;
    onSearchComplete?: (results: YouTubeSearchResult[]) => void;
}

export default function YouTubeSearch({ searchRef, videoRefs, selectedVideoIndex = -1, onSearchComplete }: YouTubeSearchProps) {
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
            if (videoRefs?.current) {
                videoRefs.current = [];
            }
            if (onSearchComplete) {
                onSearchComplete(results);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while searching');
            setSearchResults([]);
            if (onSearchComplete) {
                onSearchComplete([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const selectVideo = (result: YouTubeSearchResult) => {
        setSelectedVideo(result);
        router.push('/memory-listening/song-play');
    };

    const getVideoStyle = (index: number) => ({
        outlineOffset: '3px',
        transition: 'all 0.2s ease-in-out',
        outline: selectedVideoIndex === index ? '3px solid #007bff' : 'none',
        transform: selectedVideoIndex === index ? 'scale(1.05)' : 'scale(1)'
    });

    return (
        <div className="youtube-search-container">
            <Form onSubmit={handleSearch} className="mb-4">
                <InputGroup>
                    <Form.Control
                        ref={searchRef}
                        type="text"
                        placeholder="Use the keyboard to search for a song"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={isLoading}
                    />
                    <InputGroup.Text>
                        <button 
                            type="submit"
                            className="yellow-interact"
                            disabled={isLoading}
                        >
                            <h5 style={{ color: "black" }}>
                                {isLoading ? 'Searching...' : 'Search'}
                            </h5> 
                        </button>
                    </InputGroup.Text>
                </InputGroup>
            </Form>
            
            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}
            
            {searchResults.length > 0 && (
                <div className="search-results mb-4">
                    {searchResults.map((result, index) => (
                        <div
                            key={result.id}
                            ref={el => {
                                if (el && videoRefs?.current) {
                                    videoRefs.current[index] = el;
                                }
                            }}
                            onClick={() => selectVideo(result)}
                        >
                            <Card 
                                className="mb-2" 
                                style={{ cursor: 'pointer', ...getVideoStyle(index) }}
                            >
                                <Card.Body className="d-flex align-items-center">
                                    <Image
                                        src={result.thumbnail}
                                        alt={`Thumbnail for ${result.title}`}
                                        width={120}
                                        height={90}
                                        className="me-3"
                                        unoptimized // Since YouTube thumbnails are already optimized
                                    />
                                    <div>
                                        <Card.Title>{result.title}</Card.Title>
                                        <Card.Text>{result.channelTitle}</Card.Text>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}