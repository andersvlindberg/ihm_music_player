
const statusText = document.querySelector('#status');
const trackList = document.querySelector('#track-list');
const nowPlaying = document.querySelector('#now-playing');
const audioPlayer = document.querySelector('#audio-player');

statusText.textContent = 'JavaScript har hittat HTML-elementen.';

console.log('Klienten är igång');
let tracks = [];

async function loadTracks() {
  statusText.textContent = 'Hämtar låtar från servern...';

  const response = await fetch('/api/tracks');
  tracks = await response.json();

  console.log('Svar från GET /api/tracks:', tracks);
  renderTracks();

  statusText.textContent = `${tracks.length} låtar hämtades.`;
}

function renderTracks() {
  trackList.innerHTML = '';

  for (const track of tracks) {
    const row = document.createElement('div');
    const title = document.createElement('span');
    const playButton = document.createElement('button');

    title.textContent = `${track.title} – ${track.artist}`;
    playButton.textContent = 'Spela';

    playButton.addEventListener('click', function () {
      playTrack(track);
    });

    row.append(title, playButton);
    trackList.append(row);
  }
}
function getVisitorId() {
  let visitorId = localStorage.getItem('visitorId');

  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem('visitorId', visitorId);
  }

  return visitorId;
}

const visitorId = getVisitorId();
console.log('Webbläsarens visitorId:', visitorId);
loadTracks();
async function sendPlayEvent(track) {
  const eventData = {
    type: 'play',
    trackId: track.id,
    visitorId: visitorId
  };

  const response = await fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventData)
  });

  const result = await response.json();
  console.log('Svar från POST /api/events:', result);
}
async function playTrack(track) {
  audioPlayer.src = track.audioUrl;
  nowPlaying.textContent = `${track.title} – ${track.artist}`;

  await audioPlayer.play();
  statusText.textContent = `Spelar ${track.title}`;

  await sendPlayEvent(track);
}