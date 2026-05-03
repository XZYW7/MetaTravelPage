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
    const cardDate = card.dataset.date;
    if (!cardDate) return;
    for (const diaryDate of diaryDates) {
      if (datesMatch(cardDate, diaryDate)) {
        injectDiaryToCard(card, diaryDate);
        break;
      }
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
      placeholder: '记录今天发生的事...',
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
  if (!dateStr) return 500000;
  
  let base = 50000;
  
  // Parse "2026年5月3日" format
  const fullMatch = dateStr.match(/(\d+)年(\d+)月(\d+)日/);
  if (fullMatch) {
    base = parseInt(fullMatch[2]) * 100 + parseInt(fullMatch[3]);
    return isDiary ? base * 10 + 1 : base * 10;
  }
  
  // Parse "5月3日" or "6月15日 · 第1天" format
  const monthDayMatch = dateStr.match(/(\d+)月(\d+)日/);
  if (monthDayMatch) {
    base = parseInt(monthDayMatch[1]) * 100 + parseInt(monthDayMatch[2]);
    return isDiary ? base * 10 + 1 : base * 10;
  }
  
  return 500000;
}

function extractDateKey(dateStr) {
  if (!dateStr) return '';
  const match = dateStr.match(/(\d+)月(\d+)日/);
  if (match) return match[1] + '月' + match[2] + '日';
  return dateStr;
}

function datesMatch(date1, date2) {
  if (!date1 || !date2) return false;
  return extractDateKey(date1) === extractDateKey(date2);
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
  const existingCard = cards.find(c => datesMatch(c.dataset.date, date));
  if (existingCard) return;

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
    if (datesMatch(cards[i].dataset.date, date)) { idx = i; break; }
  }
  current = idx;
  updateView();
  openGlobalDiary(date);
}

function viewDiary(date) {
  const cards = getCards();
  let idx = current;
  for (let i = 0; i < cards.length; i++) {
    if (datesMatch(cards[i].dataset.date, date)) { idx = i; break; }
  }

  current = idx;
  updateView();

  const existingCard = cards.find(c => datesMatch(c.dataset.date, date));
  if (existingCard) {
    injectDiaryToCard(existingCard, date);
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
  if (!card || !datesMatch(card.dataset.date, date)) {
    card = cards.find(c => datesMatch(c.dataset.date, date));
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
  header.textContent = '📔 日记';
  
  const diaryDiv = document.createElement('div');
  diaryDiv.className = 'diary-content';
  diarySection.appendChild(header);
  diarySection.appendChild(diaryDiv);
  
  const storage = getStorageAdapter();
  storage.getDiary(date).then(data => {
    diaryDiv.innerHTML = data.content || '<p style="color:var(--text-dim)">暂无日记</p>';
  });
}
