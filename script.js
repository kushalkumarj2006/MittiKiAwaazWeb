// ============================================
// MITTI KI AWAAZ - Complete Frontend Logic
// With Enhanced Console Logging for Easy Debugging
// ============================================

// ============================================
// 📝 LOGGING SYSTEM
// ============================================

const Logger = {
  // Log levels with colors
  levels: {
    INFO: { emoji: '📘', color: '#2196F3', label: 'INFO' },
    SUCCESS: { emoji: '✅', color: '#4CAF50', label: 'SUCCESS' },
    WARNING: { emoji: '⚠️', color: '#FF9800', label: 'WARNING' },
    ERROR: { emoji: '❌', color: '#F44336', label: 'ERROR' },
    DEBUG: { emoji: '🔍', color: '#9C27B0', label: 'DEBUG' },
    API: { emoji: '🌐', color: '#00BCD4', label: 'API' },
    SPEECH: { emoji: '🎤', color: '#E91E63', label: 'SPEECH' },
    STATE: { emoji: '📦', color: '#FF5722', label: 'STATE' },
    UI: { emoji: '🎨', color: '#8BC34A', label: 'UI' }
  },

  // Log to console with style
  log(level, message, data = null) {
    const levelInfo = this.levels[level] || this.levels.INFO;
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour12: false });
    
    // Console group for better organization
    console.group(
      `%c${levelInfo.emoji} [${timestamp}] ${levelInfo.label}%c ${message}`,
      `color: ${levelInfo.color}; font-weight: bold;`,
      'color: inherit; font-weight: normal;'
    );
    
    if (data) {
      if (typeof data === 'object') {
        console.log('📦 Data:', JSON.parse(JSON.stringify(data)));
      } else {
        console.log('📦 Data:', data);
      }
    }
    
    // For errors, show stack trace
    if (level === 'ERROR' && data?.stack) {
      console.error('Stack trace:', data.stack);
    }
    
    console.groupEnd();
    
    // Also log to a memory buffer for export
    this._buffer.push({
      timestamp,
      level: levelInfo.label,
      message,
      data: data ? JSON.stringify(data) : null
    });
    
    // Keep buffer at 100 entries
    if (this._buffer.length > 100) {
      this._buffer.shift();
    }
  },

  // Convenience methods
  info(msg, data) { this.log('INFO', msg, data); },
  success(msg, data) { this.log('SUCCESS', msg, data); },
  warning(msg, data) { this.log('WARNING', msg, data); },
  error(msg, data) { this.log('ERROR', msg, data); },
  debug(msg, data) { this.log('DEBUG', msg, data); },
  api(msg, data) { this.log('API', msg, data); },
  speech(msg, data) { this.log('SPEECH', msg, data); },
  state(msg, data) { this.log('STATE', msg, data); },
  ui(msg, data) { this.log('UI', msg, data); },

  // Export logs
  exportLogs() {
    return JSON.stringify(this._buffer, null, 2);
  },

  // Clear logs
  clear() {
    this._buffer = [];
    console.clear();
    this.success('🗑️ Logs cleared');
  },

  _buffer: []
};

// Expose logger globally for debugging
window.__logger = Logger;

// ============================================
// 🏗️ STATE MANAGEMENT
// ============================================

const AppState = {
  language: 'hi',
  isLoggedIn: false,
  userName: 'Rajesh Kumar',
  phone: '9876543210',
  currentScreen: 'voice',
  ph: 5.8,
  soilHistory: [],
  alerts: [],
  schemes: [],
  chatLog: [],
  isListening: false,
  isSpeaking: false,
  isLoading: true
};

// Load saved state
function loadState() {
  Logger.state('🔄 Loading saved state from localStorage');
  try {
    const saved = localStorage.getItem('mittiState');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(AppState, parsed);
      Logger.success('✅ State loaded successfully', { 
        isLoggedIn: AppState.isLoggedIn,
        userName: AppState.userName,
        language: AppState.language,
        soilHistoryCount: AppState.soilHistory.length 
      });
      return true;
    } else {
      Logger.info('ℹ️ No saved state found, using defaults');
      return false;
    }
  } catch (e) {
    Logger.error('❌ Failed to load state', { error: e.message });
    return false;
  }
}

function saveState() {
  Logger.state('💾 Saving state to localStorage');
  try {
    localStorage.setItem('mittiState', JSON.stringify(AppState));
    Logger.success('✅ State saved successfully');
  } catch (e) {
    Logger.error('❌ Failed to save state', { error: e.message });
  }
}

// ============================================
// 📱 DOM REFS WITH LOGGING
// ============================================

function $(id) {
  const el = document.getElementById(id);
  if (!el) {
    Logger.warning(`⚠️ Element not found: #${id}`);
  }
  return el;
}

function $$(sel) {
  const els = document.querySelectorAll(sel);
  if (els.length === 0) {
    Logger.warning(`⚠️ No elements found: ${sel}`);
  }
  return els;
}

// DOM Elements
const DOM = {
  loadingScreen: $('loadingScreen'),
  loginScreen: $('loginScreen'),
  appScreen: $('appScreen'),
  
  // Login
  loginBtn: $('loginBtn'),
  farmerName: $('farmerName'),
  phoneNumber: $('phoneNumber'),
  pinCode: $('pinCode'),
  langBtns: $$('.lang-btn'),
  
  // Header
  userName: $('userName'),
  logoutBtn: $('logoutBtn'),
  settingsBtn: $('settingsBtn'),
  
  // Navigation
  navItems: $$('.nav-item'),
  
  // Voice
  chatContainer: $('chatContainer'),
  chatInput: $('chatInput'),
  sendBtn: $('sendBtn'),
  micBtn: $('micBtn'),
  avatarPulse: $('avatarPulse'),
  statusBadge: $('statusBadge'),
  qlangs: $$('.qlang'),
  shortcuts: $$('.shortcut'),
  
  // Soil
  phChips: $$('.ph-chip'),
  phValue: $('phValue'),
  phLabel: $('phLabel'),
  phDisplay: $('phDisplay'),
  analyzeBtn: $('analyzeBtn'),
  soilResult: $('soilResult'),
  soilResultText: $('soilResultText'),
  speakResultBtn: $('speakResultBtn'),
  historyList: $('historyList'),
  
  // Disaster
  ackBtns: $$('.ack-btn'),
  speakAlertBtns: $$('.speak-alert-btn'),
  checklistBtns: $$('.checklist-btn'),
  checklistDisplay: $('checklistDisplay'),
  checklistTitle: $('checklistTitle'),
  checklistContent: $('checklistContent'),
  closeChecklist: $('closeChecklist'),
  
  // Sarpanch
  scoreValue: $('scoreValue'),
  scoreCircle: $('scoreCircle'),
  generateSchemeBtn: $('generateSchemeBtn'),
  schemeItems: $('schemeItems'),
  
  // Toast
  toast: $('toast'),
  toastMessage: $('toastMessage')
};

