const scaleSelect = document.getElementById('scaleSelect');
const startButton = document.getElementById('startButton');
const scaleDisplay = document.getElementById('scaleDisplay');
const status = document.getElementById('status');
const timerDisplay = document.getElementById('timer');
const soundLevel = document.getElementById('soundLevel');
const frequencyDisplay = document.getElementById('frequency'); // New element to display frequency
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
function startPractice() {
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
        source.connect(analyser);
        monitorMicrophone(); // Start monitoring the microphone after access is granted
        console.log("Microphone access granted");
        // You can now use the stream for audio processing
    } catch (err) {
        console.error("Microphone access denied", err);
        alert("Microphone access is required to practice. Please allow microphone access.");
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
    if (!analyser) return; // If the analyser is not set up, exit the function

    const bufferLength = analyser.fftSize;
    const dataArray = new Float32Array(bufferLength);
    analyser.getFloatTimeDomainData(dataArray);
    
    const autoCorrelate = autoCorrelatePitch(dataArray, audioContext.sampleRate);
    if (autoCorrelate !== -1) {
        frequencyDisplay.innerHTML = "Frequency: " + Math.round(autoCorrelate) + " Hz"; // Display the detected frequency
}

updateScaleDisplay(); // Initial call to display the default scale when the page loads
}