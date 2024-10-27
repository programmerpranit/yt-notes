"use server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { YoutubeTranscript, type TranscriptResponse } from "youtube-transcript";
// import { google } from "googleapis";
// import { getSubtitles } from "youtube-captions-scraper";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export async function getYoutubeSubtitles(url: string) {
  // const transcript = await getSubtitles({
  //   videoID: videoId,
  //   lang: "en",
  // });
  // console.log(transcript);
  // return transcript;

  // const google = createGoogleGenerativeAI({
  //   apiKey: process.env.GOOGLE_API_KEY,
  // });
  // const model = google("gemini-1.0-pro");

  // const response = await generateText({
  //   model,
  //   prompt: `${url} Summerize this video and give education notes`,
  // });

  // console.log(response.text);
  // return response.text;

  const transcript = await YoutubeTranscript.fetchTranscript(url);
  console.log(transcript);
  return transcript;
}

export async function summerizeTranscript(transcript: any[]) {
  // open ai api call

  const response = await generateText({
    model: openai("gpt-4o"),
    prompt: `You are a helpful assistant that summarizes youtube transcripts. In form of educative notes to refer them later. Focus on educative content Write summary in very understandable way. Make it more informative than making it short. Dont make it look like it is summary of a youtube video just get the content. Make it look beautiful. Here is the transcript: ${transcript
      .map((t) => t.text)
      .join(" ")}`,
  });

  console.log(response.text);
  return response.text;
}