// ============================================
// 🌐 LANGUAGE SUPPORT
// ============================================

const LANG_LABELS = {
  hi: { 
    name: 'हिंदी', 
    code: 'hi-IN',
    display: 'Hindi',
    greeting: '👋 नमस्ते! मैं कृषि सखी हूँ। आज आपके खेत का क्या हाल है?',
    listening: '🎤 सुन रहा हूँ...',
    speaking: '🔊 बोल रहा हूँ...',
    online: '● ऑनलाइन'
  },
  kn: { 
    name: 'ಕನ್ನಡ', 
    code: 'kn-IN',
    display: 'Kannada',
    greeting: '👋 ನಮಸ್ತೆ! ನಾನು ಕೃಷಿ ಸಖಿ. ಇಂದು ನಿಮ್ಮ ಹೊಲದ ಸ್ಥಿತಿ ಹೇಗಿದೆ?',
    listening: '🎤 ಕೇಳುತ್ತಿದ್ದೇನೆ...',
    speaking: '🔊 ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ...',
    online: '● ಆನ್ಲೈನ್'
  },
  mr: { 
    name: 'मराठी', 
    code: 'mr-IN',
    display: 'Marathi',
    greeting: '👋 नमस्कार! मी कृषी सखी आहे. आज तुमच्या शेताची काय परिस्थिती आहे?',
    listening: '🎤 ऐकत आहे...',
    speaking: '🔊 बोलत आहे...',
    online: '● ऑनलाइन'
  },
  en: { 
    name: 'English', 
    code: 'en-IN',
    display: 'English',
    greeting: '👋 Namaste! I am Krishi Sakhi. How is your field today?',
    listening: '🎤 Listening...',
    speaking: '🔊 Speaking...',
    online: '● Online'
  }
};

function getLang() {
  return AppState.language;
}

function getLangLabel() {
  return LANG_LABELS[getLang()] || LANG_LABELS.en;
}

// ============================================
// 🔄 LANGUAGE SWITCHING
// ============================================

function setLanguage(lang) {
  Logger.ui(`🌐 Switching language to: ${lang} (${LANG_LABELS[lang].display})`);
  
  AppState.language = lang;
  
  // Update language buttons
  DOM.langBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  DOM.qlangs.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // Update all text elements with data-* attributes
  updateUIText(lang);
  
  // Update greeting
  const greeting = LANG_LABELS[lang].greeting;
  DOM.chatContainer.innerHTML = '';
  addMessage('Krishi Sakhi', greeting, false);
  
  // Update status badge
  updateStatus('online');
  
  // Update shortcuts
  updateShortcuts(lang);
  
  saveState();
  Logger.success(`✅ Language switched to: ${LANG_LABELS[lang].display}`);
}

function updateUIText(lang) {
  Logger.debug('🔄 Updating UI text for language:', lang);
  
  // Update all elements with data-* attributes
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.dataset[lang];
    if (text) {
      // For input placeholders
      if (el.tagName === 'INPUT' && el.dataset[lang]) {
        el.placeholder = text;
      } else {
        // For input labels and other elements
        if (el.tagName === 'LABEL') {
          el.textContent = text;
        } else if (el.tagName === 'INPUT') {
          el.placeholder = text;
        } else {
          // For divs, spans, buttons, etc.
          const children = el.children;
          if (children.length === 0 || el.tagName === 'BUTTON') {
            el.textContent = text;
          } else {
            // For elements with multiple children, preserve structure
            const textNodes = [];
            el.childNodes.forEach(node => {
              if (node.nodeType === Node.TEXT_NODE) {
                textNodes.push(node);
              }
            });
            if (textNodes.length > 0) {
              textNodes[0].textContent = text;
            } else {
              // Find first text node or update innerHTML safely
              try {
                el.textContent = text;
              } catch (e) {
                // Fallback
              }
            }
          }
        }
      }
    }
  });
  
  // Update app title
  const titleEl = $('appTitle');
  if (titleEl) {
    const title = titleEl.dataset[lang] || 'Mitti Ki Awaaz';
    titleEl.textContent = title;
  }
  
  Logger.success('✅ UI text updated');
}

function updateShortcuts(lang) {
  Logger.debug('🔄 Updating shortcuts for language:', lang);
  
  DOM.shortcuts.forEach(btn => {
    const query = btn.dataset[`query-${lang}`];
    if (query) {
      btn.dataset.query = query;
    }
    
    // Update label text
    const labelSpan = btn.querySelector('span');
    if (labelSpan) {
      const text = labelSpan.dataset[lang];
      if (text) {
        labelSpan.textContent = text;
      }
    }
  });
  
  Logger.success('✅ Shortcuts updated');
}

// ============================================
// 🎙️ SPEECH RECOGNITION
// ============================================

let recognition = null;

function initSpeechRecognition() {
  Logger.speech('🎤 Initializing Speech Recognition');
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    Logger.warning('⚠️ Speech recognition not supported in this browser');
    showToast('Speech recognition not supported. Please use typing!', 'warning');
    return false;
  }
  
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = getLangLabel().code;
  recognition.maxAlternatives = 1;
  
  recognition.onstart = () => {
    Logger.speech('🎤 Speech recognition started');
    AppState.isListening = true;
    DOM.micBtn.classList.add('listening');
    DOM.micBtn.textContent = '⏹';
    updateStatus('listening');
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    Logger.speech('🎤 Speech recognized', { transcript });
    stopListening();
    if (transcript.trim()) {
      DOM.chatInput.value = transcript;
      sendMessage(transcript);
    }
  };
  
  recognition.onerror = (event) => {
    Logger.error('❌ Speech recognition error', { 
      error: event.error,
      message: event.message || 'Unknown error'
    });
    stopListening();
    showToast(`सुनाई नहीं दिया / Could not hear: ${event.error}`, 'error');
  };
  
  recognition.onend = () => {
    Logger.speech('🎤 Speech recognition ended');
    stopListening();
  };
  
  Logger.success('✅ Speech recognition initialized');
  return true;
}

