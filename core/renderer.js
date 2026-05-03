// ========== RENDERER ==========
// Core rendering engine that reads journey.json and generates card DOM

let journeyConfig = null;

async function initApp() {
  try {
    const response = await fetch('config/journey.json');
    journeyConfig = await response.json();
    
    // Apply theme
    applyTheme(journeyConfig.app.theme);
    
    // Update page title
    document.title = journeyConfig.app.title;
    
    // Render cards
    renderCards(journeyConfig.cards);
    
    // Initialize features
    initFeatures(journeyConfig.features);
    
    // Initialize swipe
    setupSwipe();
    setupKeyboard();
    setupPageSelector();
    
    // Initialize diary if enabled
    if (journeyConfig.features?.diary?.enabled) {
      await initDiary();
    }
    
    // Initialize timer if enabled
    if (journeyConfig.features?.timer?.enabled) {
      initTimer(journeyConfig.features.timer);
    }
    
    // Initialize phrasebook if enabled
    if (journeyConfig.features?.phrasebook?.enabled) {
      initPhrasebook(journeyConfig.features.phrasebook);
    }
    
    // Update view
    updateView();
    
  } catch (error) {
    console.error('Failed to load journey config:', error);
    document.getElementById('track').innerHTML = `
      <div class="card" style="display:flex;align-items:center;justify-content:center;">
        <div style="text-align:center;color:var(--text-dim);">
          <p style="font-size:48px;margin-bottom:16px;">⚠️</p>
          <p style="font-size:18px;margin-bottom:8px;">Failed to load configuration</p>
          <p style="font-size:14px;">Please check config/journey.json</p>
        </div>
      </div>
    `;
  }
}

function applyTheme(theme) {
  if (!theme) return;
  
  const root = document.documentElement;
  if (theme.primary) {
    root.style.setProperty('--accent', theme.primary);
  }
  if (theme.secondary) {
    root.style.setProperty('--accent-light', theme.secondary);
  }
}

function parseDateForSort(dateStr) {
  if (!dateStr) return 500000;
  
  // Parse dates like "6月15日", "2026年6月15日", "6月15日 · 第1天"
  const monthDayMatch = dateStr.match(/(\d+)月(\d+)日/);
  if (monthDayMatch) {
    return (parseInt(monthDayMatch[1]) * 100 + parseInt(monthDayMatch[2])) * 10;
  }
  
  // Parse "Day X" format
  const dayMatch = dateStr.match(/Day\s*(\d+)/i);
  if (dayMatch) {
    return (50000 + parseInt(dayMatch[1])) * 10;
  }
  
  return 500000;
}

function renderCards(cards) {
  const track = document.getElementById('track');
  track.innerHTML = '';
  
  // Process cards: auto-assign sort_index based on date if not set
  const processedCards = cards.map(card => {
    const processed = { ...card };
    if (processed.sort_index === undefined && processed.date) {
      processed.sort_index = parseDateForSort(processed.date);
    }
    return processed;
  });
  
  // Sort cards by sort_index
  const sortedCards = processedCards.sort((a, b) => {
    const aIndex = a.sort_index ?? 50000000;
    const bIndex = b.sort_index ?? 50000000;
    return aIndex - bIndex;
  });
  
  sortedCards.forEach(card => {
    const cardElement = createCardElement(card);
    track.appendChild(cardElement);
  });
}

function createCardElement(card) {
  switch (card.type) {
    case 'cover':
      return createCoverCard(card);
    case 'standard':
    case 'reference':
      return createStandardCard(card);
    default:
      return createStandardCard(card);
  }
}

function createCoverCard(card) {
  const div = document.createElement('div');
  div.className = 'card cover';
  div.dataset.cardId = card.id;
  if (card.sort_index !== undefined) {
    div.dataset.sortIndex = card.sort_index;
  }
  
  let downloadHtml = '';
  if (card.download_link) {
    downloadHtml = `
      <a href="${card.download_link.url}" download 
         style="color: #fff; text-decoration: none; background: linear-gradient(135deg, var(--accent), var(--accent-light)); 
                padding: 10px 20px; border-radius: 25px; font-size: 15px; font-weight: 600; 
                display: inline-block; margin-top: 15px; box-shadow: 0 4px 12px rgba(91,192,235,0.4); border: none;">
        ${card.download_link.text}
      </a>
    `;
  }
  
  div.innerHTML = `
    <div class="cover-icon">${card.icon || '📱'}</div>
    <div class="cover-title">${card.title}</div>
    <div class="cover-subtitle">
      ${card.subtitle || ''}
      ${card.date_range ? `<br>${card.date_range}` : ''}
      ${downloadHtml}
    </div>
    <div class="cover-hint">← Swipe to navigate →</div>
  `;
  
  return div;
}

