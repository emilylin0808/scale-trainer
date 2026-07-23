const scaleSelect = document.getElementById('scaleSelect');
const startButton = document.getElementById('startButton');
const scaleDisplay = document.getElementById('scaleDisplay');
const status = document.getElementById('status');
const timerDisplay = document.getElementById('timer');
const soundLevel = document.getElementById('soundLevel');
const frequencyDisplay = document.getElementById('frequency'); // New element to display frequency

import { PitchDetector } from "pitchy";
console.log(PitchDetector); // Debugging statement to make sure PitchDetector is loaded

console.log("Scale Trainer loaded"); // Debugging statement to make sure JavaScript is connected to the HTML file
const scales = {
    "C Major": ["C", "D", "E", "F", "G", "A", "B", "C"],
    "D Major": ["D", "E", "F#", "G", "A", "B", "C#", "D"],
    "E Major": ["E", "F#", "G#", "A", "B", "C#", "D#", "E"],
    "F Major": ["F", "G", "A", "Bb", "C", "D", "E", "F"],
    "G Major": ["G", "A", "B", "C", "D", "E", "F#", "G"],
    "A Major": ["A", "B", "C#", "D", "E", "F#", "G#", "A"],
    "B Major": ["B", "C#", "D#", "E", "F#", "G#", "A#", "B"]
};
console.log(scales["C Major"]); // Making sure the scales object is being logged correctly

// ----------------------------------------------Variables------------------------------------------------------------------
let practicing = false;
let seconds = 0;
let timer;
let currentScale = scaleSelect.value;
let practiceHistory = []; // Array to store previous practice data
let microphoneStream = null; // Variable to hold the microphone stream
let audioContext = null; // Variable to hold the AudioContext
let analyser = null; // Variable to hold the AnalyserNode
let pitchDetector = null; // Variable to hold the PitchDetector instance
let currentNote = "";
// ----------------------------------------------Event Listeners------------------------------------------------------------------
startButton.addEventListener('click', function() { // Starts or stops the practice session when the button is clicked
    //console.log("Start button clicked"); // Debugging statement to make sure the button click is being detected
    currentScale = scaleSelect.value;

    //console.log(currentScale); // Making sure the selected scale is being logged correctly
    if (!practicing) {
        startPractice();
    } else {
        stopPractice();
    }
});

scaleSelect.addEventListener("change", updateScaleDisplay); // Updates the scale display when a new scale is selected

// ----------------------------------------------Functions------------------------------------------------------------------
async function startPractice() {
    await requestMicrophone(); // Ensure microphone access is requested before starting practice
    practicing = true;
    requestMicrophone(); // gets microphone access from the user when they start practice
    startButton.innerHTML = "Stop Practice";
    status.innerHTML = "Practice in progress...";
    seconds = 0;
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() { // Updates the timer display every second
    seconds++;
    timerDisplay.innerHTML = "Time: " + seconds + "s";
}

function stopPractice() {
    practicing = false;
    startButton.innerHTML = "Start Practice";
    status.innerHTML = "Practice finished."
    clearInterval(timer);
    practiceHistory.push({ scale: currentScale, time: seconds }); // Store the practice data
    console.log("Practice history: ", practiceHistory); // Log the practice history
}

function updateScaleDisplay() { // Updates the scale display based on the selected scale
    currentScale = scaleSelect.value;
    const notes = scales[currentScale];
    scaleDisplay.innerHTML = " <strong>" + currentScale + "</strong><br>Notes: " + notes.join(" ");
}

async function requestMicrophone() { // Requests microphone access from the user and waits until the user grants or denies access
    try {
        microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(microphoneStream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048; // Set the FFT size for frequency analysis
        source.connect(analyser);
        pitchDetector = PitchDetector.forFloat32Array(analyser.fftSize); // Initialize the pitch detector with the FFT size
        monitorMicrophone(); // Start monitoring the microphone after access is granted
        console.log("Microphone access granted");
        // You can now use the stream for audio processing
        return true;
    } catch (err) {
        console.error("Microphone access denied", err);
        alert("Microphone access is required to practice. Please allow microphone access.");
        return false;
    }
}

function monitorMicrophone() {
    if (!analyser) return; // If the analyser is not set up, exit the function
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    let total = 0;

    for (let i = 0; i < bufferLength; i++) {
        total += Math.abs(dataArray[i] - 128); // Calculate the deviation from the center value (128)
    }

    const average = Math.round(total / dataArray.length);
    soundLevel.innerHTML = "Sound Level: " + average; // Display the average sound level

    detectFrequency(); // Call the frequency detection function
    requestAnimationFrame(monitorMicrophone); // Continue monitoring the microphone
}

function detectFrequency() {
    if (!pitchDetector || !analyser) return; // If the pitch detector or analyser is not set up, exit the function
    const input = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(input);
    const [frequency, clarity] = pitchDetector.findPitch(input, audioContext.sampleRate);
    
    if (clarity > 0.9) { // Only display frequency if clarity is above a certain threshold
        const detectedNote = frequencyToNote(frequency);
        frequencyDisplay.innerHTML = "Frequency: " + Math.round(frequency) + " Hz | Note: " + detectedNote.fullName; // Display the detected frequency and corresponding note
    }
}

function frequencyToNote(frequency) {
    const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const A4 = 440; // Frequency of A4
    const semitones = 12 * (Math.log2(frequency / A4));
    const noteIndex = Math.round(semitones) + 69;
    const note = noteStrings[noteIndex % 12];
    const octave = Math.floor(noteIndex / 12) - 1;
    return {note: note, octave: octave, fullName: note + octave}; // Return an object containing the note and its octave for more detailed information
}

function normalizeNote(note) { // Changes the note to a standard format for comparison (e.g., "C#" instead of "Db")
    const flatToSharp = {"Bb": "A#", "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#"};
    return flatToSharp[note] || note;
}

updateScaleDisplay(); // Initial call to display the default scale when the page loads