function startListening() {
  Logger.speech('🎤 Starting speech recognition');
  
  if (!recognition) {
    const initialized = initSpeechRecognition();
    if (!initialized) {
      showToast('Speech recognition not supported', 'error');
      return;
    }
  }
  
  // Cancel any ongoing speech
  stopSpeaking();
  
  recognition.lang = getLangLabel().code;
  
  try {
    recognition.start();
    Logger.speech('🎤 Speech recognition started successfully');
  } catch (e) {
    Logger.error('❌ Failed to start speech recognition', { error: e.message });
    showToast('Failed to start microphone. Please try again.', 'error');
  }
}

function stopListening() {
  if (recognition) {
    try {
      recognition.stop();
      Logger.speech('🎤 Speech recognition stopped');
    } catch (e) {
      Logger.warning('⚠️ Error stopping speech recognition', { error: e.message });
    }
  }
  
  AppState.isListening = false;
  DOM.micBtn.classList.remove('listening');
  DOM.micBtn.textContent = '🎤';
  updateStatus('online');
}

// Toggle mic
DOM.micBtn.addEventListener('click', () => {
  Logger.ui('🎤 Mic button clicked');
  if (AppState.isListening) {
    stopListening();
  } else {
    startListening();
  }
});

// ============================================
// 🔊 TEXT-TO-SPEECH
// ============================================

let speechUtterance = null;

function speakText(text, lang = null) {
  Logger.speech('🔊 Speaking text', { 
    textLength: text?.length || 0,
    lang: lang || getLangLabel().code
  });
  
  if (!window.speechSynthesis) {
    Logger.warning('⚠️ Speech synthesis not supported');
    showToast('Speech not supported in this browser', 'warning');
    return;
  }
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang || getLangLabel().code;
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  // Try to find a native voice
  const voices = window.speechSynthesis.getVoices();
  const nativeVoice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
  if (nativeVoice) {
    utterance.voice = nativeVoice;
    Logger.debug('🔊 Using voice:', nativeVoice.name);
  }
  
  utterance.onstart = () => {
    Logger.speech('🔊 Speech started');
    AppState.isSpeaking = true;
    updateStatus('speaking');
    DOM.avatarPulse.style.animationDuration = '0.5s';
  };
  
  utterance.onend = () => {
    Logger.speech('🔊 Speech ended');
    AppState.isSpeaking = false;
    updateStatus('online');
    DOM.avatarPulse.style.animationDuration = '2.5s';
  };
  
  utterance.onerror = (event) => {
    Logger.error('❌ Speech synthesis error', { 
      error: event.error,
      message: event.message || 'Unknown error'
    });
    AppState.isSpeaking = false;
    updateStatus('online');
    DOM.avatarPulse.style.animationDuration = '2.5s';
  };
  
  speechUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  
  Logger.success('🔊 Speech queued');
}

function stopSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    Logger.speech('🔊 Speech stopped');
  }
  AppState.isSpeaking = false;
  updateStatus('online');
  DOM.avatarPulse.style.animationDuration = '2.5s';
}

// ============================================
// 💬 CHAT FUNCTIONS
// ============================================

function addMessage(sender, text, isUser = false) {
  Logger.debug('💬 Adding message', { sender, textLength: text?.length || 0 });
  
  const div = document.createElement('div');
  div.className = `message ${isUser ? 'user' : 'ai'}`;
  
  if (!isUser) {
    div.innerHTML = `
      <div class="msg-avatar">🌾</div>
      <div class="msg-bubble">${text}</div>
    `;
  } else {
    div.innerHTML = `
      <div class="msg-avatar">👤</div>
      <div class="msg-bubble">${text}</div>
    `;
  }
  
  DOM.chatContainer.appendChild(div);
  DOM.chatContainer.scrollTop = DOM.chatContainer.scrollHeight;
  
  // Save to chat log
  AppState.chatLog.push({ sender, text, timestamp: Date.now() });
  saveState();
  
  Logger.success('💬 Message added');
}

function showTyping() {
  const existing = document.getElementById('typingIndicator');
  if (existing) existing.remove();
  
  const div = document.createElement('div');
  div.className = 'message ai';
  div.id = 'typingIndicator';
  
  const lang = getLang();
  const typingText = lang === 'hi' ? '⏳ सोच रहा हूँ...' :
                     lang === 'kn' ? '⏳ ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...' :
                     lang === 'mr' ? '⏳ विचार करत आहे...' :
                     '⏳ Thinking...';
  
  div.innerHTML = `
    <div class="msg-avatar">🌾</div>
    <div class="msg-bubble">${typingText}</div>
  `;
  DOM.chatContainer.appendChild(div);
  DOM.chatContainer.scrollTop = DOM.chatContainer.scrollHeight;
  
  Logger.debug('💬 Typing indicator shown');
}

function removeTyping() {
  const typing = document.getElementById('typingIndicator');
  if (typing) {
    typing.remove();
    Logger.debug('💬 Typing indicator removed');
  }
}

async function sendMessage(text) {
  if (!text || !text.trim()) {
    Logger.warning('⚠️ Empty message, ignoring');
    return;
  }
  
  Logger.api('💬 Sending message', { text, language: getLang() });
  
  // Add user message
  addMessage('User', text, true);
  DOM.chatInput.value = '';
  
  // Show typing
  showTyping();
  
  try {
    // Get AI response
    const response = await callGeminiAPI(text);
    
    // Remove typing and add response
    removeTyping();
    addMessage('Krishi Sakhi', response, false);
    
    // Speak the response
    speakText(response);
    
    Logger.success('💬 Message processed successfully');
  } catch (error) {
    Logger.error('❌ Failed to process message', { error: error.message });
    removeTyping();
    const errorMsg = getLang() === 'hi' ? 'क्षमा करें, कुछ गड़बड़ हो गई। कृपया फिर से प्रयास करें।' :
                      getLang() === 'kn' ? 'ಕ್ಷಮಿಸಿ, ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.' :
                      getLang() === 'mr' ? 'क्षमस्व, काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.' :
                      'Sorry, something went wrong. Please try again.';
    addMessage('Krishi Sakhi', errorMsg, false);
    showToast('Error: ' + error.message, 'error');
  }
}