function createStandardCard(card) {
  const div = document.createElement('div');
  div.className = 'card';
  div.dataset.cardId = card.id;
  if (card.sort_index !== undefined) {
    div.dataset.sortIndex = card.sort_index;
  }
  if (card.date) {
    div.dataset.date = card.date;
  }
  
  let sectionsHtml = '';
  if (card.sections) {
    sectionsHtml = card.sections.map(section => renderSection(section)).join('');
  }
  
  div.innerHTML = `
    <div class="card-header">
      <div class="card-date">${card.date || ''}</div>
      <div class="card-title">${card.title}</div>
      <div class="card-subtitle">${card.subtitle || ''}</div>
    </div>
    ${sectionsHtml}
  `;
  
  return div;
}

function renderSection(section) {
  switch (section.type) {
    case 'timeline':
      return renderTimeline(section);
    case 'table':
      return renderTable(section);
    case 'info_box':
      return renderInfoBox(section);
    case 'checklist':
      return renderChecklist(section);
    case 'expandable':
      return renderExpandable(section);
    case 'phrasebook':
      return renderPhrasebook(section);
    default:
      return '';
  }
}

function renderTimeline(section) {
  const itemsHtml = section.items.map(item => `
    <div class="timeline-item ${item.variant || ''}">
      <div class="timeline-time">${item.time}</div>
      <div class="timeline-content">${item.content}</div>
    </div>
  `).join('');
  
  return `
    <div class="section">
      ${section.title ? `<div class="section-title">${section.title}</div>` : ''}
      <div class="timeline">${itemsHtml}</div>
    </div>
  `;
}

function renderTable(section) {
  const headersHtml = section.headers.map(h => `<th>${h}</th>`).join('');
  const rowsHtml = section.rows.map(row => `
    <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
  `).join('');
  
  return `
    <div class="section">
      ${section.title ? `<div class="section-title">${section.title}</div>` : ''}
      <div class="table-wrap">
        <table>
          <tr>${headersHtml}</tr>
          ${rowsHtml}
        </table>
      </div>
    </div>
  `;
}

function renderInfoBox(section) {
  return `
    <div class="info-box ${section.variant || ''}">
      ${section.title ? `<div class="info-box-title">${section.title}</div>` : ''}
      <div class="info-box-content">${section.content}</div>
    </div>
  `;
}

function renderChecklist(section) {
  const itemsHtml = section.items.map(item => `<li>${item}</li>`).join('');
  
  return `
    <div class="section">
      ${section.title ? `<div class="section-title">${section.title}</div>` : ''}
      <ul class="check-list">${itemsHtml}</ul>
    </div>
  `;
}

function renderExpandable(section) {
  return `
    <div class="expandable" onclick="toggleExpand(this)">
      <div class="expandable-header">${section.title}</div>
      <div class="expandable-body">
        <div class="expandable-content">${section.content}</div>
      </div>
    </div>
  `;
}

function renderPhrasebook(section) {
  const phrasesHtml = section.phrases.map(phrase => `
    <tr onclick="speakPhrase('${phrase.id}')" style="cursor:pointer">
      <td>${phrase['中文']}</td>
      <td>${phrase['外语']} <span class="phrasebook-audio-icon">🔊</span></td>
      <td>${phrase['发音'] || ''}</td>
    </tr>
  `).join('');
  
  return `
    <div class="section">
      ${section.title ? `<div class="section-title">${section.title}</div>` : ''}
      <div class="table-wrap">
        <table class="phrasebook-table">
          <tr><th>中文</th><th>外语</th><th>发音</th></tr>
          ${phrasesHtml}
        </table>
      </div>
    </div>
  `;
}

function initFeatures(features) {
  if (!features) return;
  
  // Show/hide timer FAB
  const timerFab = document.getElementById('timerFab');
  if (timerFab) {
    timerFab.style.display = features.timer?.enabled ? 'flex' : 'none';
  }
  
  // Show/hide diary button
  const diaryBtn = document.getElementById('diaryBtn');
  if (diaryBtn) {
    diaryBtn.style.display = features.diary?.enabled ? 'block' : 'none';
  }
}

function toggleExpand(el) {
  el.classList.toggle('open');
}
