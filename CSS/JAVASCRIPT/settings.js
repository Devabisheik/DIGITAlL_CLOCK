//play the sound from the beginning user clicked the button
let audioFile = null;
const deviceStatus = document.getElementById("deviceStatus");
function playSound(id) {
    const audios = document.querySelectorAll("audio");
    audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });

    if (id === "device") { // NEW FEATURE
        const dataURL = localStorage.getItem("deviceRingtone");
        if (dataURL) {
            if (!audioFile) {
                audioFile = new Audio(dataURL);
            }
            audioFile.pause();
            audioFile.currentTime = 0;
            audioFile.play().catch(err => console.log("Play error:", err));
        } else {
            alert("Please select a ringtone from your device!");
        }
    } else {
        const selected = document.getElementById(id);
        selected.pause();
        selected.currentTime = 0;
        selected.play().catch(err => console.log("Play error:", err));
    }
}

const sms = document.getElementById("flash-message");
const success = document.getElementById("success-message");
const cancel = document.getElementById("cancel-message");

// NEW FEATURE: Listen for device ringtone selection immediately
const deviceInput = document.getElementById("device");
deviceInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            localStorage.setItem("deviceRingtone", e.target.result);
            localStorage.setItem("deviceRingtoneName", file.name); 
            document.getElementById("deviceStatus").textContent =
                "Choosen Ringtones: " + file.name;
        };
        reader.readAsDataURL(file);
    }
});

//it will store locally user selected a ringtones
function newchanges() {
    const fontSize = document.getElementById("size").value;
    if (fontSize) {
        localStorage.setItem("fontsize", fontSize + "px");
    }
    const smoozeLimit = parseInt(document.getElementById("limit").value) || 10;
    if (smoozeLimit) {
        localStorage.setItem("limit", smoozeLimit);
    }
    document.body.style.fontSize = fontSize + "px";

    const Dark = document.getElementById("dark").checked;
    const Light = document.getElementById("light").checked;
    const sound1 = document.getElementById("sounds1").checked;
    const sound2 = document.getElementById("sounds2").checked;
    const sound3 = document.getElementById("sounds3").checked;
    const sound4 = document.getElementById("sounds4").checked;
    const deviceRadio = document.querySelector('input[name="ringtone"][value="device"]'); // NEW FEATURE

    if (sound1) {
        localStorage.setItem("ringtones", "beep")
    }
    else if (sound2) {
        localStorage.setItem("ringtones", "bell")
    }
    else if (sound3) {
        localStorage.setItem("ringtones", "guitar")
    }
    else if (sound4) {
        localStorage.setItem("ringtones", "roaster")
    }
    else if (deviceRadio && deviceRadio.checked) { // NEW FEATURE
        const storedDevice = localStorage.getItem("deviceRingtone");
        if (storedDevice) {
            localStorage.setItem("ringtones", "device");
        } else {
            alert("Please select a ringtone file from your device before clicking Done!");
            return; // prevent saving incomplete settings
        }
    }

    if (Dark) {
        localStorage.setItem("Mode", "linear-gradient(to right, #1e3c72, #2a0845)")
        document.body.style.background = "linear-gradient(to right, #1e3c72, #2a0845)"
    }
    else if (Light) {
        localStorage.setItem("Mode", "linear-gradient(to right, #4facfe, #00f2fe)")
        document.body.style.background = "linear-gradient(to right, #4facfe, #00f2fe)"
    }
    closesms(success);
    showsms(success);
}


function cancelchanges() {
    closesms(cancel);
    showsms(cancel);
}
//it will apply the stored data to page after refresh
window.addEventListener("DOMContentLoaded", () => {
    const bgcolor = localStorage.getItem("Mode");
    if (bgcolor) {
        document.body.style.background = bgcolor;
        if (bgcolor.includes("1e3c72")) {
            document.getElementById("dark").checked = true;
        } else if (bgcolor.includes("4facfe")) {
            document.getElementById("light").checked = true;
        }
    }
    const currentFontsize = localStorage.getItem("fontsize");
    if (currentFontsize) {
        document.getElementById("size").value = parseInt(currentFontsize);
        document.body.style.fontSize = currentFontsize;
    }
    const savedRingtone = localStorage.getItem("deviceRingtoneName");
    if (savedRingtone) {
        document.getElementById("deviceStatus").textContent =
            "CHOOSEN RINGTONE: " + "\""+savedRingtone+"\"";
    } else {
        document.getElementById("deviceStatus").textContent = "No device ringtone chosen.";
    }
    const tones = localStorage.getItem("ringtones");
    if (tones === "beep") {
        document.getElementById("sounds1").checked = true;
    } else if (tones === "bell") {
        document.getElementById("sounds2").checked = true;
    } else if (tones === "guitar") {
        document.getElementById("sounds3").checked = true;
    } else if (tones === "roaster") {
        document.getElementById("sounds4").checked = true;
    } else if (tones === "device") { // NEW FEATURE
        const deviceRadio = document.querySelector('input[name="ringtone"][value="device"]');
        if (deviceRadio) deviceRadio.checked = true;
    }
});

function showsms(element = sms) {
    element.style.display = "flex";  // make it visible
    element.classList.add("show");
    setTimeout(() => closesmslate(element), 2000);
}

function closesms(element = sms) {
    element.classList.remove("show");
    element.style.display = "none";

}

function closesmslate(element = sms) {
    element.classList.remove("show");
    setTimeout(() => {
        element.style.display = "none";
    }, 2000);
}

// show on load
window.onload = () => {
    showsms(sms);
};