// ============================================
// 🌐 API CALLS
// ============================================

async function callGeminiAPI(message) {
  const lang = getLang();
  Logger.api('🌐 Calling Gemini API', { message, language: lang });
  
  const startTime = performance.now();
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ message, language: lang })
    });
    
    const duration = Math.round(performance.now() - startTime);
    Logger.api('🌐 API response received', { 
      status: response.status,
      duration: `${duration}ms`
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.response) {
      throw new Error('Empty response from server');
    }
    
    Logger.success('🌐 Gemini API call successful', {
      responseLength: data.response.length,
      duration: `${duration}ms`
    });
    
    return data.response;
    
  } catch (error) {
    const duration = Math.round(performance.now() - startTime);
    Logger.error('❌ Gemini API call failed', { 
      error: error.message,
      duration: `${duration}ms`
    });
    
    // Use fallback
    return getFallbackResponse(message, lang);
  }
}

async function analyzeSoil(ph) {
  const lang = getLang();
  Logger.api('🌐 Analyzing soil', { ph, language: lang });
  
  const startTime = performance.now();
  
  try {
    const response = await fetch('/api/soil-analyze', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ph, language: lang })
    });
    
    const duration = Math.round(performance.now() - startTime);
    Logger.api('🌐 Soil analysis response', { 
      status: response.status,
      duration: `${duration}ms`
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.response) {
      throw new Error('Empty response from server');
    }
    
    Logger.success('🌐 Soil analysis successful', {
      ph,
      responseLength: data.response.length,
      duration: `${duration}ms`
    });
    
    return data.response;
    
  } catch (error) {
    const duration = Math.round(performance.now() - startTime);
    Logger.error('❌ Soil analysis failed', { 
      error: error.message,
      duration: `${duration}ms`
    });
    
    return getFallbackResponse('soil', lang);
  }
}

// ============================================
// 📋 FALLBACK RESPONSES
// ============================================

function getFallbackResponse(query, lang) {
  Logger.fallback('📋 Using fallback response', { query, language: lang });
  
  const fallbacks = {
    hi: {
      soil: '🌿 मिट्टी पीएच 5.8 है। नाइट्रोजन कम है। 2.5 किलो चूना प्रति बीघा डालें। मूंगफली या सरसों बोएं।',
      weather: '🌦️ 5 दिन गर्मी रहेगी, शाम को हल्की बारिश। शाम को ही पानी दें।',
      scheme: '📋 पीएम-किसान योजना में ₹6000 सालाना मिलते हैं। चूना सब्सिडी 50% है।',
      default: '👋 नमस्ते! मैं कृषि सखी हूँ। मिट्टी, मौसम, योजनाएं, फसल या भाव पूछें।'
    },
    kn: {
      soil: '🌿 ಮಣ್ಣಿನ pH 5.8. 2.5 ಕೆಜಿ ಸುಣ್ಣ ಬಳಸಿ. ಶೇಂಗಾ ಅಥವಾ ಸಾಸಿವೆ ಬೆಳೆಯಿರಿ.',
      weather: '🌦️ 5 ದಿನ ಬಿಸಿ, ಸಂಜೆ ಮಳೆ ಸಾಧ್ಯತೆ. ಸಂಜೆ ನೀರುಣಿಸಿ.',
      scheme: '📋 ಪಿಎಂ-ಕಿಸಾನ್ ₹6000/ವರ್ಷ, ಸುಣ್ಣಕ್ಕೆ 50% ಸಹಾಯಧನ.',
      default: '👋 ನಮಸ್ತೆ! ನಾನು ಕೃಷಿ ಸಖಿ. ಮಣ್ಣು, ಹವಾಮಾನ, ಯೋಜನೆ, ಬೆಳೆ, ಬೆಲೆ ಕೇಳಿ.'
    },
    mr: {
      soil: '🌿 माती pH 5.8. 2.5 किलो चुना वापरा. भुईमूग किंवा मोहरी पेरा.',
      weather: '🌦️ 5 दिवस उष्णता, संध्याकाळी हलका पाऊस. संध्याकाळी पाणी द्या.',
      scheme: '📋 पीएम-किसान ₹6000/वर्ष, चुन्यावर 50% अनुदान.',
      default: '👋 नमस्कार! मी कृषी सखी. माती, हवामान, योजना, पीक, भाव विचारा.'
    },
    en: {
      soil: '🌿 Soil pH 5.8. Apply 2.5 kg lime per bigha. Grow Groundnut or Mustard.',
      weather: '🌦️ 5 days warm, evening showers. Irrigate in evenings.',
      scheme: '📋 PM-KISAN ₹6000/year. 50% lime subsidy available.',
      default: '👋 Namaste! I am Krishi Sakhi. Ask about soil, weather, schemes, crops, or prices.'
    }
  };
  
  const q = query.toLowerCase();
  const langData = fallbacks[lang] || fallbacks.en;
  
  if (q.includes('मिट्टी') || q.includes('soil') || q.includes('माती') || q.includes('ಮಣ್ಣು')) {
    return langData.soil;
  }
  if (q.includes('मौसम') || q.includes('weather') || q.includes('हवामान') || q.includes('ಹವಾಮಾನ')) {
    return langData.weather;
  }
  if (q.includes('योजना') || q.includes('scheme') || q.includes('सब्सिडी') || q.includes('ಸಬ್ಸಿಡಿ')) {
    return langData.scheme;
  }
  
  return langData.default;
}

// ============================================
// 🧪 SOIL SCAN FUNCTIONS
// ============================================

