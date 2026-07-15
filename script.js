const scaleSelect = document.getElementById('scaleSelect');
const startButton = document.getElementById('startButton');
const scaleDisplay = document.getElementById('scaleDisplay');
const statusDisplay = document.getElementById('status');
const timerDisplay = document.getElementById('timer');

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

// ----------------------------------------------Event Listeners------------------------------------------------------------------
startButton.addEventListener('click', function() { // Starts or stops the practice session when the button is clicked
    //console.log("Start button clicked"); // Debugging statement to make sure the button click is being detected
    currentScale = scaleSelect.value;
    const notes = scales[currentScale];
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
    status.innerHTML = "Practice finished.";
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
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log(stream); // Log the stream to make sure the microphone access is working
}
updateScaleDisplay(); // Initial call to display the default scale when the page loads