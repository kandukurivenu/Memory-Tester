const sections = document.querySelectorAll('.section');
const startBtn = document.getElementById('start-btn');
const memoryInput = document.getElementById('memory-input');
const messageSelect = document.getElementById('message-select');
const submitBtn = document.getElementById('submit-btn');
const recallInput = document.getElementById('recall-input');
const recallSubmitBtn = document.getElementById('recall-submit-btn');
const originalNote = document.getElementById('original-note');
const recallNote = document.getElementById('recall-note');
const scoreCircle = document.getElementById('score-circle');
const feedback = document.getElementById('feedback');
const progressBar = document.getElementById('progress-bar');
const tryAgainBtn = document.getElementById('try-again-btn');
const viewLeaderboard = document.getElementById('view-leaderboard');
const leaderboardList = document.getElementById('leaderboard-list');
const backToHome = document.getElementById('back-to-home');
const countdownTimer = document.getElementById('countdown-timer');

let userNote = '';
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Start Challenge
startBtn.addEventListener('click', () => {
  switchSection('input-section');
});

// Submit Memory Input
submitBtn.addEventListener('click', () => {
  userNote = memoryInput.value.trim() || messageSelect.value; // Use custom message or pre-written message
  if (userNote) {
    memoryInput.style.opacity = '0'; // Fade out the input
    setTimeout(() => {
      switchSection('distraction-mode'); // Move to Distraction Mode
      startDistractionPhase(userNote); // Start the distraction phase with dynamic timer
    }, 500); // Delay for smooth transition
  } else {
    alert('Please enter or select a message to remember!');
  }
});

// Start Distraction Phase with Dynamic Timer
function startDistractionPhase(note) {
  const wordCount = note.split(' ').length;
  let timerDuration;

  // Set timer based on word count
  if (wordCount <= 5) {
    timerDuration = 10; // 10 seconds for short sentences
  } else if (wordCount <= 10) {
    timerDuration = 15; // 15 seconds for medium sentences
  } else {
    timerDuration = 20; // 20 seconds for long sentences
  }

  let timeLeft = timerDuration;
  countdownTimer.textContent = timeLeft;

  const countdown = setInterval(() => {
    timeLeft--;
    countdownTimer.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      switchSection('recall-section'); // Move to Recall Section after timer ends
    }
  }, 1000); // Update every second
}

// Submit Recall
recallSubmitBtn.addEventListener('click', () => {
  const recallText = recallInput.value.trim();
  if (recallText) {
    const similarity = compareNotes(userNote, recallText);
    updateLeaderboard(similarity);
    switchSection('result-section');
  } else {
    alert('Please type your recall attempt!');
  }
});

// Compare Notes and Calculate Score
function compareNotes(original, recall) {
  originalNote.textContent = `Original Note: ${original}`;
  recallNote.textContent = `Your Recall: ${recall}`;

  const similarity = calculateSimilarity(original, recall);
  scoreCircle.textContent = `${similarity}%`;
  scoreCircle.style.background = `conic-gradient(#ff6f61 0%, #ff6f61 ${similarity}%, #ccc ${similarity}% 100%)`;

  if (similarity >= 90) {
    feedback.textContent = 'Impressive! Your memory is razor-sharp.';
  } else if (similarity >= 60) {
    feedback.textContent = 'Pretty good! Keep training your brain.';
  } else {
    feedback.textContent = 'No worries! Try again and improve.';
  }

  return similarity;
}

// Calculate Similarity (Basic Implementation)
function calculateSimilarity(str1, str2) {
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  const matches = words1.filter(word => words2.includes(word)).length;
  return Math.round((matches / words1.length) * 100);
}

// Update Leaderboard
function updateLeaderboard(score) {
  leaderboard.push(score);
  leaderboard.sort((a, b) => b - a);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  renderLeaderboard();
}

// Render Leaderboard
function renderLeaderboard() {
  leaderboardList.innerHTML = leaderboard
    .map((score, index) => `<li>${index + 1}. ${score}%</li>`)
    .join('');
}

// Switch Sections
function switchSection(sectionId) {
  sections.forEach(section => section.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

// Event Listeners
tryAgainBtn.addEventListener('click', () => {
  switchSection('input-section');
  memoryInput.value = '';
  recallInput.value = '';
  memoryInput.style.opacity = '1';
});

viewLeaderboard.addEventListener('click', () => {
  switchSection('leaderboard-section');
});

backToHome.addEventListener('click', () => {
  switchSection('landing');
});

// Progress Bar Animation
memoryInput.addEventListener('input', () => {
  const progress = (memoryInput.value.length / 100) * 100;
  progressBar.style.width = `${progress}%`;
});