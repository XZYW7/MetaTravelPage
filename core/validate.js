// ========== VALIDATE ==========
// Schema validation tool for journey.json

function validateJourney(config) {
  const errors = [];
  
  // Check schema_version
  if (!config.schema_version) {
    errors.push('Missing required field: schema_version');
  } else if (config.schema_version !== '1.0.0') {
    errors.push(`Invalid schema_version: ${config.schema_version}. Expected: 1.0.0`);
  }
  
  // Check app
  if (!config.app) {
    errors.push('Missing required field: app');
  } else {
    if (!config.app.title) {
      errors.push('Missing required field: app.title');
    }
  }
  
  // Check cards
  if (!config.cards) {
    errors.push('Missing required field: cards');
  } else if (!Array.isArray(config.cards)) {
    errors.push('cards must be an array');
  } else {
    config.cards.forEach((card, index) => {
      const cardErrors = validateCard(card, index);
      errors.push(...cardErrors);
    });
  }
  
  // Check features (optional)
  if (config.features) {
    const featureErrors = validateFeatures(config.features);
    errors.push(...featureErrors);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function validateCard(card, index) {
  const errors = [];
  const prefix = `cards[${index}]`;
  
  // Check required fields
  if (!card.id) {
    errors.push(`${prefix}: Missing required field: id`);
  }
  if (!card.type) {
    errors.push(`${prefix}: Missing required field: type`);
  } else if (!['cover', 'standard', 'reference'].includes(card.type)) {
    errors.push(`${prefix}: Invalid type: ${card.type}. Expected: cover, standard, reference`);
  }
  if (!card.title) {
    errors.push(`${prefix}: Missing required field: title`);
  }
  
  // Check sort_index (optional)
  if (card.sort_index !== undefined && typeof card.sort_index !== 'number') {
    errors.push(`${prefix}: sort_index must be a number`);
  }
  
  // Check sections (optional)
  if (card.sections) {
    if (!Array.isArray(card.sections)) {
      errors.push(`${prefix}: sections must be an array`);
    } else {
      card.sections.forEach((section, sIndex) => {
        const sectionErrors = validateSection(section, `${prefix}.sections[${sIndex}]`);
        errors.push(...sectionErrors);
      });
    }
  }
  
  return errors;
}

function validateSection(section, prefix) {
  const errors = [];
  
  if (!section.type) {
    errors.push(`${prefix}: Missing required field: type`);
    return errors;
  }
  
  const validTypes = ['timeline', 'table', 'info_box', 'checklist', 'expandable', 'phrasebook'];
  if (!validTypes.includes(section.type)) {
    errors.push(`${prefix}: Invalid type: ${section.type}. Expected: ${validTypes.join(', ')}`);
    return errors;
  }
  
  switch (section.type) {
    case 'timeline':
      if (!section.items || !Array.isArray(section.items)) {
        errors.push(`${prefix}: timeline must have items array`);
      } else {
        section.items.forEach((item, iIndex) => {
          if (!item.time) {
            errors.push(`${prefix}.items[${iIndex}]: Missing required field: time`);
          }
          if (!item.content) {
            errors.push(`${prefix}.items[${iIndex}]: Missing required field: content`);
          }
          if (item.variant && !['default', 'success', 'warning', 'danger'].includes(item.variant)) {
            errors.push(`${prefix}.items[${iIndex}]: Invalid variant: ${item.variant}`);
          }
        });
      }
      break;
      
    case 'table':
      if (!section.headers || !Array.isArray(section.headers)) {
        errors.push(`${prefix}: table must have headers array`);
      }
      if (!section.rows || !Array.isArray(section.rows)) {
        errors.push(`${prefix}: table must have rows array`);
      }
      break;
      
    case 'info_box':
      if (!section.content) {
        errors.push(`${prefix}: info_box must have content`);
      }
      if (section.variant && !['info', 'warning', 'danger', 'success'].includes(section.variant)) {
        errors.push(`${prefix}: Invalid variant: ${section.variant}`);
      }
      break;
      
    case 'checklist':
      if (!section.items || !Array.isArray(section.items)) {
        errors.push(`${prefix}: checklist must have items array`);
      }
      break;
      
    case 'expandable':
      if (!section.title) {
        errors.push(`${prefix}: expandable must have title`);
      }
      break;
      
    case 'phrasebook':
      if (!section.phrases || !Array.isArray(section.phrases)) {
        errors.push(`${prefix}: phrasebook must have phrases array`);
      } else {
        section.phrases.forEach((phrase, pIndex) => {
          if (!phrase.id) {
            errors.push(`${prefix}.phrases[${pIndex}]: Missing required field: id`);
          }
          if (!phrase['中文']) {
            errors.push(`${prefix}.phrases[${pIndex}]: Missing required field: 中文`);
          }
          if (!phrase['外语']) {
            errors.push(`${prefix}.phrases[${pIndex}]: Missing required field: 外语`);
          }
        });
      }
      break;
  }
  
  return errors;
}

function validateFeatures(features) {
  const errors = [];
  const prefix = 'features';
  
  // Validate diary
  if (features.diary) {
    if (features.diary.storage && !['local', 'remote'].includes(features.diary.storage)) {
      errors.push(`${prefix}.diary: Invalid storage: ${features.diary.storage}. Expected: local, remote`);
    }
  }
  
  // Validate timer
  if (features.timer) {
    if (features.timer.presets && !Array.isArray(features.timer.presets)) {
      errors.push(`${prefix}.timer: presets must be an array`);
    }
  }
  
  // Validate phrasebook
  if (features.phrasebook) {
    // No specific validation needed
  }
  
  return errors;
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateJourney };
}
