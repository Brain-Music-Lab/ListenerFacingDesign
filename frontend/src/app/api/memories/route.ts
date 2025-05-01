import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Define the file structure interfaces
interface Memory {
  memoryText: string;
  timestamp: number;
}

interface Song {
  videoId: string;
  videoTitle: string;
  memories: Memory[];
}

interface SessionData {
  sessionId: string;
  songs: Song[];
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { sessionId, videoId, videoTitle, memoryText } = data;

        // Ensure data directory exists
        const dataDir = path.join(process.cwd(), 'data');
        await fs.mkdir(dataDir, { recursive: true });

        // Session file name - one file per session
        const fileName = `session-${sessionId}.json`;
        const filePath = path.join(dataDir, fileName);
        
        // Timestamp for the new memory
        const timestamp = Date.now();

        // Check if session file already exists
        let sessionData: SessionData = {
          sessionId: sessionId,
          songs: []
        };

        try {
            const fileExists = await fs.stat(filePath).then(() => true).catch(() => false);
            if (fileExists) {
                // Read existing session file and parse its contents
                const fileContent = await fs.readFile(filePath, 'utf-8');
                sessionData = JSON.parse(fileContent);
            }
        } catch (error) {
            console.error('Error checking or reading existing session file:', error);
            // Continue with new session file if there's an error reading existing one
        }

        // Find if song already exists in the session
        const existingSongIndex = sessionData.songs.findIndex(song => song.videoId === videoId);
        
        if (existingSongIndex >= 0) {
            // Song exists, add memory to this song
            sessionData.songs[existingSongIndex].memories.push({
                memoryText,
                timestamp
            });
        } else {
            // Song doesn't exist yet, add new song with this memory
            sessionData.songs.push({
                videoId,
                videoTitle,
                memories: [{
                    memoryText,
                    timestamp
                }]
            });
        }

        // Save updated session data
        await fs.writeFile(filePath, JSON.stringify(sessionData, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving memory:', error);
        return NextResponse.json({ error: 'Failed to save memory' }, { status: 500 });
    }
}