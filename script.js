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

startButton.addEventListener('click', function() {
    //console.log("Start button clicked"); // Debugging statement to make sure the button click is being detected
    const selectedScale = scaleSelect.value;
    const notes = scales[selectedScale];
    //console.log(selectedScale); // Making sure the selected scale is being logged correctly
    scaleDisplay.innerHTML = "Now practicing: " + selectedScale + "<br>Notes: " + notes.join(" ");
});