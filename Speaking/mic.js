
/* =========================================================
   VOICE ASSISTANT STUDIO
   Complete JavaScript
   Web Speech API + DOM Events
   ========================================================= */


/* =========================================================
   1. GET HTML ELEMENTS
   ========================================================= */

// Text area
const textInput = document.getElementById("textInput");

// Counters
const wordCount = document.getElementById("wordCount");
const characterCount = document.getElementById("characterCount");


// Voice selection
const voiceSelect = document.getElementById("voiceSelect");


// Speech controls
const rate = document.getElementById("rate");
const pitch = document.getElementById("pitch");
const volume = document.getElementById("volume");


// Value displays
const rateValue = document.getElementById("rateValue");
const pitchValue = document.getElementById("pitchValue");
const volumeValue = document.getElementById("volumeValue");


// Buttons
const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");
const stopButton = document.getElementById("stopButton");

const clearButton = document.getElementById("clearButton");
const downloadButton = document.getElementById("downloadButton");


// Smart preset buttons
const welcomePreset = document.getElementById("welcomePreset");
const motivationPreset = document.getElementById("motivationPreset");
const technicalPreset = document.getElementById("technicalPreset");


// Speaking indicator
const speakingIndicator = document.getElementById("speakingIndicator");
const speechStatus = document.getElementById("speechStatus");


/* =========================================================
   2. SPEECH SYNTHESIS
   ========================================================= */

const speechSynthesis = window.speechSynthesis;


/*
   This variable will contain the current
   SpeechSynthesisUtterance object.
*/

let speech = null;


/*
   This array will store all available
   voices from the browser.
*/

let voices = [];


/* =========================================================
   3. LOAD AVAILABLE BROWSER VOICES
   ========================================================= */

function loadVoices() {

    voices = speechSynthesis.getVoices();

    /*
       Remove old options from dropdown.
    */

    voiceSelect.innerHTML = "";


    /*
       If browser doesn't provide voices.
    */

    if (voices.length === 0) {

        const option = document.createElement("option");

        option.textContent = "No voices available";

        option.value = "";

        voiceSelect.appendChild(option);

        return;
    }


    /*
       Add every available browser voice
       to the dropdown.
    */

    voices.forEach((voice, index) => {

        const option = document.createElement("option");

        option.value = index;

        option.textContent =
            `${voice.name} — ${voice.lang}`;

        voiceSelect.appendChild(option);

    });


    /*
       Try to select an English voice
       automatically.
    */

    const englishVoiceIndex = voices.findIndex(
        voice => voice.lang.startsWith("en")
    );


    if (englishVoiceIndex !== -1) {

        voiceSelect.value = englishVoiceIndex;

    }

}


/*
   Different browsers load voices at different times.

   This event tells us when voices become available.
*/

speechSynthesis.onvoiceschanged = loadVoices;


/*
   Try loading voices immediately as well.
*/

loadVoices();


/* =========================================================
   4. UPDATE WORD AND CHARACTER COUNTERS
   ========================================================= */

function updateTextCounter() {

    const text = textInput.value;


    /*
       Character count
    */

    const characters = text.length;

    characterCount.textContent = characters;


    /*
       Word count
    */

    const trimmedText = text.trim();

    if (trimmedText === "") {

        wordCount.textContent = "0";

    } else {

        const words = trimmedText.split(/\s+/);

        wordCount.textContent = words.length;

    }

}


/*
   Run counter whenever user types.
*/

textInput.addEventListener("input", updateTextCounter);


/* =========================================================
   5. UPDATE HEADER CHARACTER COUNT
   ========================================================= */

const headerCharacterCount =
    document.querySelector(".character-count");


function updateHeaderCharacterCount() {

    const length = textInput.value.length;

    headerCharacterCount.textContent =
        `${length} characters`;

}


/*
   Update header counter whenever text changes.
*/

textInput.addEventListener(
    "input",
    updateHeaderCharacterCount
);