function updatePhDisplay() {
  const ph = AppState.ph;
  DOM.phValue.textContent = ph.toFixed(1);
  
  let label = '';
  let color = '';
  const lang = getLang();
  
  if (ph < 5.5) {
    label = lang === 'hi' ? 'अत्यंत अम्लीय' : 
            lang === 'kn' ? 'ಹೆಚ್ಚು ಆಮ್ಲೀಯ' : 
            lang === 'mr' ? 'अत्यंत आम्लयुक्त' : 'Highly Acidic';
    color = '#D84315';
  } else if (ph < 6.5) {
    label = lang === 'hi' ? 'मध्यम अम्लीय' : 
            lang === 'kn' ? 'ಮಧ್ಯಮ ಆಮ್ಲೀಯ' : 
            lang === 'mr' ? 'मध्यम आम्लयुक्त' : 'Moderately Acidic';
    color = '#E8A838';
  } else if (ph < 7.5) {
    label = lang === 'hi' ? 'उत्तम उदासीन' : 
            lang === 'kn' ? 'ತಟಸ್ಥ' : 
            lang === 'mr' ? 'उदासीन' : 'Optimal Neutral';
    color = '#2E7D32';
  } else {
    label = lang === 'hi' ? 'क्षारीय' : 
            lang === 'kn' ? 'ಕ್ಷಾರೀಯ' : 
            lang === 'mr' ? 'क्षारयुक्त' : 'Alkaline';
    color = '#3F51B5';
  }
  
  DOM.phLabel.textContent = label;
  DOM.phDisplay.style.background = color + '22';
  DOM.phDisplay.style.border = `2px solid ${color}`;
  
  Logger.debug('🧪 pH display updated', { ph, label, color });
}

// pH chip clicks
DOM.phChips.forEach(chip => {
  chip.addEventListener('click', () => {
    DOM.phChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    AppState.ph = parseFloat(chip.dataset.ph);
    Logger.ui('🧪 pH selected', { ph: AppState.ph });
    updatePhDisplay();
    saveState();
  });
});

// Analyze soil
DOM.analyzeBtn.addEventListener('click', async () => {
  const ph = AppState.ph;
  Logger.ui('🧪 Analyze button clicked', { ph });
  
  DOM.soilResult.style.display = 'block';
  const loadingText = getLang() === 'hi' ? '⏳ विश्लेषण हो रहा है...' :
                      getLang() === 'kn' ? '⏳ ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...' :
                      getLang() === 'mr' ? '⏳ विश्लेषण करत आहे...' :
                      '⏳ Analyzing...';
  DOM.soilResultText.textContent = loadingText;
  
  try {
    const response = await analyzeSoil(ph);
    DOM.soilResultText.textContent = response;
    
    // Add to history
    AppState.soilHistory.push({
      ph: ph,
      result: response,
      timestamp: new Date().toISOString()
    });
    saveState();
    renderHistory();
    
    speakText(response);
    Logger.success('🧪 Soil analysis completed', { ph });
  } catch (error) {
    Logger.error('❌ Soil analysis failed', { error: error.message });
    const errorMsg = getLang() === 'hi' ? '❌ विश्लेषण विफल। कृपया फिर से प्रयास करें।' :
                     getLang() === 'kn' ? '❌ ವಿಶ್ಲೇಷಣೆ ವಿಫಲವಾಗಿದೆ. ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.' :
                     getLang() === 'mr' ? '❌ विश्लेषण अयशस्वी. कृपया पुन्हा प्रयत्न करा.' :
                     '❌ Analysis failed. Please try again.';
    DOM.soilResultText.textContent = errorMsg;
  }
});

// Speak result
DOM.speakResultBtn.addEventListener('click', () => {
  const text = DOM.soilResultText.textContent;
  if (text && !text.includes('⏳') && !text.includes('❌')) {
    Logger.ui('🔊 Speaking soil result');
    speakText(text);
  }
});

function renderHistory() {
  Logger.debug('📜 Rendering soil history', { count: AppState.soilHistory.length });
  
  DOM.historyList.innerHTML = '';
  
  if (AppState.soilHistory.length === 0) {
    const emptyMsg = getLang() === 'hi' ? 'अभी कोई रिकॉर्ड नहीं' :
                     getLang() === 'kn' ? 'ಇನ್ನೂ ಯಾವುದೇ ದಾಖಲೆಗಳಿಲ್ಲ' :
                     getLang() === 'mr' ? 'अद्याप कोणतेही रेकॉर्ड नाहीत' :
                     'No records yet';
    DOM.historyList.innerHTML = `<div class="history-empty">${emptyMsg}</div>`;
    return;
  }
  
  AppState.soilHistory.slice().reverse().forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    const date = new Date(item.timestamp);
    div.innerHTML = `
      <div>
        <strong>pH ${item.ph.toFixed(1)}</strong>
        <small style="display:block;color:var(--grey);font-size:11px;">
          ${date.toLocaleDateString()} ${date.toLocaleTimeString()}
        </small>
      </div>
      <span class="ph-badge">✅</span>
    `;
    DOM.historyList.appendChild(div);
  });
  
  Logger.success('📜 History rendered');
}

// ============================================
// 🚨 DISASTER ALERTS
// ============================================

// Acknowledge alerts
DOM.ackBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const alertId = btn.dataset.alert;
    Logger.ui('🚨 Alert acknowledged', { alertId });
    
    btn.textContent = '✅ ' + (getLang() === 'hi' ? 'मिली' : 
                               getLang() === 'kn' ? 'ಸ್ವೀಕರಿಸಲಾಗಿದೆ' : 
                               getLang() === 'mr' ? 'मिळाली' : 
                               'Received');
    btn.disabled = true;
    btn.style.opacity = '0.5';
    
    showToast('✅ ' + (getLang() === 'hi' ? 'सूचना मिली' :
                      getLang() === 'kn' ? 'ಎಚ್ಚರಿಕೆ ಸ್ವೀಕರಿಸಲಾಗಿದೆ' :
                      getLang() === 'mr' ? 'माहिती मिळाली' :
                      'Alert acknowledged'), 'success');
  });
});

// Speak alerts
DOM.speakAlertBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const alertId = btn.dataset.alert;
    const card = document.getElementById(alertId + 'Alert') || 
                 document.querySelector(`.alert-card[data-alert="${alertId}"]`);
    if (card) {
      const msg = card.querySelector('.alert-message');
      if (msg) {
        Logger.ui('🔊 Speaking alert', { alertId });
        speakText(msg.textContent);
      }
    }
  });
});

// ============================================
// 📋 CHECKLISTS
// ============================================

