const audio = new Audio('');
const playPauseBtn = document.getElementById('playPauseBtn');
const stopBtn = document.getElementById('stopBtn');
const backwardBtn = document.getElementById('backwardBtn');
const forwardBtn = document.getElementById('forwardBtn');
const progressBar = document.getElementById('progressBar');
const seekBar = document.getElementById('seekBar');
const volumeSlider = document.getElementById('volumeSlider');
const speedSelect = document.getElementById('speedSelect');
const currentTimeElement = document.getElementById('currentTime');
const totalDurationElement = document.getElementById('totalDuration');

playPauseBtn.addEventListener('click', togglePlayPause);
stopBtn.addEventListener('click', stopAudio);
backwardBtn.addEventListener('click', backward);
forwardBtn.addEventListener('click', forward);
seekBar.addEventListener('click', updateProgressBar);
volumeSlider.addEventListener('input', updateVolume);
speedSelect.addEventListener('change', updateSpeed);

function changeAudio() {
    const selectedValue = document.getElementById('audioSelect').value;
    audio.src = selectedValue;
    stopAudio(); 
    progressBar.style.width = `${0}%`;
  }
function togglePlayPause() {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = 'Pause';
    updateProgressBar();
  } else {
    audio.pause();
    playPauseBtn.textContent = 'Play';
  }
}

function stopAudio() {
  audio.pause();
  audio.currentTime = 0;
  playPauseBtn.textContent = 'Play';
  updateProgressBar();
}

function backward() {
  audio.currentTime -= 10;
}

function forward() {
  audio.currentTime += 10;
}

function updateProgressBar(event) {
  const clickedPosition = event ? event.clientX - seekBar.getBoundingClientRect().left : 0;
  const ratio = clickedPosition / seekBar.clientWidth;
  const newPosition = ratio * audio.duration;

  if (!isNaN(newPosition)) {
    audio.currentTime = newPosition;
    progressBar.style.width = `${ratio * 100}%`;
  }
}
function updateVolume() {
  audio.volume = volumeSlider.value;
}

function updateSpeed() {
  audio.playbackRate = parseFloat(speedSelect.value);
}
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  audio.addEventListener('loadedmetadata', () => {
    totalDurationElement.textContent = formatTime(audio.duration);
  });

audio.addEventListener('timeupdate', () => {
  const ratio = audio.currentTime / audio.duration;
  progressBar.style.width = `${ratio * 100}%`;
  currentTimeElement.textContent = formatTime(audio.currentTime);
  totalDurationElement.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
  playPauseBtn.textContent = 'Play';
  progressBar.style.width = '0';
  currentTimeElement.textContent = '0:00';
});