/* =========================================================
   6. UPDATE SPEECH RATE
   ========================================================= */

rate.addEventListener("input", function () {

    rateValue.textContent =
        `${rate.value}x`;

});


/* =========================================================
   7. UPDATE PITCH
   ========================================================= */

pitch.addEventListener("input", function () {

    pitchValue.textContent =
        pitch.value;

});


/* =========================================================
   8. UPDATE VOLUME
   ========================================================= */

volume.addEventListener("input", function () {

    const percentage =
        Math.round(volume.value * 100);

    volumeValue.textContent =
        `${percentage}%`;

});


/* =========================================================
   9. CREATE SPEECH
   ========================================================= */

function createSpeech() {

    /*
       Get text from textarea.
    */

    const text = textInput.value.trim();


    /*
       Check if text is empty.
    */

    if (text === "") {

        alert(
            "Please enter some text before playing."
        );

        textInput.focus();

        return null;
    }


    /*
       Stop previous speech.
    */

    speechSynthesis.cancel();


    /*
       Create new speech object.
    */

    const newSpeech =
        new SpeechSynthesisUtterance(text);


    /* -----------------------------------------
       RATE
       ----------------------------------------- */

    newSpeech.rate =
        parseFloat(rate.value);


    /* -----------------------------------------
       PITCH
       ----------------------------------------- */

    newSpeech.pitch =
        parseFloat(pitch.value);


    /* -----------------------------------------
       VOLUME
       ----------------------------------------- */

    newSpeech.volume =
        parseFloat(volume.value);


    /* -----------------------------------------
       SELECTED VOICE
       ----------------------------------------- */

    const selectedVoiceIndex =
        parseInt(voiceSelect.value);


    if (
        !isNaN(selectedVoiceIndex) &&
        voices[selectedVoiceIndex]
    ) {

        newSpeech.voice =
            voices[selectedVoiceIndex];

    }


    /* =====================================================
       SPEECH START EVENT
       ===================================================== */

    newSpeech.onstart = function () {

        /*
           Activate speaking animation.
        */

        speakingIndicator.classList.add("active");


        /*
           Change status text.
        */

        speechStatus.textContent =
            "Speaking Now";


        /*
           Change status description.
        */

        const statusDescription =
            speakingIndicator.querySelector(
                ".sound-info span"
            );

        statusDescription.textContent =
            "Voice Assistant is speaking...";


        /*
           Change play button.
        */

        playButton.querySelector("span").textContent =
            "Speaking...";

    };


    /* =====================================================
       SPEECH END EVENT
       ===================================================== */

    newSpeech.onend = function () {

        /*
           Remove speaking animation.
        */

        speakingIndicator.classList.remove(
            "active"
        );


        /*
           Update status.
        */

        speechStatus.textContent =
            "Ready to Speak";


        const statusDescription =
            speakingIndicator.querySelector(
                ".sound-info span"
            );

        statusDescription.textContent =
            "Your voice assistant is waiting...";


        /*
           Restore play button.
        */

        playButton.querySelector("span").textContent =
            "Play / Resume";

    };


    /* =====================================================
       SPEECH ERROR EVENT
       ===================================================== */

    newSpeech.onerror = function (event) {

        console.error(
            "Speech error:",
            event.error
        );


        speakingIndicator.classList.remove(
            "active"
        );


        speechStatus.textContent =
            "Speech Error";


        const statusDescription =
            speakingIndicator.querySelector(
                ".sound-info span"
            );

        statusDescription.textContent =
            "Something went wrong. Please try again.";


        playButton.querySelector("span").textContent =
            "Play / Resume";

    };


    /* =====================================================
       SPEECH BOUNDARY EVENT
       ===================================================== */

    newSpeech.onboundary = function (event) {

        /*
           This event fires when the speech
           reaches a word or sentence boundary.

           It can later be used for
           word highlighting.
        */

        console.log(
            "Speech boundary:",
            event.charIndex
        );

    };


    return newSpeech;

}


