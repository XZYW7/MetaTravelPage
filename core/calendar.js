// ========== CALENDAR ==========
// Calendar component for date selection

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];

let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();
let calSelectedDay = null;

function openCalendar() {
  calSelectedDay = null;
  document.getElementById('calConfirm').disabled = true;
  renderCalendar();
  document.getElementById('calModal').classList.add('open');
}

function closeCalendar() {
  document.getElementById('calModal').classList.remove('open');
}

function calNav(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
}

function renderCalendar() {
  document.getElementById('calTitle').textContent = calYear + ' ' + MONTHS[calMonth];
  const grid = document.getElementById('calGrid');
  const oldDays = grid.querySelectorAll('.cal-day');
  oldDays.forEach(d => d.remove());

  const firstDay = new Date(calYear, calMonth, 1);
  const lastDay = new Date(calYear, calMonth + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // Mon=0
  const totalDays = lastDay.getDate();
  const today = new Date();

  for (let d = 1; d <= totalDays; d++) {
    const btn = document.createElement('button');
    btn.className = 'cal-day';
    btn.textContent = d;

    const dateStr = calYear + ' ' + MONTHS[calMonth] + ' ' + d;
    btn.dataset.date = dateStr;

    if (calYear === today.getFullYear() && calMonth === today.getMonth() && d === today.getDate()) {
      btn.classList.add('today');
    }

    btn.onclick = () => selectDay(btn, dateStr);
    grid.appendChild(btn);
  }
}

function selectDay(btn, dateStr) {
  document.querySelectorAll('.cal-day.selected').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  calSelectedDay = dateStr;
  document.getElementById('calConfirm').disabled = false;
}

function confirmDate() {
  if (!calSelectedDay) return;
  closeCalendar();
  openDiaryEditor(calSelectedDay);
}
