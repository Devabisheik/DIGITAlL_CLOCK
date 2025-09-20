let alarmTime = [];
let currentHour = 0;
let currentMinute = 0;
let currentSession = '';
let currentRingtoneInterval = null; // store current alarm interval

// ====== Clock & Alarm Refresh ======
function refresh() {
    const time = new Date();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    let session = "AM";

    if (hours >= 12) {
        session = "PM";
        if (hours > 12) hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }

    document.getElementById("session").textContent = session;
    document.getElementById("hrs").textContent = String(hours).padStart(2, "0");
    document.getElementById("min").textContent = String(minutes).padStart(2, "0");
    document.getElementById("sec").textContent = String(seconds).padStart(2, "0");

    const currentTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}${session}`;
    const overlay = document.getElementById("alarmOverlay");
    const ringAlarm = document.getElementById("time");

    alarmTime.forEach((alarm, index) => {
        if (currentTime === alarm.time) {
            overlay.style.display = "flex";
            overlay.style.justifyContent = "center";
            overlay.style.alignItems = "center";
            ringAlarm.textContent = `YOUR ${currentTime} ALARM IS RINGING...`;

            playSelectedRingtone();
            currentRingtoneInterval = setInterval(playSelectedRingtone, 8000);

            alarm.element.style.opacity = "0";
            setTimeout(() => { alarm.element.remove(); }, 500);

            alarmTime.splice(index, 1);
            removeAlarmFromStorage(alarm.time);
        }
    });

    currentHour = hours;
    currentMinute = minutes;
    currentSession = session;
}

// ====== Play Ringtone ======
function playSelectedRingtone() {
    const selectedTone = localStorage.getItem("ringtones") || "beep";
    const sound = document.getElementById(selectedTone);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Playback blocked:", e));
    }
}

// ====== OFF Button ======
function stopAlarm() {
    const overlay = document.getElementById("alarmOverlay");
    overlay.style.display = "none";
    if (currentRingtoneInterval) {
        clearInterval(currentRingtoneInterval);
        currentRingtoneInterval = null;
    }
    const selectedTone = localStorage.getItem("ringtones") || "beep";
    const sound = document.getElementById(selectedTone);
    if (sound) sound.pause();
}

// ====== SNOOZE Button ======
function smoozeAlarm(currentAlarmTime) {
    let hour = parseInt(currentAlarmTime.slice(0, 2));
    let minutes = parseInt(currentAlarmTime.slice(3, 5));
    let session = currentAlarmTime.slice(5);

    minutes +=  parseInt(localStorage.getItem("limit")) || 10;

    if (minutes >= 60) {
        minutes -= 60;
        hour += 1;
    }
    if (hour > 12) {
        hour -= 12;
        session = session === "AM" ? "PM" : "AM";
    }

    const newAlarm = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}${session}`;
    addalarmFromCode(newAlarm);
    stopAlarm();
}

// ====== Add Alarm from Code ======
function addalarmFromCode(data) {
    const alarmListBox = document.createElement("div");
    alarmListBox.className = "alarmListBox";
    alarmListBox.style.cssText = `
        display:flex; width:120px; background-color:steelblue; 
        justify-content:space-around; padding:8px 5px; margin:5px; 
        border:2px solid black; border-radius:20px; transition:opacity 1s ease-in; opacity:1;
    `;

    const alarmsList = document.createElement("span");
    alarmsList.textContent = data;
    alarmsList.style.fontSize = "larger";
    alarmsList.style.fontWeight = "bold";

    // ====== ADD FLASH SMS ATTRIBUTES ======
    const givenHour = parseInt(data.slice(0,2));
    const givenMinutes = parseInt(data.slice(3,5));
    const givenSession = data.slice(5);

    alarmsList.dataset.hour = givenHour;
    alarmsList.dataset.minute = givenMinutes;
    alarmsList.dataset.session = givenSession;

    alarmsList.addEventListener("mouseover", () => {
        const flash = document.querySelector(".flashsms");
        flash.textContent = flashSMS(
            parseInt(alarmsList.dataset.hour),
            parseInt(alarmsList.dataset.minute),
            alarmsList.dataset.session
        );
        flash.style.display = "block";
    });

    alarmsList.addEventListener("mouseout", () => {
        const flash = document.querySelector(".flashsms");
        flash.textContent = "";
        flash.style.display = "none";
    });

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.style.cssText = "border:none;color:white;background-color:red;border-radius:5px;padding:3px;font-weight:bolder;";
    removeBtn.addEventListener("click", () => {
        alarmListBox.remove();
        alarmTime = alarmTime.filter(a => a.time !== data);
        removeAlarmFromStorage(data);
    });

    alarmListBox.appendChild(alarmsList);
    alarmListBox.appendChild(removeBtn);
    document.querySelector(".alarmList").appendChild(alarmListBox);

    alarmTime.push({ time: data, element: alarmListBox });
    saveAlarmToStorage(data);
}