/* =========================================================
   10. PLAY / RESUME BUTTON
   ========================================================= */

playButton.addEventListener(
    "click",
    function () {


        /*
           If speech is currently paused,
           resume it.
        */

        if (speechSynthesis.paused) {

            speechSynthesis.resume();

            speechStatus.textContent =
                "Speaking Now";

            speakingIndicator.classList.add(
                "active"
            );

            return;
        }


        /*
           If speech is already speaking,
           don't start another speech.
        */

        if (speechSynthesis.speaking) {

            return;

        }


        /*
           Create a new speech.
        */

        speech = createSpeech();


        /*
           If speech was created successfully,
           speak it.
        */

        if (speech) {

            speechSynthesis.speak(speech);

        }

    }
);


/* =========================================================
   11. PAUSE BUTTON
   ========================================================= */

pauseButton.addEventListener(
    "click",
    function () {

        /*
           Pause only if speech is active.
        */

        if (
            speechSynthesis.speaking &&
            !speechSynthesis.paused
        ) {

            speechSynthesis.pause();


            /*
               Change status.
            */

            speechStatus.textContent =
                "Speech Paused";


            const statusDescription =
                speakingIndicator.querySelector(
                    ".sound-info span"
                );

            statusDescription.textContent =
                "Speech is currently paused.";


            /*
               Keep indicator visible but
               stop active animation.
            */

            speakingIndicator.classList.remove(
                "active"
            );

        }

    }
);


/* =========================================================
   12. STOP BUTTON
   ========================================================= */

stopButton.addEventListener(
    "click",
    function () {

        /*
           Completely cancel speech.
        */

        speechSynthesis.cancel();


        /*
           Remove animation.
        */

        speakingIndicator.classList.remove(
            "active"
        );


        /*
           Update status.
        */

        speechStatus.textContent =
            "Speech Stopped";


        const statusDescription =
            speakingIndicator.querySelector(
                ".sound-info span"
            );

        statusDescription.textContent =
            "Speech has been stopped.";


        /*
           Restore button text.
        */

        playButton.querySelector("span").textContent =
            "Play / Resume";

    }
);


/* =========================================================
   13. CLEAR BUTTON
   ========================================================= */

clearButton.addEventListener(
    "click",
    function () {

        /*
           Stop current speech first.
        */

        speechSynthesis.cancel();


        /*
           Clear textarea.
        */

        textInput.value = "";


        /*
           Update counters.
        */

        updateTextCounter();

        updateHeaderCharacterCount();


        /*
           Reset status.
        */

        speakingIndicator.classList.remove(
            "active"
        );

        speechStatus.textContent =
            "Ready to Speak";


        const statusDescription =
            speakingIndicator.querySelector(
                ".sound-info span"
            );

        statusDescription.textContent =
            "Your voice assistant is waiting...";


        /*
           Restore play button.
        */

        playButton.querySelector("span").textContent =
            "Play / Resume";


        /*
           Put cursor inside textarea.
        */

        textInput.focus();

    }
);


/* =========================================================
   14. WELCOME PRESET
   ========================================================= */

welcomePreset.addEventListener(
    "click",
    function () {

        textInput.value =
            "Welcome to Voice Assistant Studio. " +
            "This application uses the Web Speech API " +
            "to transform written text into natural speech. " +
            "Thank you for exploring our project.";


        updateTextCounter();

        updateHeaderCharacterCount();


        /*
           Put cursor at the end.
        */

        textInput.focus();

        textInput.setSelectionRange(
            textInput.value.length,
            textInput.value.length
        );

    }
);


/* =========================================================
   15. MOTIVATIONAL PRESET
   ========================================================= */

