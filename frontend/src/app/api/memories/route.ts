import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { sessionId, videoId, videoTitle, memoryText } = data;

        // Ensure data directory exists
        const dataDir = path.join(process.cwd(), 'data');
        await fs.mkdir(dataDir, { recursive: true });

        // Ensure session directory exists
        const sessionDir = path.join(dataDir, sessionId);
        await fs.mkdir(sessionDir, { recursive: true });

        // Try to find existing file for this video in this session
        const files = await fs.readdir(sessionDir);
        const existingFile = files.find(f => f.startsWith(videoId + '-'));

        const timestamp = Date.now();

        if (existingFile) {
            // If file exists, read it and append the new memory
            const filePath = path.join(sessionDir, existingFile);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const existingData = JSON.parse(fileContent);

            // Convert single memory to array if needed
            const memories = Array.isArray(existingData.memories) 
                ? existingData.memories 
                : [{
                    memoryText: existingData.memoryText,
                    timestamp: existingData.timestamp
                }];

            // Add new memory
            memories.push({
                memoryText,
                timestamp
            });

            // Save updated data
            await fs.writeFile(filePath, JSON.stringify({
                videoId,
                videoTitle,
                memories
            }, null, 2));
        } else {
            // Create new file
            const fileName = `${videoId}-${timestamp}.json`;
            const filePath = path.join(sessionDir, fileName);
            
            await fs.writeFile(filePath, JSON.stringify({
                videoId,
                videoTitle,
                memories: [{
                    memoryText,
                    timestamp
                }]
            }, null, 2));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving memory:', error);
        return NextResponse.json({ error: 'Failed to save memory' }, { status: 500 });
    }
}