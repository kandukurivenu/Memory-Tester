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
startBtn.addEventListener('click', () => {
  switchSection('input-section');
});
submitBtn.addEventListener('click', () => {
  userNote = memoryInput.value.trim() || messageSelect.value;
  if (userNote) {
    memoryInput.style.opacity = '0'; 
    setTimeout(() => {
      switchSection('distraction-mode'); 
      startDistractionPhase(userNote); 
    }, 500); // Delay for smooth transition
  } else {
    alert('Please enter or select a message to remember!');
  }
});

function startDistractionPhase(note) {
  const wordCount = note.split(' ').length;
  let timerDuration;
  if (wordCount <= 5) {
    timerDuration = 10; 
  } else if (wordCount <= 10) {
    timerDuration = 15; 
  } else {
    timerDuration = 20; 
  }

  let timeLeft = timerDuration;
  countdownTimer.textContent = timeLeft;

  const countdown = setInterval(() => {
    timeLeft--;
    countdownTimer.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      switchSection('recall-section'); 
    }
  }, 1000); 
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

function calculateSimilarity(str1, str2) {
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  const matches = words1.filter(word => words2.includes(word)).length;
  return Math.round((matches / words1.length) * 100);
}
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
function switchSection(sectionId) {
  sections.forEach(section => section.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}
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
memoryInput.addEventListener('input', () => {
  const progress = (memoryInput.value.length / 100) * 100;
  progressBar.style.width = `${progress}%`;
});
