'use client'

import { useRouter } from 'next/navigation';
import Button from 'react-bootstrap/Button';
import YouTubeSearch from '../../../components/YouTubeSearch';

export default function SongSelect() {
    const router = useRouter();

    return (
        <div className="container">
            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="text-center mb-4">Select a Song</h2>
                    <YouTubeSearch />
                </div>
            </div>
            
            <div className="row">
                <div className="col-12 d-flex justify-content-center">
                    <Button 
                        className="btn btn-primary"
                        onClick={() => router.push('/dashboard')}
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    )
}