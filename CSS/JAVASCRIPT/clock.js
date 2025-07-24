
let alarmTime = [];
let currentHour = 0;
let currentMinute = 0;
let currentSession = '';

function refresh() {
  let time = new Date();
  let hours = time.getHours();
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();
  let session = "AM";
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

  if (hours >= 12) {
    session = "PM";
    if (hours > 12) hours = hours - 12;
  }
  document.getElementById("session").innerHTML = session;
  document.getElementById("hrs").innerHTML = `${hours}`.padStart(2, "0");
  document.getElementById("min").innerHTML = `${minutes}`.padStart(2, "0");
  document.getElementById("sec").innerHTML = `${seconds}`.padStart(2, "0");
  const hstr = `${hours}`.padStart(2, "0");
  const mstr = `${minutes}`.padStart(2, "0");
  const sstr = `${session}`
  const currentTime = `${hstr}:${mstr}${sstr}`
  alarmTime.forEach((alarm, index) => {
    if (currentTime == alarm.time) {
      alarm.element.style.width = "90px"
      const stoppingAlarm = setInterval(playSelectedRingtone, 2000);
      alarm.element.style.opacity = "0"
      setTimeout(() => {
        clearInterval(stoppingAlarm)
        alarm.element.remove();
      }, 9000)
      alarmTime.splice(index, 1);
      removeAlarmFromStorage(alarm.time); 
    }
  });
  currentHour = hours;
  currentMinute = minutes;
  currentSession = session;
}

function toggleAlarmBox() {
  const alarmBox = document.getElementById("alarmToggleBox");
  if (alarmBox.style.display === "none" || alarmBox.style.display === "") {
    alarmBox.style.display = "block";
  } else {
    alarmBox.style.display = "none"; 1
  }
}

function flashSMS(givenHour, givenMinutes, givenSession) {
  let sms = "";
  if (givenSession == currentSession) {
    if (currentHour <= givenHour) {
      sms = `alarm in ${givenHour - currentHour} hours-${currentMinute < givenMinutes ? givenMinutes - currentMinute : currentMinute - givenMinutes} minutes`;
    }
    else {
      sms = `alarm in ${(parseInt(givenHour) + 24) - currentHour} hours-${currentMinute < givenMinutes ? givenMinutes - currentMinute : currentMinute - givenMinutes} minutes`;
    }
  }
  else {
    if (currentHour <= givenHour) {
      sms = `alarm in ${(parseInt(givenHour) + 12) - currentHour} hours-${currentMinute < givenMinutes ? givenMinutes - currentMinute : currentMinute - givenMinutes} minutes`;
    }
    else {
      sms = `alarm in ${(parseInt(givenHour) + 12) - currentHour} hours-${currentMinute < givenMinutes ? givenMinutes - currentMinute : currentMinute - givenMinutes} minutes`;
    }
  }
  return sms;
}

function addalarm() {
  const alarmBoxes = document.getElementById("alarmToggleBox");
  const givenHour = `${document.getElementById("hour").value}`.padStart(2, "0");
  const givenMinutes = `${document.getElementById("minute").value}`.padStart(2, "0");
  const givenSession = `${document.getElementById("alarm_session").value}`.padStart(2, "0");
  const alarmListBox = document.createElement("div");
  alarmListBox.style.display = "flex";
  alarmListBox.className = "alarmListBox"
  alarmListBox.style.width = "100px"
  alarmListBox.style.backgroundColor = "steelblue";
  alarmListBox.style.justifyContent = "space-between"
  alarmListBox.style.padding = "8px 5px 8px 5px";
  alarmListBox.style.margin = "5px";
  alarmListBox.style.border = "2px solid black"
  alarmListBox.style.borderRadius = "20px";
  alarmListBox.style.transition = "opacity 13s ease-in";
  alarmListBox.style.opacity = "1";
  const data = `${givenHour}:${givenMinutes}${givenSession}`;
  const alarmsList = document.createElement("span");
  alarmsList.textContent = data;
  alarmsList.style.fontSize = "large"
  alarmsList.addEventListener("mouseover", () => {
    const flash = document.querySelector(".flashsms");
    flash.textContent = flashSMS(givenHour, givenMinutes, givenSession);
    flash.style.display = "block";
  });

  alarmsList.addEventListener("mouseout", () => {
    setTimeout(() => {
      const flash = document.querySelector(".flashsms");
      flash.textContent = "";
      flash.style.display = "none";
    }, 2000);
  });

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "X";
  removeBtn.style.textAlign = "center";
  removeBtn.style.border = "none";
  removeBtn.style.color = "white";
  removeBtn.style.borderRadius = "8px"
  removeBtn.style.backgroundColor = "red";
  removeBtn.addEventListener('mouseover', () => { removeBtn.style.backgroundColor = "#d32f2f" })
  removeBtn.addEventListener('mouseout', () => { removeBtn.style.backgroundColor = "red" })
  removeBtn.addEventListener("click", () => {
    alarmListBox.style.opacity = "0";
    setTimeout(() => {
      alarmListBox.remove();
    }, 300);
    alarmTime = alarmTime.filter(a => a.time !== data);
    removeAlarmFromStorage(data); 
  })

  alarmTime.push(
    {
      time: data,
      element: alarmListBox
    }
  );
  alarmListBox.appendChild(alarmsList);
  alarmListBox.appendChild(removeBtn);
  document.querySelector(".alarmList").appendChild(alarmListBox)

  saveAlarmToStorage(data); 

  if (alarmBoxes.style.display === "block") {
    alarmBoxes.style.display = "none";
  }
}
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

