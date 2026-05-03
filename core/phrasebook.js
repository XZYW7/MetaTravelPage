// ========== PHRASEBOOK ==========
// Phrasebook/audio playback plugin

let currentAudio = null;
let phrasebookConfig = null;
let phrasesMap = {};

function initPhrasebook(config) {
  if (!config) return;
  phrasebookConfig = config;
  
  // Build phrases map from all cards
  const cards = journeyConfig.cards || [];
  cards.forEach(card => {
    if (card.sections) {
      card.sections.forEach(section => {
        if (section.type === 'phrasebook' && section.phrases) {
          section.phrases.forEach(phrase => {
            phrasesMap[phrase.id] = phrase;
          });
        }
      });
    }
  });
}

function speakPhrase(phraseId) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  
  const phrase = phrasesMap[phraseId];
  if (!phrase) {
    console.error('Phrase not found:', phraseId);
    return;
  }
  
  const audioPath = phrasebookConfig?.audio_path || 'assets/audio/';
  const audioFile = phrase.audio || `${phraseId}.mp3`;
  
  currentAudio = new Audio(`${audioPath}${audioFile}`);
  currentAudio.play().catch(err => {
    console.error('Audio playback failed:', err);
  });
}
