import { NextResponse } from 'next/server';
import YTMusic from "ytmusic-api";

interface Song {
  videoId: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const ytMusic = new YTMusic();

  try {
    await ytMusic.initialize();
    const songs = await ytMusic.search(query!);
    
    if (songs && songs.length > 0) {
      const firstSong: Song = songs[0] as Song;
      
      return NextResponse.json({
        success: true,
        songId: firstSong.videoId
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "No songs found"
      });
    }
  } catch(error) {
    console.error("Error searching for songs:", error);
    
    return NextResponse.json({
      success: false,
      error: "Failed to search for songs"
    }, { status: 500 });
  }
}
