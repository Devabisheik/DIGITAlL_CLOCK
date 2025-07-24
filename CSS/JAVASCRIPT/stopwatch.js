let seconds = 0, minutes = 0, hours = 0;
let signal = false;
let closeIntervalId = null;

document.getElementById("release").style.display = "none";
document.getElementById("stop").style.display = "none";
document.getElementById("clear").style.display = "none";

  function playSelectedRingtone() {
    const selectedTone = localStorage.getItem("ringtones") || "beep";
    const sound = document.getElementById(selectedTone);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch((e) => console.log("Playback blocked:", e));
    } else {
      console.warn("Ringtone not found:", selectedTone);
    }
  }

function display() {
  document.getElementById("second").value = `${seconds}`.padStart(2, "0");
  document.getElementById("minute").value = `${minutes}`.padStart(2, "0");
  document.getElementById("hour").value = `${hours}`.padStart(2, "0");
}

function begin() {
  if (signal) return;

  if (hours === 0 && minutes === 0 && seconds === 0) {
    clearInterval(closeIntervalId);
    playSelectedRingtone();
    return;
  }

  if (seconds > 0) {
    seconds--;
  } else {
    if (minutes > 0) {
      minutes--;
      seconds = 59;
    } else if (hours > 0) {
      hours--;
      minutes = 59;
      seconds = 59;
    }
  }

  display();
}

function process() {

  seconds = parseInt(document.getElementById("second").value) || 0;
  minutes = parseInt(document.getElementById("minute").value) || 0;
  hours = parseInt(document.getElementById("hour").value) || 0;

  signal = false;
  closeIntervalId = setInterval(begin, 1000);

  document.getElementById("start").style.display = "none";
  document.getElementById("release").style.display = "inline";
  document.getElementById("stop").style.display = "inline";
  document.getElementById("clear").style.display = "inline";
}

function pause() {
  signal = true;
  display();
}

function resume() {
  signal = false;
  display();
}

function reset() {
  minutes = hours = seconds = 0;
  signal = true;
  clearInterval(closeIntervalId);
  document.getElementById("start").style.display = "inline";
  document.getElementById("release").style.display = "none";
  document.getElementById("stop").style.display = "none";
  document.getElementById("clear").style.display = "none";
  display();
}
window.addEventListener("DOMContentLoaded", () => {
  const fontsize = localStorage.getItem("fontsize");
  document.body.style.fontSize = fontsize;
  const bgcolor = localStorage.getItem("Mode");
  if (bgcolor) {
    document.body.style.background = bgcolor;
  }
});
