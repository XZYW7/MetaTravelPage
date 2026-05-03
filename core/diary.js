// ========== DIARY ==========
// Diary management component

let globalDiaryEditor = null;
let globalDiaryDate = null;
let diaryDates = new Set();

async function initDiary() {
  await loadAllDiaries();
}

async function loadAllDiaries() {
  try {
    const storage = getStorageAdapter();
    const files = await storage.listDiaries();
    files.forEach(f => diaryDates.add(f));
    restoreDiaries();
  } catch (error) {
    console.error('Failed to load diaries:', error);
  }
}

function restoreDiaries() {
  const cards = getCards();
  cards.forEach((card) => {
    const date = card.dataset.date;
    if (date && diaryDates.has(date)) {
      injectDiaryToCard(card, date);
    }
  });
}

function openGlobalDiary(date) {
  globalDiaryDate = date;
  const modal = document.getElementById('globalDiaryModal');
  document.getElementById('globalDiaryTitle').textContent = '📝 ' + date;
  modal.classList.add('open');

  const storage = getStorageAdapter();
  storage.getDiary(date).then(data => {
    const container = document.getElementById('globalDiaryEditor');
    container.innerHTML = '';
    const editorDiv = document.createElement('div');
    container.appendChild(editorDiv);

    if (globalDiaryEditor) {
      globalDiaryEditor = null;
    }

    globalDiaryEditor = new Quill(editorDiv, {
      theme: 'snow',
      placeholder: 'Write your diary...',
      modules: {
        toolbar: {
          container: [
            ['bold', 'italic', 'underline'],
            [{ 'header': [2, 3, false] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['image'],
            ['clean']
          ],
          handlers: {
            image: function() {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              input.style.display = 'none';
              document.body.appendChild(input);
              input.click();

              input.onchange = () => {
                const file = input.files[0];
                document.body.removeChild(input);
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const base64Image = e.target.result;
                    storage.uploadImage(base64Image).then(resData => {
                      if (resData.ok && resData.url) {
                        const range = globalDiaryEditor.getSelection(true);
                        globalDiaryEditor.insertEmbed(range.index, 'image', resData.url);
                        globalDiaryEditor.setSelection(range.index + 1);
                      } else {
                        alert('Upload failed: ' + (resData.error || 'Unknown error'));
                      }
                    }).catch(err => {
                      console.error(err);
                      alert('Image upload request failed');
                    });
                  };
                  reader.readAsDataURL(file);
                }
              };
            }
          }
        }
      }
    });

    if (data.content) {
      globalDiaryEditor.root.innerHTML = data.content;
    }
  });
}

function closeGlobalDiary() {
  document.getElementById('globalDiaryModal').classList.remove('open');
  globalDiaryEditor = null;
  globalDiaryDate = null;
}

async function saveGlobalDiary() {
  if (!globalDiaryEditor || !globalDiaryDate) return;
  const content = globalDiaryEditor.root.innerHTML;
  const plainText = globalDiaryEditor.getText().trim();
  if (!plainText) return;

  try {
    const storage = getStorageAdapter();
    const data = await storage.saveDiary(globalDiaryDate, content);
    if (data.ok) {
      const savedDate = globalDiaryDate;
      diaryDates.add(savedDate);
      document.getElementById('globalSavedMsg').classList.add('show');
      setTimeout(() => {
        document.getElementById('globalSavedMsg').classList.remove('show');
      }, 2000);
      closeGlobalDiary();
      viewDiary(savedDate);
    }
  } catch (error) {
    console.error('Failed to save diary:', error);
  }
}

function parseDateForSort(dateStr, isDiary = false) {
  // Try to parse dates like "6月15日", "2026年6月15日", "Day 1", etc.
  let base = 50000;
  
  const monthDayMatch = dateStr.match(/(\d+)月(\d+)日/);
  if (monthDayMatch) {
    base = parseInt(monthDayMatch[1]) * 100 + parseInt(monthDayMatch[2]);
  }
  
  const fullDateMatch = dateStr.match(/(\d+)年(\d+)月(\d+)日/);
  if (fullDateMatch) {
    base = parseInt(fullDateMatch[2]) * 100 + parseInt(fullDateMatch[3]);
  }
  
  const dayMatch = dateStr.match(/Day\s*(\d+)/i);
  if (dayMatch) {
    base = 50000 + parseInt(dayMatch[1]);
  }
  
  // Diary cards get +1 to sort after same-day trip cards
  return isDiary ? base * 10 + 1 : base * 10;
}

function sortCards() {
  const track = document.getElementById('track');
  const cards = Array.from(track.querySelectorAll('.card'));
  
  cards.sort((a, b) => {
    const aIndex = parseInt(a.dataset.sortIndex) || 999999;
    const bIndex = parseInt(b.dataset.sortIndex) || 999999;
    return aIndex - bIndex;
  });
  
  cards.forEach(card => track.appendChild(card));
}

function createDiaryCard(date, content) {
  const cards = getCards();
  const existingDates = new Set(cards.map(c => c.dataset.date).filter(Boolean));
  if (existingDates.has(date)) return;

  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.date = date;
  card.dataset.sortIndex = parseDateForSort(date, true);
  card.innerHTML = `
    <div class="card-header">
      <div class="card-date">${date}</div>
      <div class="card-title">日记</div>
      <div class="card-subtitle">个人记录</div>
    </div>
    <div class="diary-section">
      <div class="diary-section-header">📔 日记</div>
      <div class="diary-content">${content}</div>
    </div>
  `;

  document.getElementById('track').appendChild(card);
  sortCards();
  updateView();
}

function openDiaryEditor(date) {
  const cards = getCards();
  let idx = current;
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].dataset.date === date) { idx = i; break; }
  }
  current = idx;
  updateView();
  openGlobalDiary(date);
}

function viewDiary(date) {
  const cards = getCards();
  let idx = current;
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].dataset.date === date) { idx = i; break; }
  }

  const existingDates = new Set(cards.map(c => c.dataset.date).filter(Boolean));
  current = idx;
  updateView();

  if (existingDates.has(date)) {
    injectDiaryToCard(cards[idx], date);
  } else {
    const storage = getStorageAdapter();
    storage.getDiary(date).then(data => {
      if (data.content) {
        createDiaryCard(date, data.content);
      }
    });
  }
}

function injectDiaryToCard(cardOrIdx, date) {
  const cards = getCards();
  let card = typeof cardOrIdx === 'number' ? cards[cardOrIdx] : cardOrIdx;
  if (!card || card.dataset.date !== date) {
    card = cards.find(c => c.dataset.date === date);
  }
  if (!card) return;
  
  let diarySection = card.querySelector('.diary-section');
  if (diarySection) {
    const existingHeader = diarySection.querySelector('.diary-section-header');
    if (existingHeader) existingHeader.remove();
    const existingContent = diarySection.querySelector('.diary-content');
    if (existingContent) existingContent.remove();
  } else {
    diarySection = document.createElement('div');
    diarySection.className = 'diary-section';
    card.appendChild(diarySection);
  }
  
  const header = document.createElement('div');
  header.className = 'diary-section-header';
  header.textContent = '📔 Diary';
  
  const diaryDiv = document.createElement('div');
  diaryDiv.className = 'diary-content';
  diarySection.appendChild(header);
  diarySection.appendChild(diaryDiv);
  
  const storage = getStorageAdapter();
  storage.getDiary(date).then(data => {
    diaryDiv.innerHTML = data.content || '<p style="color:var(--text-dim)">No diary yet</p>';
  });
}
