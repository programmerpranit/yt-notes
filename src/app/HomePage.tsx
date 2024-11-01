"use client";

import React, { useState } from "react";
import { getYoutubeSubtitles, summerizeTranscript } from "./actions";
// import { google } from "googleapis";
import jsPDF from "jspdf";
// import { google } from "googleapis";

const HomePage = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  const [summary, setSummary] = useState("");
  const [user, setUser] = useState(null);

  const [error, setError] = useState("");

  const loginHandler = (response) => {
    // console.log("Login Response: ", response);
    setUser(response.credential);
    // Use the access token to get captions
    // getTranscript(response.accessToken);
  };

  const handleGetSubtitles = async () => {
    try {
      setLoading(true);
      setLoadingText("Fetching Youtube video...");
      const videoId = url.split("v=")[1].split("&")[0];

      if (!videoId) {
        console.log("No video ID found");
        alert("No video ID found");
        return null;
      }

      const transcript = await getYoutubeSubtitles(videoId);
      // const response = await axios.post("/api/subtitle", { url });
      // const rawSummary = response.data.subtitles;
      // const transcript = await getYoutubeSubtitles(videoId);
      // const rawSummary = await getYoutubeSubtitles(url);

      console.log(transcript);
      //   return;
      //   setLoadingText("Generating Notes...");
      const rawSummary = await summerizeTranscript(transcript);
      const summary = rawSummary.replaceAll("**", "");
      //   console.log(summary);
      setSummary(summary || "");
      setLoadingText("Generating PDF...");
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(summary || "", 200); // Wrap text
      doc.setFontSize(14);
      let y = 20;
      lines.forEach((line: string) => {
        if (y > 280) {
          // Check if the current page is full
          doc.addPage(); // Add a new page if the current page is full
          y = 20; // Reset y position for the new page
        }
        doc.text(line, 20, y);
        y += 10; // Move y position for the next line
      });
      doc.save("yt.pdf");
      setLoadingText("Loading...");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoadingText("Error");
      setError(`Got some error: ${error?.toString()}`);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-5 h-screen">
        <h1 className="text-2xl font-bold">Youtube Notes Generator</h1>
        <input
          placeholder="Enter YouTube URL"
          className="p-2 rounded-md border-2 w-1/2 border-gray-300 outline-none"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          disabled={loading}
          className="p-2 rounded-md disabled:bg-gray-400 bg-blue-500 text-white"
          onClick={handleGetSubtitles}
        >
          {loading ? (
            <div className="h-5 w-5 rounded-full border-white border-b-black border-t-2 animate-spin"></div>
          ) : (
            "Get Notes"
          )}
        </button>
        {loading && (
          <p className="text-lg font-bold justify-center items-center flex">
            {loadingText}
          </p>
        )}
        {error && (
          <p className="text-lg text-red-500 font-bold justify-center items-center flex">
            {error}
          </p>
        )}
        ;
      </div>
    </>
  );
};

export default HomePage;