// ====== Add Alarm from User Input ======
function addalarm() {
    const givenHour = document.getElementById("hour").value.padStart(2, '0');
    const givenMinutes = document.getElementById("minute").value.padStart(2, '0');
    const givenSession = document.getElementById("alarm_session").value;
    const data = `${givenHour}:${givenMinutes}${givenSession}`;
    addalarmFromCode(data);

    const alarmBoxes = document.getElementById("alarmToggleBox");
    if (alarmBoxes.style.display === "block") alarmBoxes.style.display = "none";
}

// ====== Storage ======
function saveAlarmToStorage(time) {
    const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
    if (!alarms.includes(time)) {
        alarms.push(time);
        localStorage.setItem("alarms", JSON.stringify(alarms));
    }
}

function removeAlarmFromStorage(time) {
    let alarms = JSON.parse(localStorage.getItem("alarms")) || [];
    alarms = alarms.filter(alarm => alarm !== time);
    localStorage.setItem("alarms", JSON.stringify(alarms));
}

// ====== Load Alarms ======
function loadAlarmFromStorage(data) {
    addalarmFromCode(data);
}

// ====== Flash SMS Calculation ======
function flashSMS(givenHour, givenMinutes, givenSession) {
  let sms = "";
  if (givenSession == currentSession) {
    if (currentHour <= givenHour) {
      sms = `alarm in ${givenHour - currentHour} hours-${currentMinute < givenMinutes ? givenMinutes - currentMinute : currentMinute - givenMinutes} minutes`;
    } else {
      sms = `alarm in ${(parseInt(givenHour) + 24) - currentHour} hours-${currentMinute < givenMinutes ? givenMinutes - currentMinute : currentMinute - givenMinutes} minutes`;
    }
  } else {
    if (currentHour <= givenHour) {
      sms = `alarm in ${(parseInt(givenHour) + 12) - currentHour} hours-${currentMinute < givenMinutes ? givenMinutes - currentMinute : currentMinute - givenMinutes} minutes`;
    } else {
      sms = `alarm in ${(parseInt(givenHour) + 12) - currentHour} hours-${currentMinute < givenMinutes ? givenMinutes - currentMinute : currentMinute - givenMinutes} minutes`;
    }
  }
  return sms;
}


// ====== Toggle Alarm Box ======
function toggleAlarmBox() {
    const alarmBox = document.getElementById("alarmToggleBox");
    alarmBox.style.display = (alarmBox.style.display === "block") ? "none" : "block";
}

// ====== DOM Content Loaded ======
window.addEventListener("DOMContentLoaded", () => {
    const savedAlarms = JSON.parse(localStorage.getItem("alarms")) || [];
    savedAlarms.forEach(data => loadAlarmFromStorage(data));

    const fontsize = localStorage.getItem("fontsize");
    if (fontsize) document.body.style.fontSize = fontsize;

    const bgcolor = localStorage.getItem("Mode");
    if (bgcolor) document.body.style.background = bgcolor;
});

// ====== Start Clock ======
setInterval(refresh, 1000);
