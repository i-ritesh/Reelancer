import puppeteer from 'puppeteer';
import ytdl from 'ytdl-core';

console.log(ytdl.getURLVideoID("https://youtu.be/oAmIqoGkfIY?si=tcSJ92pqfcBso8Yz"));

async function getPlaylistLinks(playlistUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(playlistUrl);

  const links = await page.evaluate(() => {
    const videoElements = document.querySelectorAll('a.ytd-playlist-video-renderer');
    const link = [];
    videoElements.forEach(element => {
      link.push(element.getAttribute('href'));
    });
    return link;
  });

  await browser.close();
  return links.map(link => 'https://youtube.com' + link);
}

const playlistUrl = 'https://www.youtube.com/playlist?list=PLQWUxS1ATI35TiOI-eooFIGNCfO0EOm4R&jct=jsg0wJsUBEpL0934wVHACS2klm6TDA';
(async () => {
  try {
    const links = await getPlaylistLinks(playlistUrl);
    console.log(links);
  } catch (error) {
    console.error('Error:', error);
  }
})();