const CHECKLISTS = {
  livestock: {
    hi: `🐮 मवेशी सुरक्षा चेकलिस्ट

1. गाय, भैंस और बकरियों को तुरंत पंचायत भवन या स्कूल के ऊंचे मैदान में ले जाएं।
2. 3 दिनों का सूखा भूसा और चारा प्लास्टिक शीट में सुरक्षित रखें।
3. पशुओं को आज रात खूंटे से बांधकर न रखें - ताकि बाढ़ आने पर वे तैरकर जान बचा सकें।
4. पीने के पानी में जंतुनाशक पावडर मिलाएं।`,
    kn: `🐮 ಜಾನುವಾರು ರಕ್ಷಣೆ

1. ಜಾನುವಾರುಗಳನ್ನು ತಕ್ಷಣ ಶಾಲೆಯ ಆಟದ ಮೈದಾನ ಅಥವಾ ಎತ್ತರದ ಸ್ಥಳಕ್ಕೆ ಸ್ಥಳಾಂತರಿಸಿ.
2. 3 ದಿನಗಳಿಗೆ ಸಾಕಾಗುವಷ್ಟು ಒಣ ಹುಲ್ಲು ಮತ್ತು ಮೇವನ್ನು ಪ್ಲಾಸ್ಟಿಕ್ ಚೀಲದಲ್ಲಿ ಸಂಗ್ರಹಿಸಿಡಿ.
3. ಇಂದು ರಾತ್ರಿ ಪ್ರಾಣಿಗಳನ್ನು ಹಗ್ಗದಿಂದ ಕಟ್ಟಬೇಡಿ - ಪ್ರವಾಹ ಬಂದರೆ ಅವು ಈಜಲು ಸಾಧ್ಯವಾಗಬೇಕು.
4. ಕುಡಿಯುವ ನೀರಿಗೆ ಔಷಧ ಬೆರೆಸಿ ಸಾಂಕ್ರಾಮಿಕ ರೋಗಗಳಿಂದ ಕಾಪಾಡಿ.`,
    mr: `🐮 पशुधन संरक्षण

1. गायी, म्हशी आणि शेळ्यांना त्वरित पंचायत कार्यालय किंवा शाळेच्या उंच मैदानावर न्यावे.
2. 3 दिवसांचा सुका चारा प्लास्टिक शीटमध्ये गुंडाळून सुरक्षित ठेवावा.
3. आज रात्री जनावरांना गोठ्यात घट्ट बांधू नका - पूर आल्यास ते पोहून स्वतःचा बचाव करू शकतील.
4. पिण्याच्या पाण्यात जंतुनाशक पावडर वापरावी.`,
    en: `🐮 Livestock Safety Checklist

1. Move cows, buffaloes, and goats immediately to elevated school playground or Panchayat yard.
2. Pack dry straw/fodder inside protective plastic sheets for at least 3 days.
3. Do NOT tie ropes or chains around animals' necks tonight - let them swim freely if water levels surge.
4. Add bleaching powder to stock water tanks to avoid diseases.`
  },
  crops: {
    hi: `🌾 फसल सुरक्षा चेकलिस्ट

1. खेतों के जल निकासी नालों को तुरंत साफ करें ताकि बाढ़ का पानी जड़ों में जमा न हो।
2. 90% पकी फसल की तुरंत कटाई कर लें ताकि सड़ने से बचाया जा सके।
3. कटी हुई फसलों के बोरों को खुले मैदान से हटाकर सूखे गोदामों में रखें।`,
    kn: `🌾 ಬೆಳೆ ರಕ್ಷಣೆ

1. ಜಮೀನಿನ ನೀರು ಹರಿದುಹೋಗಲು ಚರಂಡಿಗಳನ್ನು ತಕ್ಷಣ ಸ್ವಚ್ಛಗೊಳಿಸಿ.
2. 90% ಬೆಳೆದ ಬೆಳೆಗಳನ್ನು ತಕ್ಷಣ ಕೊಯ್ಲು ಮಾಡಿ ಕೊಳೆಯದಂತೆ ರಕ್ಷಿಸಿ.
3. ಕೊಯ್ಲು ಮಾಡಿದ ಮೂಟೆಗಳನ್ನು ತೆರೆದ ಮೈದಾನದಿಂದ ಒಣ ಗೋದಾಮಿಗೆ ಸಾಗಿಸಿ.`,
    mr: `🌾 पीक संरक्षण

1. शेतातील पाण्याचा निचरा होणारे नाले त्वरित मोकळे करा.
2. 90% पक्व झालेली पिके त्वरित कापणी करून घ्या.
3. कापणी केलेल्या पोत्यांना उघड्या मैदानावरून सुरक्षित व सुक्या गोदामात हलवा.`,
    en: `🌾 Crop Rescue Checklist

1. Clear crop drains and silt canals immediately so floodwater does not pool in the roots.
2. Harvest early pods of soybean/mustard now, even if 90% ripe, to prevent rot damage.
3. Shift harvested sacks from open ground to dry storage sheds.`
  },
  evacuation: {
    hi: `🏠 स्थानांतरण चेकलिस्ट

1. बाढ़ की चेतावनी मिलने पर तुरंत सुरक्षित स्थान पर जाएं।
2. महत्वपूर्ण दस्तावेज, नकदी और आवश्यक दवाइयां अपने साथ रखें।
3. बिजली के मुख्य स्विच बंद कर दें।
4. पालतू जानवरों को सुरक्षित स्थान पर ले जाएं।`,
    kn: `🏠 ಸ್ಥಳಾಂತರ

1. ಪ್ರವಾಹದ ಎಚ್ಚರಿಕೆ ಬಂದ ತಕ್ಷಣ ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ತೆರಳಿ.
2. ಪ್ರಮುಖ ದಾಖಲೆಗಳು, ನಗದು ಮತ್ತು ಅಗತ್ಯ ಔಷಧಿಗಳನ್ನು ಕೊಂಡೊಯ್ಯಿರಿ.
3. ಮುಖ್ಯ ವಿದ್ಯುತ್ ಸ್ವಿಚ್ ಆಫ್ ಮಾಡಿ.
4. ಸಾಕು ಪ್ರಾಣಿಗಳನ್ನು ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ಸ್ಥಳಾಂತರಿಸಿ.`,
    mr: `🏠 स्थलांतरण

1. पुराचा इशारा मिळताच सुरक्षित ठिकाणी जा.
2. महत्वाची कागदपत्रे, रोख रक्कम आणि आवश्यक औषधे सोबत ठेवा.
3. मुख्य वीज स्विच बंद करा.
4. पाळीव प्राण्यांना सुरक्षित ठिकाणी हलवा.`,
    en: `🏠 Evacuation Checklist

1. Move to safe, elevated ground immediately upon flood warning.
2. Take important documents, cash, and essential medicines with you.
3. Turn off main electrical switches.
4. Move pets to safe location.`
  }
};

