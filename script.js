// DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const teamIds = ["water", "zero", "power"];
const storageKey = "intelEventCheckInProgress";
const teamAttendees = {
  water: [],
  zero: [],
  power: []
};

// Attendance elements
let count = 0;
const maxCount = 50;
let confettiShown = false;

function updateProgressDisplay() {
  const percentage = Math.min(Math.round((count / maxCount) * 100), 100) + "%";
  attendeeCount.textContent = count;
  progressBar.style.width = percentage;
}

function loadProgress() {
  let savedProgress;

  try {
    savedProgress = localStorage.getItem(storageKey);
  } catch (error) {
    console.error("Unable to load saved check-in progress.", error);
    return;
  }

  if (savedProgress === null) {
    return;
  }

  let progress;

  try {
    progress = JSON.parse(savedProgress);
  } catch (error) {
    console.error("Saved check-in progress is not valid JSON.", error);
    return;
  }

  if (
    !progress ||
    !Number.isSafeInteger(progress.count) ||
    progress.count < 0 ||
    !progress.teamCounts
  ) {
    console.error("Saved check-in progress has an invalid format.");
    return;
  }

  for (let i = 0; i < teamIds.length; i++) {
    const teamId = teamIds[i];
    const teamCount = progress.teamCounts[teamId];
    const attendees = progress.teamAttendees
      ? progress.teamAttendees[teamId]
      : [];

    if (
      !Number.isSafeInteger(teamCount) ||
      teamCount < 0 ||
      !Array.isArray(attendees) ||
      !attendees.every(function (name) {
        return typeof name === "string";
      })
    ) {
      console.error(`Saved check-in count for ${teamId} is invalid.`);
      return;
    }
  }

  count = progress.count;
  for (let i = 0; i < teamIds.length; i++) {
    const teamId = teamIds[i];
    const teamCounter = document.getElementById(teamId + "Count");
    teamCounter.textContent = progress.teamCounts[teamId];
    teamAttendees[teamId] = progress.teamAttendees
      ? progress.teamAttendees[teamId]
      : [];
    renderTeamAttendees(teamId);
  }

  confettiShown = count >= maxCount;
  updateProgressDisplay();
}

function renderTeamAttendees(teamId) {
  const attendeeList = document.getElementById(teamId + "Attendees");
  attendeeList.textContent = "";

  for (let i = 0; i < teamAttendees[teamId].length; i++) {
    const attendee = document.createElement("li");
    attendee.textContent = teamAttendees[teamId][i];
    attendeeList.appendChild(attendee);
  }
}

function saveProgress() {
  const teamCounts = {};

  for (let i = 0; i < teamIds.length; i++) {
    const teamId = teamIds[i];
    const teamCounter = document.getElementById(teamId + "Count");
    teamCounts[teamId] = Number(teamCounter.textContent);
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify({
      count: count,
      teamCounts: teamCounts,
      teamAttendees: teamAttendees
    }));
  } catch (error) {
    console.error("Unable to save check-in progress.", error);
  }
}

function showConfetti() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const pieces = [];
  const colors = ["#0071c5", "#00aeef", "#ffd166", "#06d6a0", "#ef476f"];
  const endTime = Date.now() + 3000;

  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "1000";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height,
      speed: Math.random() * 5 + 2,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360
    });
  }

  function animateConfetti() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      piece.y += piece.speed;
      piece.rotation += 5;

      context.save();
      context.translate(piece.x, piece.y);
      context.rotate((piece.rotation * Math.PI) / 180);
      context.fillStyle = piece.color;
      context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
      context.restore();
    }

    if (Date.now() < endTime) {
      requestAnimationFrame(animateConfetti);
    } else {
      canvas.remove();
    }
  }

  animateConfetti();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  // Count incrementor
  count++;
  console.log("Total check-ins: ", count);

  // Update progress bar
  updateProgressDisplay();
  const percentage = progressBar.style.width;
  console.log("Progress: ", `${percentage}`);

  if (count >= maxCount && !confettiShown) {
    confettiShown = true;
    showConfetti();
  }

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  const current = parseInt(teamCounter.textContent);
  teamCounter.textContent = current + 1;
  console.log("Previous team count: ", current);

  const newTotal = current + 1;
  console.log("New team count: ", newTotal);
  teamAttendees[team].push(name);
  renderTeamAttendees(team);
  saveProgress();
  
  greeting.textContent = `Welcome ${name} from ${teamName}! You are attendee number ${count}.`;
  greeting.classList.add("success-message");
  greeting.style.display = "block";
  form.reset();
});

loadProgress();
