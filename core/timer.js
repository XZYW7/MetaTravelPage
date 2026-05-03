// ========== TIMER ==========
// Timer/countdown plugin

let timerInterval = null;
let timerSeconds = 30 * 60;
let timerRunning = false;
let lastPreset = 30 * 60;

function initTimer(config) {
  if (!config) return;
  
  // Set initial preset
  if (config.presets && config.presets.length > 0) {
    lastPreset = config.presets[0] * 60;
    timerSeconds = lastPreset;
  }
  
  // Update label
  const title = document.getElementById('timerTitle');
  if (title) {
    title.textContent = '⏱️ ' + (config.label || 'Timer');
  }
  
  // Generate presets
  const presetsContainer = document.getElementById('timerPresets');
  if (presetsContainer && config.presets) {
    presetsContainer.innerHTML = config.presets.map(minutes => `
      <div class="timer-preset" onclick="setTimer(${minutes})">${minutes} min</div>
    `).join('');
  }
  
  // Update hint
  const hint = document.getElementById('timerHint');
  if (hint) {
    hint.innerHTML = '<b>💡 Tip:</b> Use the timer for your activities.';
  }
  
  // Update display
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const min = Math.floor(timerSeconds / 60);
  const sec = timerSeconds % 60;
  const display = document.getElementById('timerDisplay');
  if (display) {
    display.textContent = String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
  }
}

function openTimerModal() {
  document.getElementById('timerModal').classList.add('open');
  updateTimerDisplay();
}

function closeTimerModal() {
  document.getElementById('timerModal').classList.remove('open');
}

function startTimer() {
  if (timerRunning || timerSeconds <= 0) return;
  timerRunning = true;
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      timerRunning = false;
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([200, 100, 200, 100, 500]);
      }
      alert('⏱️ Time is up!');
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
}

function resetTimer() {
  pauseTimer();
  timerSeconds = lastPreset;
  updateTimerDisplay();
}

function setTimer(minutes) {
  pauseTimer();
  lastPreset = minutes * 60;
  timerSeconds = lastPreset;
  updateTimerDisplay();
}