motivationPreset.addEventListener(
    "click",
    function () {

        textInput.value =
            "Success does not come from what you do occasionally. " +
            "It comes from what you do consistently. " +
            "Keep learning, keep practicing, and never give up. " +
            "Every small step takes you closer to your goal.";


        updateTextCounter();

        updateHeaderCharacterCount();


        textInput.focus();

    }
);


/* =========================================================
   16. TECHNICAL PRESET
   ========================================================= */

technicalPreset.addEventListener(
    "click",
    function () {

        textInput.value =
            "Artificial Intelligence is a branch of computer science " +
            "that focuses on creating systems capable of performing " +
            "tasks that normally require human intelligence, " +
            "such as learning, reasoning, problem solving, " +
            "and understanding language.";


        updateTextCounter();

        updateHeaderCharacterCount();


        textInput.focus();

    }
);


/* =========================================================
   17. VOICE CHANGE EVENT
   ========================================================= */

voiceSelect.addEventListener(
    "change",
    function () {

        const selectedIndex =
            parseInt(this.value);


        if (
            !isNaN(selectedIndex) &&
            voices[selectedIndex]
        ) {

            console.log(
                "Selected voice:",
                voices[selectedIndex].name
            );

        }

    }
);


/* =========================================================
   18. DOWNLOAD SPEECH CONFIGURATION
   ========================================================= */

downloadButton.addEventListener(
    "click",
    function () {

        /*
           Get current values.
        */

        const text =
            textInput.value.trim();


        if (text === "") {

            alert(
                "Please enter some text before downloading."
            );

            return;

        }


        const selectedIndex =
            parseInt(voiceSelect.value);


        let selectedVoice = "Default Browser Voice";


        if (
            !isNaN(selectedIndex) &&
            voices[selectedIndex]
        ) {

            selectedVoice =
                voices[selectedIndex].name;

        }


        /*
           Create configuration text.
        */

        const configuration =

`========================================
       VOICE ASSISTANT STUDIO
       SPEECH CONFIGURATION
========================================

Text:
${text}

----------------------------------------

Voice:
${selectedVoice}

Language:
${
    !isNaN(selectedIndex) &&
    voices[selectedIndex]
        ? voices[selectedIndex].lang
        : "Default"
}

Speech Rate:
${rate.value}

Pitch:
${pitch.value}

Volume:
${Math.round(volume.value * 100)}%

----------------------------------------

Generated by Voice Assistant Studio
========================================`;


        /*
           Convert text into Blob.
        */

        const blob = new Blob(
            [configuration],
            {
                type: "text/plain"
            }
        );


        /*
           Create temporary download URL.
        */

        const url =
            URL.createObjectURL(blob);


        /*
           Create temporary link.
        */

        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "voice-assistant-configuration.txt";


        /*
           Start download.
        */

        document.body.appendChild(link);

        link.click();


        /*
           Remove temporary link.
        */

        document.body.removeChild(link);


        /*
           Release memory.
        */

        URL.revokeObjectURL(url);

    }
);


/* =========================================================
   19. KEYBOARD SHORTCUTS
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        /*
           Ctrl + Enter
           = Play / Resume
        */

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            event.preventDefault();

            playButton.click();

        }


        /*
           Escape
           = Stop
        */

        if (event.key === "Escape") {

            stopButton.click();

        }

    }
);


/* =========================================================
   20. INITIAL VALUES
   ========================================================= */

updateTextCounter();

updateHeaderCharacterCount();


rateValue.textContent =
    `${rate.value}x`;


pitchValue.textContent =
    pitch.value;


volumeValue.textContent =
    `${Math.round(volume.value * 100)}%`;


/* =========================================================
   21. BROWSER SUPPORT CHECK
   ========================================================= */

if (!("speechSynthesis" in window)) {

    alert(
        "Sorry! Your browser does not support Text-to-Speech."
    );


    playButton.disabled = true;

    pauseButton.disabled = true;

    stopButton.disabled = true;

}


/* =========================================================
   END OF VOICE ASSISTANT STUDIO JAVASCRIPT
   ========================================================= */