DOM.checklistBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.checklist;
    Logger.ui('📋 Checklist opened', { type });
    
    const lang = getLang();
    const checklist = CHECKLISTS[type];
    if (checklist) {
      const content = checklist[lang] || checklist.en;
      
      const titleText = lang === 'hi' ? '📋 चेकलिस्ट' :
                        lang === 'kn' ? '📋 ಪರಿಶೀಲನಾಪಟ್ಟಿ' :
                        lang === 'mr' ? '📋 तपासणी यादी' :
                        '📋 Checklist';
      
      DOM.checklistTitle.textContent = titleText;
      DOM.checklistContent.textContent = content;
      DOM.checklistDisplay.style.display = 'block';
      
      // Speak the checklist
      speakText(content);
    }
  });
});

DOM.closeChecklist.addEventListener('click', () => {
  DOM.checklistDisplay.style.display = 'none';
  Logger.ui('📋 Checklist closed');
});

// ============================================
// 👑 SARPANCH FUNCTIONS
// ============================================

function updateResilienceScore() {
  let score = 70;
  const history = AppState.soilHistory;
  
  if (history.length > 0) {
    const good = history.filter(h => h.ph >= 6.0 && h.ph <= 7.5).length;
    score += good * 3;
  }
  
  // Random factor for demo
  score += Math.floor(Math.random() * 10) - 5;
  score = Math.max(20, Math.min(100, score));
  
  DOM.scoreValue.textContent = score;
  DOM.scoreCircle.style.background = `conic-gradient(var(--gold) 0% ${score}%, var(--grey-light) ${score}% 100%)`;
  
  Logger.debug('👑 Resilience score updated', { score });
}

// Generate scheme
DOM.generateSchemeBtn.addEventListener('click', () => {
  Logger.ui('👑 Scheme generation clicked');
  
  const lang = getLang();
  const schemeName = lang === 'hi' ? 'कृषि चूना सब्सिडी योजना' :
                     lang === 'kn' ? 'ಕೃಷಿ ಸುಣ್ಣ ಸಬ್ಸಿಡಿ ಯೋಜನೆ' :
                     lang === 'mr' ? 'कृषी चुना अनुदान योजना' :
                     'Agricultural Lime Subsidy Scheme';
  
  const farmerText = lang === 'hi' ? '12 किसान' :
                     lang === 'kn' ? '12 ರೈತರು' :
                     lang === 'mr' ? '12 शेतकरी' :
                     '12 Farmers';
  
  const item = document.createElement('div');
  item.className = 'scheme-item';
  item.innerHTML = `
    <div>
      <strong>${schemeName}</strong>
      <small>${farmerText} • ₹2,40,000</small>
    </div>
    <span class="status submitted">${lang === 'hi' ? 'सबमिट' : lang === 'kn' ? 'ಸಲ್ಲಿಸಲಾಗಿದೆ' : lang === 'mr' ? 'सबमिट' : 'SUBMITTED'}</span>
  `;
  
  DOM.schemeItems.appendChild(item);
  
  const successMsg = lang === 'hi' ? '✅ योजना का आवेदन सफलतापूर्वक सबमिट किया गया' :
                     lang === 'kn' ? '✅ ಯೋಜನೆಯ ಅರ್ಜಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ' :
                     lang === 'mr' ? '✅ योजनेचा अर्ज यशस्वीरीत्या सबमिट केला गेला' :
                     '✅ Scheme application submitted successfully';
  
  showToast(successMsg, 'success');
  speakText(successMsg);
  Logger.success('👑 Scheme generated and submitted');
});

// ============================================
// 🔧 STATUS UPDATES
// ============================================

function updateStatus(status) {
  const lang = getLang();
  const labels = LANG_LABELS[lang];
  
  let text = labels.online;
  if (status === 'listening') text = labels.listening;
  else if (status === 'speaking') text = labels.speaking;
  
  DOM.statusBadge.textContent = text;
  Logger.debug('📊 Status updated', { status, text });
}

// ============================================
// 🍞 TOAST NOTIFICATIONS
// ============================================

let toastTimeout = null;

function showToast(message, type = 'info') {
  Logger.ui('🍞 Toast shown', { message, type });
  
  DOM.toastMessage.textContent = message;
  DOM.toast.style.display = 'block';
  DOM.toast.style.background = type === 'error' ? 'var(--red)' :
                               type === 'success' ? 'var(--green)' :
                               type === 'warning' ? 'var(--gold)' :
                               'var(--dark)';
  
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    DOM.toast.style.display = 'none';
  }, 3000);
}

// ============================================
// 🚪 LOGIN / LOGOUT
// ============================================

function login() {
  Logger.ui('🔐 Login attempt');
  
  const name = DOM.farmerName.value.trim() || 'Rajesh Kumar';
  const phone = DOM.phoneNumber.value.trim() || '9876543210';
  const pin = DOM.pinCode.value.trim() || '1234';
  
  Logger.debug('🔐 Login details', { name, phone, pinLength: pin.length });
  
  if (pin.length !== 4) {
    Logger.warning('⚠️ Invalid PIN length');
    showToast('Please enter a 4-digit PIN', 'error');
    return;
  }
  
  AppState.isLoggedIn = true;
  AppState.userName = name;
  AppState.phone = phone;
  
  DOM.userName.textContent = name.split(' ')[0];
  
  DOM.loginScreen.classList.remove('active');
  DOM.appScreen.classList.add('active');
  
  // Set greeting
  const greeting = LANG_LABELS[AppState.language].greeting;
  DOM.chatContainer.innerHTML = '';
  addMessage('Krishi Sakhi', greeting, false);
  
  // Load data
  renderHistory();
  updatePhDisplay();
  updateResilienceScore();
  updateStatus('online');
  
  saveState();
  
  Logger.success('✅ Login successful', { name, phone });
  showToast(`Welcome ${name}! 🌾`, 'success');
}

function logout() {
  Logger.ui('🚪 Logout');
  
  AppState.isLoggedIn = false;
  DOM.appScreen.classList.remove('active');
  DOM.loginScreen.classList.add('active');
  saveState();
  
  // Clear chat
  DOM.chatContainer.innerHTML = '';
  
  Logger.success('✅ Logout successful');
  showToast('Logged out successfully', 'info');
}

