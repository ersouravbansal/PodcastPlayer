const audio = new Audio("");
const playPauseBtn = document.getElementById("playPauseBtn");
const stopBtn = document.getElementById("stopBtn");
const backwardBtn = document.getElementById("backwardBtn");
const forwardBtn = document.getElementById("forwardBtn");
const progressBar = document.getElementById("progressBar");
const seekBar = document.getElementById("seekBar");
const volumeSlider = document.getElementById("volumeSlider");
const speedSelect = document.getElementById("speedSelect");
const currentTimeElement = document.getElementById("currentTime");
const totalDurationElement = document.getElementById("totalDuration");
const togglePlayPause = () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "Pause";
    updateProgressBar();
  } else {
    audio.pause();
    playPauseBtn.textContent = "Play";
  }
};
const changeAudio = () => {
  const selectedValue = document.getElementById("audioSelect").value;
  audio.src = selectedValue;
  stopAudio();
  progressBar.style.width = `${0}%`;
  updateSpeed()
};

const downloadAudio = () => {
  const selectedValue = document.getElementById("audioSelect").value;

  // Fetch the audio file
  fetch(selectedValue)
    .then((response) => response.blob())
    .then((blob) => {
      // Create a Blob from the audio data
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = `audio_${Date.now()}.mp3`; // You can customize the file name

      // Append the link to the document, trigger a click, and remove the link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Release the Blob URL
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => console.error("Error fetching audio:", error));
};

const stopAudio = () => {
  audio.pause();
  audio.currentTime = 0;
  playPauseBtn.textContent = "Play";
  updateProgressBar();
};

const backward = () => {
  audio.currentTime -= 10;
};

const forward = () => {
  audio.currentTime += 10;
};

const updateProgressBar = (event) => {
  const clickedPosition = event
    ? event.clientX - seekBar.getBoundingClientRect().left
    : 0;
  const ratio = clickedPosition / seekBar.clientWidth;
  const newPosition = ratio * audio.duration;

  if (!isNaN(newPosition)) {
    audio.currentTime = newPosition;
    progressBar.style.width = `${ratio * 100}%`;
  }
};
const updateVolume = () => {
  audio.volume = volumeSlider.value;
};

const updateSpeed = () => {
  audio.playbackRate = parseFloat(speedSelect.value);
};
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};
audio.addEventListener("loadedmetadata", () => {
  totalDurationElement.textContent = formatTime(audio.duration);
});

playPauseBtn.addEventListener("click", togglePlayPause);
stopBtn.addEventListener("click", stopAudio);
backwardBtn.addEventListener("click", backward);
forwardBtn.addEventListener("click", forward);
seekBar.addEventListener("click", updateProgressBar);
volumeSlider.addEventListener("input", updateVolume);
speedSelect.addEventListener("change", updateSpeed);
audio.addEventListener("timeupdate", () => {
  const ratio = audio.currentTime / audio.duration;
  progressBar.style.width = `${ratio * 100}%`;
  currentTimeElement.textContent = formatTime(audio.currentTime);
  totalDurationElement.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => {
  playPauseBtn.textContent = "Play";
  progressBar.style.width = "0";
  currentTimeElement.textContent = "0:00";
});
