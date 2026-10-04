const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value;
  const team = teamSelect.value;

  console.log(name, team);
});
