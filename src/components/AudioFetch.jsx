import React, { useState, useRef } from "react";
// import ytdl from 'ytdl-core';
import axios from "axios";
import "./AudioFetch.css";
// import { fetchVideoTitle } from "../../backend/title";

const AudioFetch = () => {
  const [url, setUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState("");
  const [playList, setPlayList] = useState([]);
  const [totalSong, setTotalSong] = useState(0)
  const [title, setTitle] = useState()
  const audioRef = useRef(null);

  const fetchAndPlaySong = async (songUrl) => {
    try {
      const response = await axios.get("http://localhost:5000/audio", {
        params: { videoUrl: songUrl },
      });
      setAudioUrl(response.data.audioUrl);

      if (audioRef.current) {
        await new Promise((resolve) => {
          audioRef.current.oncanplaythrough = resolve;
        });

        audioRef.current.play();

        return new Promise((resolve) => {
          audioRef.current.onended = resolve;
        });
      } else {
        console.error("Audio element is not initialized.");
      }
    } catch (error) {
      console.error("Error fetching song:", error);
    }
  };


  
  const fetchThumbnail = async (url) => {
    try {
      let videoId;
      if (url.includes("youtu.be")) {
        videoId = url.split("/").pop().split("?")[0];
      } else if (url.includes("watch")) {
        const params = new URLSearchParams(url.split("?")[1]);
        videoId = params.get("v");
      } else {
        console.error("Unsupported YouTube URL format.");
        return;
      }

      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

      setThumbnail(thumbnailUrl);
    } catch (error) {
      console.error("Error fetching thumbnail:", error);
    }
    
  };



  

  const fetchAudio = async () => {
    try {
      setIsLoading(true);
      let response;
      if (url.includes("playlist")) {
        response = await axios.get("http://localhost:5000/playlist", {
          params: { playlistUrl: url },
        });
        const songUrls = response.data.songUrls;
        console.log(songUrls);
        if (songUrls.length > 0) {
          setPlayList(songUrls);
          setTotalSong(songUrls.length)
          await fetchAndPlaySong(songUrls[0]);
          await fetchThumbnail(songUrls[1]);

          for (let i = 1; i < songUrls.length; i++) {
            await fetchAndPlaySong(songUrls[i]);
            await fetchThumbnail(songUrls[i + 1]);
          }
        } else {
          console.error("Playlist is empty.");
        }
      } else {
        response = await axios.get("http://localhost:5000/audio", {
          params: { videoUrl: url },
        });
        setAudioUrl(response.data.audioUrl);
        fetchThumbnail(url);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching audio:", error);
      setIsLoading(false);
    }
  };

  console.log(playList.length);
  return (
    <div className="audio-fetch-container">
      <h3>Total Songs are : {totalSong}</h3>
      <div className="container min-w-100px w-auto max-w-900 mx-auto mt-20">
        <div className="card flex flex-col items-center bg-gradient-to-tr from-blue-400 to-red-400 text-xl font-mono p-4 rounded-md text-white">
          <div className="cover flex flex-col items-center min-w-80px w-auto max-w-880px">
            <img
              src={thumbnail}
              alt="{img}"
              className="w-3/6 rounded-xl blur-sm"
            />
            <p className="-translate-y-10 w-3/6 text-center break-words">
              Shaamat (Full Video) - Ek Villain Returns | John, Disha, Arjun,
              Tara | Ankit, Prince, Mohit, Ektaa K
            </p>
          </div>
          {audioUrl && (
            <audio
              id="song"
              className="block w-full max-w-md mx-auto"
              controls
              src={audioUrl}
              ref={audioRef}
            ></audio>
          )}
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube video or playlist URL"
            className="input-field"
            
          />
          <button onClick={fetchAudio} className="fetch-button">
            {isLoading ? "Playing...." : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioFetch;
