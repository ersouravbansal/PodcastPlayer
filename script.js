const audio = new Audio("");
const playPauseBtn = document.getElementById("playPauseBtn");
playPauseBtn.classList.add("fas", "fa-play", "fa-pause");
const stopBtn = document.getElementById("stopBtn");
const backwardBtn = document.getElementById("backwardBtn");
const forwardBtn = document.getElementById("forwardBtn");
const progressBar = document.getElementById("progressBar");
const seekBar = document.getElementById("seekBar");
const seekThumb = document.getElementById("seekThumb");
const volumeSlider = document.getElementById("volumeSlider");
const speedSelect = document.getElementById("speedSelect");
const currentTimeElement = document.getElementById("currentTime");
const totalDurationElement = document.getElementById("totalDuration");
const muteBtn = document.getElementById("muteBtn");
let isDragging = false;

const startDrag = (event) => {
  isDragging = true;
  updateProgressBar(event);
};

const duringDrag = (event) => {
  if (isDragging) {
    updateProgressBar(event);
  }
};

const stopDrag = () => {
  isDragging = false;
};
const openModal = () => {
  const modal = document.getElementById("alertModal");
  modal.style.display = "block";
};

const closeModal = () => {
  const modal = document.getElementById("alertModal");
  modal.style.display = "none";
};

const togglePlayPause = () => {
  const selectedValue = document.getElementById("audioSelect").value;

  if (selectedValue === "Select Audio") {
    openModal();
    return;
  }

  if (audio.paused || audio.ended) {
    audio.play();
    playPauseBtn.classList.remove("fa-play");
    playPauseBtn.classList.add("fa-pause");
  } else {
    audio.pause();
    playPauseBtn.classList.remove("fa-pause");
    playPauseBtn.classList.add("fa-play");
  }
};
const updateVolume = () => {
  const volumeValue = volumeSlider.value;
  audio.volume = volumeValue;

  const volSlide = document.querySelector('.vol-slide input[type="range"]');
  const percentage = (volumeValue * 100).toFixed(2);

  volSlide.style.background = `linear-gradient(to right, red 0%, red ${percentage}%, #ccc ${percentage}%, #ccc 100%)`;

  if (volumeValue === "0") {
    muteBtn.classList.remove("fa-volume-up");
    muteBtn.classList.add("fa-volume-mute");
  } else {
    muteBtn.classList.remove("fa-volume-mute");
    muteBtn.classList.add("fa-volume-up");
  }
};

const toggleMute = () => {
  if (audio.volume === 0) {
    audio.volume = volumeSlider.value;
    muteBtn.classList.remove("fa-volume-mute");
    muteBtn.classList.add("fa-volume-up");
   
  } else {
    audio.volume = 0;
    muteBtn.classList.remove("fa-volume-up");
    muteBtn.classList.add("fa-volume-mute");    
  }
};

const changeAudio = () => {
  const selectedValue = document.getElementById("audioSelect").value;
  audio.src = selectedValue;
  stopAudio();
  seekThumb.style.left = "0px";
  progressBar.style.width = `${0}%`;
  updateSpeed();
};

const downloadAudio = () => {
  const selectedValue = document.getElementById("audioSelect").value;

  fetch(selectedValue)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `audio_${Date.now()}.mp3`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    })
    .catch((error) => console.error("Error fetching audio:", error));
};

const stopAudio = () => {
  audio.pause();
  audio.currentTime = 0;
  playPauseBtn.classList.remove("fa-pause");
  playPauseBtn.classList.add("fa-play");
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
seekThumb.addEventListener("mousedown", startDrag);
document.addEventListener("mousemove", duringDrag);
document.addEventListener("mouseup", stopDrag);

muteBtn.addEventListener("click", toggleMute);

seekThumb.addEventListener("touchstart", (event) => {
  startDrag(event.touches[0]);
});

document.addEventListener("touchmove", (event) => {
  duringDrag(event.touches[0]);
});

document.addEventListener("touchend", stopDrag);

audio.addEventListener("timeupdate", () => {
  const ratio = audio.currentTime / audio.duration;
  progressBar.style.width = `${ratio * 100}%`;
  currentTimeElement.textContent = formatTime(audio.currentTime);
  totalDurationElement.textContent = formatTime(audio.duration);

  const thumbPosition = ratio * seekBar.clientWidth;
  seekThumb.style.left = `${thumbPosition}px`;
});

audio.addEventListener("ended", () => {
  playPauseBtn.classList.remove("fa-pause");
  playPauseBtn.classList.add("fa-play");
  progressBar.style.width = "0";
  currentTimeElement.textContent = "0:00";
  seekThumb.style.left = "0px";
});