DOM.loginBtn.addEventListener('click', login);
DOM.logoutBtn.addEventListener('click', logout);

// Enter key on login
DOM.pinCode.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') login();
});
DOM.phoneNumber.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') login();
});
DOM.farmerName.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') login();
});

// ============================================
// 🧭 NAVIGATION
// ============================================

function navigateTo(screen) {
  Logger.ui('🧭 Navigating to', { screen });
  
  AppState.currentScreen = screen;
  
  DOM.navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.screen === screen);
  });
  
  document.querySelectorAll('.page').forEach(page => {
    page.classList.toggle('active', page.id === screen + 'Screen');
  });
  
  saveState();
  Logger.success('✅ Navigation complete', { screen });
}

DOM.navItems.forEach(item => {
  item.addEventListener('click', () => {
    navigateTo(item.dataset.screen);
  });
});

// ============================================
// ⚙️ SETTINGS
// ============================================

DOM.settingsBtn.addEventListener('click', () => {
  Logger.ui('⚙️ Settings opened');
  
  const lang = getLang();
  const langName = LANG_LABELS[lang].display;
  
  const msg = `⚙️ Settings\n\n` +
    `Language: ${langName}\n` +
    `User: ${AppState.userName}\n` +
    `Phone: ${AppState.phone}\n` +
    `Soil Scans: ${AppState.soilHistory.length}\n` +
    `Chat Messages: ${AppState.chatLog.length}\n` +
    `Version: 1.0.0`;
  
  alert(msg);
  Logger.info('⚙️ Settings displayed');
});

// ============================================
// 🎯 CHAT INPUT HANDLING
// ============================================

DOM.sendBtn.addEventListener('click', () => {
  const text = DOM.chatInput.value.trim();
  if (text) {
    Logger.ui('📤 Send button clicked');
    sendMessage(text);
  }
});

DOM.chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const text = DOM.chatInput.value.trim();
    if (text) {
      Logger.ui('📤 Enter key pressed');
      sendMessage(text);
    }
  }
});

// ============================================
// 🔄 SHORTCUTS
// ============================================

DOM.shortcuts.forEach(btn => {
  btn.addEventListener('click', () => {
    const query = btn.dataset.query;
    if (query) {
      Logger.ui('⚡ Shortcut clicked', { query });
      DOM.chatInput.value = query;
      sendMessage(query);
    }
  });
});

// ============================================
// 🌐 LANGUAGE BUTTONS
// ============================================

DOM.langBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    Logger.ui('🌐 Language button clicked', { lang });
    setLanguage(lang);
  });
});

DOM.qlangs.forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    Logger.ui('🌐 Quick language button clicked', { lang });
    setLanguage(lang);
  });
});

// ============================================
// 📱 INITIALIZATION
// ============================================

function init() {
  Logger.info('🚀 Initializing Mitti Ki Awaaz');
  
  // Hide loading screen
  setTimeout(() => {
    DOM.loadingScreen.classList.remove('active');
    Logger.success('✅ Loading screen hidden');
  }, 1500);
  
  // Load state
  const hasSavedState = loadState();
  
  // If logged in, show app
  if (AppState.isLoggedIn) {
    Logger.info('👤 User already logged in', { name: AppState.userName });
    DOM.loginScreen.classList.remove('active');
    DOM.appScreen.classList.add('active');
    DOM.userName.textContent = AppState.userName.split(' ')[0];
    
    // Set language
    setLanguage(AppState.language);
    
    // Load data
    renderHistory();
    updatePhDisplay();
    updateResilienceScore();
    updateStatus('online');
  } else {
    Logger.info('👤 User not logged in, showing login screen');
    // Set default language
    setLanguage('hi');
  }
  
  // Initialize speech
  initSpeechRecognition();
  
  // Load voices
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
      Logger.debug('🔊 Voices loaded');
    };
  }
  
  // Log environment info
  Logger.info('🌐 Environment info', {
    userAgent: navigator.userAgent,
    language: navigator.language,
    online: navigator.onLine,
    screen: `${window.innerWidth}x${window.innerHeight}`
  });
  
  // Check network status
  window.addEventListener('online', () => {
    Logger.success('📶 Network online');
    showToast('📶 Network connected', 'success');
  });
  
  window.addEventListener('offline', () => {
    Logger.warning('📶 Network offline - using fallback mode');
    showToast('📶 Network offline - using offline mode', 'warning');
  });
  
  AppState.isLoading = false;
  Logger.success('✅ Initialization complete!');
  console.log('🌾 Mitti Ki Awaaz initialized successfully!');
  console.log('📝 Use __logger.exportLogs() to export logs');
  console.log('🗑️ Use __logger.clear() to clear logs');
}

// ============================================
// 🛠️ DEV TOOLS HELPERS
// ============================================

// Expose useful functions globally for debugging
window.__app = {
  state: AppState,
  logger: Logger,
  sendMessage: sendMessage,
  speakText: speakText,
  setLanguage: setLanguage,
  navigateTo: navigateTo,
  exportLogs: () => Logger.exportLogs(),
  clearLogs: () => Logger.clear(),
  reload: () => {
    Logger.info('🔄 Reloading app state');
    loadState();
    renderHistory();
    updatePhDisplay();
    updateResilienceScore();
    Logger.success('✅ App reloaded');
  }
};

// ============================================
// 🚀 START APP
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  Logger.info('📄 DOM loaded');
  init();
});

// Handle page visibility changes (for speech)
document.addEventListener('visibilitychange', () => {
  if (document.hidden && AppState.isListening) {
    Logger.warning('👀 Page hidden, stopping speech recognition');
    stopListening();
  }
});

console.log('🌾 ==========================================');
console.log('🌾 MITTI KI AWAAZ - Krishi Sakhi');
console.log('🌾 Version 1.0.0');
console.log('🌾 ==========================================');
console.log('📘 Available commands:');
console.log('  __app.state        - View current state');
console.log('  __app.logger       - Access logger');
console.log('  __app.exportLogs() - Export logs');
console.log('  __app.clearLogs()  - Clear logs');
console.log('  __app.reload()     - Reload app state');
console.log('🌾 ==========================================');
