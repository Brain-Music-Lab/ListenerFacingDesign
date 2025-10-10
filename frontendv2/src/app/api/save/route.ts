import { NextResponse } from 'next/server';
import YTMusic from "ytmusic-api";
import fs from "fs/promises";

interface Song {
  videoId: string;
}

export async function POST(request: Request) {
  try {
    
    let existingData: any[] = [];
    try {
      const fileContent = await fs.readFile(process.cwd() + '/data/test.json', 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (err) {
      // File doesn't exist or is empty, use empty array
    }

    const newData = await request.json();
    existingData.push(newData);

    await fs.writeFile(
      process.cwd() + '/data/test.json', 
      JSON.stringify(existingData, null, 2)
    );

    return NextResponse.json({
      success: true
    });
   
  } catch(error) {
    console.error("Error processing POST request:", error);
    
    return NextResponse.json({
      success: false,
      error: "Failed to process request"
    }, { status: 500 });
  }
}