// ========== SWIPE ==========
// Card swipe navigation logic

let current = 0;
let startX = 0, startY = 0;
let isDragging = false, isScrolling = false;

function getCards() {
  return Array.from(document.querySelectorAll('.card'));
}

function getTotalCards() {
  return getCards().length;
}

function updateView() {
  const track = document.getElementById('track');
  const cards = getCards();
  const totalCards = cards.length;
  
  track.style.transform = 'translateX(-' + (current * 100) + '%)';
  document.getElementById('navCounter').textContent = (current + 1) + ' / ' + totalCards;
  document.getElementById('prevBtn').disabled = current === 0;
  document.getElementById('nextBtn').disabled = current === totalCards - 1;
  document.getElementById('progressFill').style.width = ((current + 1) / totalCards * 100) + '%';
  
  if (cards[current]) {
    cards[current].scrollTop = 0;
  }
}

function goPrev() {
  if (current > 0) {
    current--;
    updateView();
    updatePopupArrows();
  }
}

function goNext() {
  if (current < getTotalCards() - 1) {
    current++;
    updateView();
    updatePopupArrows();
  }
}

function isAtBottom(el) {
  return el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
}

function setupSwipe() {
  document.addEventListener('touchstart', function(e) {
    if (isPageSelectorActive) return;
    const cards = getCards();
    const card = cards[current];
    if (card && card.scrollTop > 0 && !isAtBottom(card)) isScrolling = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  document.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    const dx = Math.abs(e.touches[0].clientX - startX);
    const dy = Math.abs(e.touches[0].clientY - startY);
    if (dy > dx && dy > 10) isScrolling = true;
  }, { passive: true });

  document.addEventListener('touchend', function(e) {
    if (!isDragging) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = Math.abs(e.changedTouches[0].clientY - startY);
    if (!isScrolling && Math.abs(dx) > 60 && dy < 100) {
      if (dx < 0) goNext(); else goPrev();
    }
    isDragging = false; 
    isScrolling = false;
  }, { passive: true });
}

function setupKeyboard() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
  });
}

// ========== PAGE SELECTOR ==========
let isPageSelectorActive = false;
let pageSelectStartY = 0;
let pageSelectThreshold = 50;
let lastPageChangeY = 0;
let psTouchOnCounter = false;
let psTouchStartY = 0;

function updatePopupArrows() {
  const upArrow = document.getElementById('navArrowUp');
  const downArrow = document.getElementById('navArrowDown');
  if (!upArrow || !downArrow) return;
  upArrow.classList.toggle('disabled', current === 0);
  downArrow.classList.toggle('disabled', current === getTotalCards() - 1);
}

function updatePopupCounter() {
  document.getElementById('navPopupCounter').textContent = (current + 1) + ' / ' + getTotalCards();
}

function activatePageSelector(e) {
  if (getTotalCards() <= 1) return;
  isPageSelectorActive = true;
  pageSelectStartY = e.clientY;
  lastPageChangeY = pageSelectStartY;
  updatePopupCounter();
  updatePopupArrows();
  document.getElementById('navOverlay').classList.add('active');
  if (navigator.vibrate) navigator.vibrate(10);
}

function deactivatePageSelector() {
  if (!isPageSelectorActive) return;
  isPageSelectorActive = false;
  document.getElementById('navOverlay').classList.remove('active');
}

function handlePageSelectMove(clientY) {
  if (!isPageSelectorActive) return;
  const delta = lastPageChangeY - clientY;
  if (Math.abs(delta) >= pageSelectThreshold) {
    if (delta > 0 && current < getTotalCards() - 1) {
      current++;
      updateView();
      updatePopupCounter();
      updatePopupArrows();
      lastPageChangeY = clientY;
      if (navigator.vibrate) navigator.vibrate(5);
    } else if (delta < 0 && current > 0) {
      current--;
      updateView();
      updatePopupCounter();
      updatePopupArrows();
      lastPageChangeY = clientY;
      if (navigator.vibrate) navigator.vibrate(5);
    }
  }
}

function psTouchMoveHandler(e) {
  if (!psTouchOnCounter) return;
  if (!isPageSelectorActive) return;
  e.preventDefault();
  handlePageSelectMove(e.touches[0].clientY);
}

function setupPageSelector() {
  const counter = document.getElementById('navCounter');
  const overlay = document.getElementById('navOverlay');

  counter.addEventListener('click', function(e) {
    if (getTotalCards() <= 1) return;
    e.stopPropagation();
    if (!isPageSelectorActive) {
      isPageSelectorActive = true;
      document.addEventListener('touchmove', psTouchMoveHandler, { passive: false });
      updatePopupCounter();
      updatePopupArrows();
      document.getElementById('navOverlay').classList.add('active');
      if (navigator.vibrate) navigator.vibrate(10);
    }
  });

  document.addEventListener('touchstart', function(e) {
    if (!isPageSelectorActive) return;
    psTouchOnCounter = true;
    psTouchStartY = e.touches[0].clientY;
    lastPageChangeY = psTouchStartY;
  }, { passive: true });

  document.addEventListener('touchend', function() {
    if (isPageSelectorActive) {
      document.removeEventListener('touchmove', psTouchMoveHandler);
      deactivatePageSelector();
    }
    psTouchOnCounter = false;
  }, { passive: true });

  overlay.addEventListener('wheel', function(e) {
    if (!isPageSelectorActive) return;
    e.preventDefault();
    if (e.deltaY > 0 && current < getTotalCards() - 1) {
      current++;
      updateView();
      updatePopupCounter();
      updatePopupArrows();
    } else if (e.deltaY < 0 && current > 0) {
      current--;
      updateView();
      updatePopupCounter();
      updatePopupArrows();
    }
  }, { passive: false });

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      deactivatePageSelector();
    }
  });
}
