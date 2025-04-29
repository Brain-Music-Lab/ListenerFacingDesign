'use client'

import { useRouter } from 'next/navigation';
import Button from 'react-bootstrap/Button';

export default function MemoryListening () {
    const router = useRouter();

    return (
        <div className="container d-flex justify-content-center">
            <Button 
                className="btn btn-primary" 
                onClick={() => router.push('/memory-listening/song-select')}
            >
                Go to Song Select
            </Button>
        </div>
    )
}