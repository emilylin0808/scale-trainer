const scaleSelect = document.getElementById('scaleSelect');
const startButton = document.getElementById('startButton');
const scaleDisplay = document.getElementById('scaleDisplay');

console.log("Scale Trainer loaded"); // Debugging statement to make sure JavaScript is connected to the HTML file

startButton.addEventListener('click', function() {
    //console.log("Start button clicked"); // Debugging statement to make sure the button click is being detected
    const selectedScale = scaleSelect.value;
    console.log(selectedScale);
});