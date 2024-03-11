import ytdl from 'ytdl-core';

export async function fetchVideoTitle(videoUrl) {
  try {
    const info = await ytdl.getInfo(videoUrl);
    return info.videoDetails.title;
  } catch (error) {
    console.error('Error fetching video title:', error);
    return null;
  }
}
