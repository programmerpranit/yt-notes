import { NextRequest, NextResponse } from "next/server";
import ytdl from "ytdl-core";
import { getSubtitles } from "youtube-captions-scraper";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    // Validate URL
    if (!ytdl.validateURL(url)) {
      return NextResponse.json(
        { message: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    // Get video ID
    const videoId = ytdl.getVideoID(url);

    // Get subtitles
    const subtitles = await getSubtitles({
      videoID: videoId,
      lang: "en", // default to English, can be made dynamic
    });

    return NextResponse.json({ subtitles }, { status: 200 });
  } catch (error) {
    console.error("Error fetching subtitles:", error);
    return NextResponse.json(
      { message: "Error fetching subtitles" },
      { status: 500 }
    );
  }
}