function loadAlarmFromStorage(data) {
  const givenHour = data.slice(0, 2);
  const givenMinutes = data.slice(3, 5);
  const givenSession = data.slice(5);

  const alarmBoxes = document.getElementById("alarmToggleBox");
  const alarmListBox = document.createElement("div");
  alarmListBox.style.display = "flex";
  alarmListBox.className = "alarmListBox"
  alarmListBox.style.width = "100px"
  alarmListBox.style.backgroundColor = "steelblue";
  alarmListBox.style.justifyContent = "space-between"
  alarmListBox.style.padding = "8px 5px 8px 5px";
  alarmListBox.style.margin = "5px";
  alarmListBox.style.border = "2px solid black"
  alarmListBox.style.borderRadius = "20px";
  alarmListBox.style.transition = "opacity 13s ease-in";
  alarmListBox.style.opacity = "1";

  const alarmsList = document.createElement("span");
  alarmsList.textContent = data;
  alarmsList.style.fontSize = "large"
  alarmsList.addEventListener("mouseover", () => {
    const flash = document.querySelector(".flashsms");
    flash.textContent = flashSMS(givenHour, givenMinutes, givenSession);
    flash.style.display = "block";
  });

  alarmsList.addEventListener("mouseout", () => {
    setTimeout(() => {
      const flash = document.querySelector(".flashsms");
      flash.textContent = "";
      flash.style.display = "none";
    }, 2000);
  });

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "X";
  removeBtn.style.textAlign = "center";
  removeBtn.style.border = "none";
  removeBtn.style.color = "white";
  removeBtn.style.borderRadius = "8px"
  removeBtn.style.backgroundColor = "red";
  removeBtn.addEventListener('mouseover', () => { removeBtn.style.backgroundColor = "#d32f2f" })
  removeBtn.addEventListener('mouseout', () => { removeBtn.style.backgroundColor = "red" })
  removeBtn.addEventListener("click", () => {
    alarmListBox.style.opacity = "0";
    setTimeout(() => {
      alarmListBox.remove();
    }, 300);
    alarmTime = alarmTime.filter(a => a.time !== data);
    removeAlarmFromStorage(data); 
  })

  alarmTime.push(
    {
      time: data,
      element: alarmListBox
    }
  );
  alarmListBox.appendChild(alarmsList);
  alarmListBox.appendChild(removeBtn);
  document.querySelector(".alarmList").appendChild(alarmListBox)
}
window.addEventListener("DOMContentLoaded", () => {
  const savedAlarms = JSON.parse(localStorage.getItem("alarms")) || [];
  savedAlarms.forEach(data => loadAlarmFromStorage(data));
  const fontsize = localStorage.getItem("fontsize");
  document.body.style.fontSize = fontsize;
  const bgcolor = localStorage.getItem("Mode");
  if (bgcolor) {
    document.body.style.background = bgcolor;
  }

});
const header=document.querySelector("header");
header.addEventListener("click",()=>{})
// Start the clock
setInterval(refresh, 1000);
