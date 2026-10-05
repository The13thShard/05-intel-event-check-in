// DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Attendance elements
let count = 0;
const maxCount = 40;

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  // Count incrementor
  count++
  console.log("Total check-ins: ", count);

  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log("Progress: ", `${percentage}`);

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  const current = parseInt(teamCounter.textContent);
  teamCounter.textContent = current + 1;
  console.log("Previous team count: ", current);

  const newTotal = current + 1;
  console.log("New team count: ", newTotal);
  
  const message = "Welcome " + name + " from " + teamName + "! You are attendee number " + count + ".";
  form.reset();
});
