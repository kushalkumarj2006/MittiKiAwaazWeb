// ============================================
// MITTI KI AWAAZ - Complete Frontend Logic
// With Enhanced Console Logging for Easy Debugging
// ============================================

// ============================================
// 📝 LOGGING SYSTEM
// ============================================

const Logger = {
  levels: {
    INFO: { emoji: '📘', color: '#2196F3', label: 'INFO' },
    SUCCESS: { emoji: '✅', color: '#4CAF50', label: 'SUCCESS' },
    WARNING: { emoji: '⚠️', color: '#FF9800', label: 'WARNING' },
    ERROR: { emoji: '❌', color: '#F44336', label: 'ERROR' },
    DEBUG: { emoji: '🔍', color: '#9C27B0', label: 'DEBUG' },
    API: { emoji: '🌐', color: '#00BCD4', label: 'API' },
    SPEECH: { emoji: '🎤', color: '#E91E63', label: 'SPEECH' },
    STATE: { emoji: '📦', color: '#FF5722', label: 'STATE' },
    UI: { emoji: '🎨', color: '#8BC34A', label: 'UI' },
    FALLBACK: { emoji: '📋', color: '#FF9800', label: 'FALLBACK' }
  },

  log(level, message, data = null) {
    try {
      const levelInfo = this.levels[level] || this.levels.INFO;
      const timestamp = new Date().toLocaleTimeString('en-IN', { hour12: false });
      
      console.log(
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
      
      if (level === 'ERROR' && data?.stack) {
        console.error('Stack trace:', data.stack);
      }
      
      this._buffer.push({
        timestamp,
        level: levelInfo.label,
        message,
        data: data ? JSON.stringify(data) : null
      });
      
      if (this._buffer.length > 100) {
        this._buffer.shift();
      }
    } catch (e) {
      console.log(`[${level}] ${message}`, data || '');
    }
  },

  info(msg, data) { this.log('INFO', msg, data); },
  success(msg, data) { this.log('SUCCESS', msg, data); },
  warning(msg, data) { this.log('WARNING', msg, data); },
  error(msg, data) { this.log('ERROR', msg, data); },
  debug(msg, data) { this.log('DEBUG', msg, data); },
  api(msg, data) { this.log('API', msg, data); },
  speech(msg, data) { this.log('SPEECH', msg, data); },
  state(msg, data) { this.log('STATE', msg, data); },
  ui(msg, data) { this.log('UI', msg, data); },
  fallback(msg, data) { this.log('FALLBACK', msg, data); },

  _buffer: []
};

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

function loadState() {
  try {
    const saved = localStorage.getItem('mittiState');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(AppState, parsed);
      Logger.success('✅ State loaded successfully');
      return true;
    }
  } catch (e) {
    Logger.error('❌ Failed to load state', { error: e.message });
  }
  return false;
}

function saveState() {
  try {
    localStorage.setItem('mittiState', JSON.stringify(AppState));
  } catch (e) {
    Logger.error('❌ Failed to save state', { error: e.message });
  }
}

// ============================================
// 📱 DOM REFS
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

let DOM = {};

function initDOM() {
  DOM = {
    loadingScreen: $('loadingScreen'),
    loginScreen: $('loginScreen'),
    appScreen: $('appScreen'),
    loginBtn: $('loginBtn'),
    farmerName: $('farmerName'),
    phoneNumber: $('phoneNumber'),
    pinCode: $('pinCode'),
    langBtns: $$('.lang-btn'),
    userName: $('userName'),
    logoutBtn: $('logoutBtn'),
    settingsBtn: $('settingsBtn'),
    navItems: $$('.nav-item'),
    chatContainer: $('chatContainer'),
    chatInput: $('chatInput'),
    sendBtn: $('sendBtn'),
    micBtn: $('micBtn'),
    avatarPulse: $('avatarPulse'),
    statusBadge: $('statusBadge'),
    qlangs: $$('.qlang'),
    shortcuts: $$('.shortcut'),
    phChips: $$('.ph-chip'),
    phValue: $('phValue'),
    phLabel: $('phLabel'),
    phDisplay: $('phDisplay'),
    analyzeBtn: $('analyzeBtn'),
    soilResult: $('soilResult'),
    soilResultText: $('soilResultText'),
    speakResultBtn: $('speakResultBtn'),
    historyList: $('historyList'),
    ackBtns: $$('.ack-btn'),
    speakAlertBtns: $$('.speak-alert-btn'),
    checklistBtns: $$('.checklist-btn'),
    checklistDisplay: $('checklistDisplay'),
    checklistTitle: $('checklistTitle'),
    checklistContent: $('checklistContent'),
    closeChecklist: $('closeChecklist'),
    scoreValue: $('scoreValue'),
    scoreCircle: $('scoreCircle'),
    generateSchemeBtn: $('generateSchemeBtn'),
    schemeItems: $('schemeItems'),
    toast: $('toast'),
    toastMessage: $('toastMessage'),
    appTitle: $('appTitle')
  };
  
  Logger.success('✅ DOM initialized');
}

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
  return AppState.language || 'hi';
}

function getLangLabel() {
  return LANG_LABELS[getLang()] || LANG_LABELS.en;
}

// ============================================
// 🔄 LANGUAGE SWITCHING
// ============================================

function setLanguage(lang) {
  try {
    Logger.ui(`🌐 Switching language to: ${lang}`);
    AppState.language = lang;
    
    if (DOM.langBtns) {
      DOM.langBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
      });
    }
    
    if (DOM.qlangs) {
      DOM.qlangs.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
      });
    }
    
    updateUIText(lang);
    
    const greeting = LANG_LABELS[lang].greeting;
    if (DOM.chatContainer) {
      DOM.chatContainer.innerHTML = '';
      addMessage('Krishi Sakhi', greeting, false);
    }
    
    updateStatus('online');
    updateShortcuts(lang);
    saveState();
    
    Logger.success(`✅ Language switched to: ${LANG_LABELS[lang].display}`);
  } catch (e) {
    Logger.error('❌ Language switch error', { error: e.message });
  }
}

function updateUIText(lang) {
  try {
    document.querySelectorAll('[data-en]').forEach(el => {
      const text = el.dataset[lang];
      if (text) {
        if (el.tagName === 'INPUT') {
          el.placeholder = text;
        } else if (el.tagName === 'LABEL') {
          el.textContent = text;
        } else if (el.tagName === 'BUTTON' && !el.classList.contains('lang-btn') && !el.classList.contains('qlang')) {
          const childSpan = el.querySelector('span');
          if (childSpan) {
            const spanText = childSpan.dataset[lang];
            if (spanText) childSpan.textContent = spanText;
          } else {
            el.textContent = text;
          }
        } else {
          const children = el.children;
          if (children.length === 0) {
            el.textContent = text;
          } else if (el.tagName === 'DIV' || el.tagName === 'SPAN') {
            const textNodes = [];
            el.childNodes.forEach(node => {
              if (node.nodeType === Node.TEXT_NODE) {
                textNodes.push(node);
              }
            });
            if (textNodes.length > 0) {
              textNodes[0].textContent = text;
            }
          }
        }
      }
    });
    
    if (DOM.appTitle && DOM.appTitle.dataset) {
      const title = DOM.appTitle.dataset[lang] || 'Mitti Ki Awaaz';
      DOM.appTitle.textContent = title;
    }
  } catch (e) {
    Logger.error('❌ UI text update error', { error: e.message });
  }
}

function updateShortcuts(lang) {
  try {
    if (DOM.shortcuts) {
      DOM.shortcuts.forEach(btn => {
        const query = btn.dataset[`query-${lang}`];
        if (query) {
          btn.dataset.query = query;
        }
        const labelSpan = btn.querySelector('span');
        if (labelSpan && labelSpan.dataset) {
          const text = labelSpan.dataset[lang];
          if (text) {
            labelSpan.textContent = text;
          }
        }
      });
    }
  } catch (e) {
    Logger.error('❌ Shortcuts update error', { error: e.message });
  }
}

// ============================================
// 🎙️ SPEECH RECOGNITION
// ============================================

let recognition = null;

function initSpeechRecognition() {
  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      Logger.warning('⚠️ Speech recognition not supported');
      return false;
    }
    
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = getLangLabel().code;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      AppState.isListening = true;
      if (DOM.micBtn) {
        DOM.micBtn.classList.add('listening');
        DOM.micBtn.textContent = '⏹';
      }
      updateStatus('listening');
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      Logger.speech('🎤 Speech recognized', { transcript });
      stopListening();
      if (transcript.trim()) {
        if (DOM.chatInput) DOM.chatInput.value = transcript;
        sendMessage(transcript);
      }
    };
    
    recognition.onerror = (event) => {
      Logger.error('❌ Speech recognition error', { error: event.error });
      stopListening();
      showToast(`Error: ${event.error}`, 'error');
    };
    
    recognition.onend = () => {
      stopListening();
    };
    
    Logger.success('✅ Speech recognition initialized');
    return true;
  } catch (e) {
    Logger.error('❌ Speech init error', { error: e.message });
    return false;
  }
}

function startListening() {
  if (!recognition) {
    const initialized = initSpeechRecognition();
    if (!initialized) {
      showToast('Speech not supported', 'error');
      return;
    }
  }
  
  stopSpeaking();
  recognition.lang = getLangLabel().code;
  
  try {
    recognition.start();
  } catch (e) {
    Logger.error('❌ Failed to start speech', { error: e.message });
  }
}

function stopListening() {
  if (recognition) {
    try { recognition.stop(); } catch (e) {}
  }
  AppState.isListening = false;
  if (DOM.micBtn) {
    DOM.micBtn.classList.remove('listening');
    DOM.micBtn.textContent = '🎤';
  }
  updateStatus('online');
}

// ============================================
// 🔊 TEXT-TO-SPEECH
// ============================================

function speakText(text, lang = null) {
  if (!window.speechSynthesis) {
    Logger.warning('⚠️ Speech synthesis not supported');
    return;
  }
  
  try {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang || getLangLabel().code;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const nativeVoice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
    if (nativeVoice) utterance.voice = nativeVoice;
    
    utterance.onstart = () => {
      AppState.isSpeaking = true;
      updateStatus('speaking');
      if (DOM.avatarPulse) DOM.avatarPulse.style.animationDuration = '0.5s';
    };
    
    utterance.onend = () => {
      AppState.isSpeaking = false;
      updateStatus('online');
      if (DOM.avatarPulse) DOM.avatarPulse.style.animationDuration = '2.5s';
    };
    
    utterance.onerror = () => {
      AppState.isSpeaking = false;
      updateStatus('online');
      if (DOM.avatarPulse) DOM.avatarPulse.style.animationDuration = '2.5s';
    };
    
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    Logger.error('❌ Speech synthesis error', { error: e.message });
  }
}

function stopSpeaking() {
  if (window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
  AppState.isSpeaking = false;
  updateStatus('online');
  if (DOM.avatarPulse) DOM.avatarPulse.style.animationDuration = '2.5s';
}

// ============================================
// 💬 CHAT FUNCTIONS
// ============================================

function addMessage(sender, text, isUser = false) {
  try {
    if (!DOM.chatContainer) return;
    
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
    
    AppState.chatLog.push({ sender, text, timestamp: Date.now() });
    saveState();
  } catch (e) {
    Logger.error('❌ Add message error', { error: e.message });
  }
}

function showTyping() {
  try {
    if (!DOM.chatContainer) return;
    
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
  } catch (e) {
    Logger.error('❌ Typing indicator error', { error: e.message });
  }
}

function removeTyping() {
  try {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
  } catch (e) {}
}

async function sendMessage(text) {
  if (!text || !text.trim()) return;
  
  Logger.api('💬 Sending message', { text });
  
  addMessage('User', text, true);
  if (DOM.chatInput) DOM.chatInput.value = '';
  
  showTyping();
  
  try {
    const response = await callGeminiAPI(text);
    removeTyping();
    addMessage('Krishi Sakhi', response, false);
    speakText(response);
  } catch (error) {
    Logger.error('❌ Message error', { error: error.message });
    removeTyping();
    const errorMsg = getLang() === 'hi' ? 'क्षमा करें, कुछ गड़बड़ हो गई।' :
                     getLang() === 'kn' ? 'ಕ್ಷಮಿಸಿ, ಏನೋ ತಪ್ಪಾಗಿದೆ.' :
                     getLang() === 'mr' ? 'क्षमस्व, काहीतरी चूक झाली.' :
                     'Sorry, something went wrong.';
    addMessage('Krishi Sakhi', errorMsg, false);
  }
}

// ============================================
// 🌐 API CALLS
// ============================================

async function callGeminiAPI(message) {
  const lang = getLang();
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language: lang })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.response || getFallbackResponse(message, lang);
  } catch (error) {
    Logger.error('❌ API call failed', { error: error.message });
    return getFallbackResponse(message, lang);
  }
}

async function analyzeSoil(ph) {
  const lang = getLang();
  
  try {
    const response = await fetch('/api/soil-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ph, language: lang })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.response || getFallbackResponse('soil', lang);
  } catch (error) {
    Logger.error('❌ Soil analysis failed', { error: error.message });
    return getFallbackResponse('soil', lang);
  }
}

// ============================================
// 📋 FALLBACK RESPONSES
// ============================================

function getFallbackResponse(query, lang) {
  const fallbacks = {
    hi: {
      soil: '🌿 मिट्टी पीएच 5.8 है। 2.5 किलो चूना प्रति बीघा डालें। मूंगफली या सरसों बोएं।',
      weather: '🌦️ 5 दिन गर्मी रहेगी, शाम को हल्की बारिश।',
      scheme: '📋 पीएम-किसान योजना में ₹6000 सालाना मिलते हैं।',
      default: '👋 नमस्ते! मैं कृषि सखी हूँ। मिट्टी, मौसम, योजनाएं, फसल या भाव पूछें।'
    },
    kn: {
      soil: '🌿 ಮಣ್ಣಿನ pH 5.8. 2.5 ಕೆಜಿ ಸುಣ್ಣ ಬಳಸಿ.',
      weather: '🌦️ 5 ದಿನ ಬಿಸಿ, ಸಂಜೆ ಮಳೆ ಸಾಧ್ಯತೆ.',
      scheme: '📋 ಪಿಎಂ-ಕಿಸಾನ್ ₹6000/ವರ್ಷ.',
      default: '👋 ನಮಸ್ತೆ! ನಾನು ಕೃಷಿ ಸಖಿ.'
    },
    mr: {
      soil: '🌿 माती pH 5.8. 2.5 किलो चुना वापरा.',
      weather: '🌦️ 5 दिवस उष्णता, संध्याकाळी हलका पाऊस.',
      scheme: '📋 पीएम-किसान ₹6000/वर्ष.',
      default: '👋 नमस्कार! मी कृषी सखी.'
    },
    en: {
      soil: '🌿 Soil pH 5.8. Apply 2.5 kg lime per bigha.',
      weather: '🌦️ 5 days warm, evening showers.',
      scheme: '📋 PM-KISAN ₹6000/year.',
      default: '👋 Namaste! I am Krishi Sakhi.'
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
  if (q.includes('योजना') || q.includes('scheme') || q.includes('सब्सिडी')) {
    return langData.scheme;
  }
  
  return langData.default;
}

// ============================================
// 🧪 SOIL SCAN FUNCTIONS
// ============================================

function updatePhDisplay() {
  try {
    const ph = AppState.ph;
    if (DOM.phValue) DOM.phValue.textContent = ph.toFixed(1);
    
    let label = '';
    let color = '';
    const lang = getLang();
    
    if (ph < 5.5) {
      label = lang === 'hi' ? 'अत्यंत अम्लीय' : lang === 'kn' ? 'ಹೆಚ್ಚು ಆಮ್ಲೀಯ' : lang === 'mr' ? 'अत्यंत आम्लयुक्त' : 'Highly Acidic';
      color = '#D84315';
    } else if (ph < 6.5) {
      label = lang === 'hi' ? 'मध्यम अम्लीय' : lang === 'kn' ? 'ಮಧ್ಯಮ ಆಮ್ಲೀಯ' : lang === 'mr' ? 'मध्यम आम्लयुक्त' : 'Moderately Acidic';
      color = '#E8A838';
    } else if (ph < 7.5) {
      label = lang === 'hi' ? 'उत्तम उदासीन' : lang === 'kn' ? 'ತಟಸ್ಥ' : lang === 'mr' ? 'उदासीन' : 'Optimal Neutral';
      color = '#2E7D32';
    } else {
      label = lang === 'hi' ? 'क्षारीय' : lang === 'kn' ? 'ಕ್ಷಾರೀಯ' : lang === 'mr' ? 'क्षारयुक्त' : 'Alkaline';
      color = '#3F51B5';
    }
    
    if (DOM.phLabel) DOM.phLabel.textContent = label;
    if (DOM.phDisplay) {
      DOM.phDisplay.style.background = color + '22';
      DOM.phDisplay.style.border = `2px solid ${color}`;
    }
  } catch (e) {
    Logger.error('❌ pH display update error', { error: e.message });
  }
}

function renderHistory() {
  try {
    if (!DOM.historyList) return;
    
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
  } catch (e) {
    Logger.error('❌ History render error', { error: e.message });
  }
}

// ============================================
// 👑 SARPANCH FUNCTIONS
// ============================================

function updateResilienceScore() {
  try {
    let score = 70;
    const history = AppState.soilHistory;
    
    if (history.length > 0) {
      const good = history.filter(h => h.ph >= 6.0 && h.ph <= 7.5).length;
      score += good * 3;
    }
    
    score += Math.floor(Math.random() * 10) - 5;
    score = Math.max(20, Math.min(100, score));
    
    if (DOM.scoreValue) DOM.scoreValue.textContent = score;
    if (DOM.scoreCircle) {
      DOM.scoreCircle.style.background = `conic-gradient(var(--gold) 0% ${score}%, var(--grey-light) ${score}% 100%)`;
    }
  } catch (e) {
    Logger.error('❌ Score update error', { error: e.message });
  }
}

// ============================================
// 🔧 STATUS UPDATES
// ============================================

function updateStatus(status) {
  try {
    const lang = getLang();
    const labels = LANG_LABELS[lang];
    
    let text = labels.online;
    if (status === 'listening') text = labels.listening;
    else if (status === 'speaking') text = labels.speaking;
    
    if (DOM.statusBadge) DOM.statusBadge.textContent = text;
  } catch (e) {}
}

// ============================================
// 🍞 TOAST NOTIFICATIONS
// ============================================

let toastTimeout = null;

function showToast(message, type = 'info') {
  try {
    if (!DOM.toast || !DOM.toastMessage) return;
    
    DOM.toastMessage.textContent = message;
    DOM.toast.style.display = 'block';
    DOM.toast.style.background = type === 'error' ? '#D84315' :
                                 type === 'success' ? '#2E7D32' :
                                 type === 'warning' ? '#E8A838' :
                                 '#1A1A2E';
    
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      if (DOM.toast) DOM.toast.style.display = 'none';
    }, 3000);
  } catch (e) {}
}

// ============================================
// 🚪 LOGIN / LOGOUT
// ============================================

function login() {
  try {
    const name = DOM.farmerName ? DOM.farmerName.value.trim() || 'Rajesh Kumar' : 'Rajesh Kumar';
    const phone = DOM.phoneNumber ? DOM.phoneNumber.value.trim() || '9876543210' : '9876543210';
    const pin = DOM.pinCode ? DOM.pinCode.value.trim() || '1234' : '1234';
    
    if (pin.length !== 4) {
      showToast('Please enter a 4-digit PIN', 'error');
      return;
    }
    
    AppState.isLoggedIn = true;
    AppState.userName = name;
    AppState.phone = phone;
    
    if (DOM.userName) DOM.userName.textContent = name.split(' ')[0];
    
    // Show app, hide login
    if (DOM.loginScreen) {
      DOM.loginScreen.classList.remove('active');
      DOM.loginScreen.style.display = 'none';
    }
    if (DOM.appScreen) {
      DOM.appScreen.classList.add('active');
      DOM.appScreen.style.display = 'flex';
    }
    
    const greeting = LANG_LABELS[AppState.language].greeting;
    if (DOM.chatContainer) {
      DOM.chatContainer.innerHTML = '';
      addMessage('Krishi Sakhi', greeting, false);
    }
    
    renderHistory();
    updatePhDisplay();
    updateResilienceScore();
    updateStatus('online');
    saveState();
    
    showToast(`Welcome ${name}! 🌾`, 'success');
    Logger.success('✅ Login successful');
  } catch (e) {
    Logger.error('❌ Login error', { error: e.message });
  }
}

function logout() {
  try {
    AppState.isLoggedIn = false;
    if (DOM.appScreen) {
      DOM.appScreen.classList.remove('active');
      DOM.appScreen.style.display = 'none';
    }
    if (DOM.loginScreen) {
      DOM.loginScreen.classList.add('active');
      DOM.loginScreen.style.display = 'flex';
    }
    if (DOM.chatContainer) DOM.chatContainer.innerHTML = '';
    saveState();
    showToast('Logged out successfully', 'info');
    Logger.success('✅ Logout successful');
  } catch (e) {
    Logger.error('❌ Logout error', { error: e.message });
  }
}

// ============================================
// 🧭 NAVIGATION
// ============================================

function navigateTo(screen) {
  try {
    AppState.currentScreen = screen;
    
    if (DOM.navItems) {
      DOM.navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.screen === screen);
      });
    }
    
    document.querySelectorAll('.page').forEach(page => {
      page.classList.toggle('active', page.id === screen + 'Screen');
    });
    
    saveState();
  } catch (e) {
    Logger.error('❌ Navigation error', { error: e.message });
  }
}

// ============================================
// 📱 INITIALIZATION
// ============================================

function init() {
  try {
    Logger.info('🚀 Initializing Mitti Ki Awaaz');
    
    // Initialize DOM references
    initDOM();
    
    // Hide loading screen and show login
    setTimeout(() => {
      if (DOM.loadingScreen) {
        DOM.loadingScreen.classList.remove('active');
        DOM.loadingScreen.style.display = 'none';
        Logger.success('✅ Loading screen hidden');
      }
      
      // Show login screen by default
      if (DOM.loginScreen) {
        DOM.loginScreen.classList.add('active');
        DOM.loginScreen.style.display = 'flex';
        Logger.success('✅ Login screen shown');
      }
      
      // Hide app screen initially
      if (DOM.appScreen) {
        DOM.appScreen.classList.remove('active');
        DOM.appScreen.style.display = 'none';
      }
    }, 1500);
    
    // Load state
    loadState();
    
    // If logged in, show app instead
    if (AppState.isLoggedIn) {
      Logger.info('👤 User already logged in');
      setTimeout(() => {
        if (DOM.loginScreen) {
          DOM.loginScreen.classList.remove('active');
          DOM.loginScreen.style.display = 'none';
        }
        if (DOM.appScreen) {
          DOM.appScreen.classList.add('active');
          DOM.appScreen.style.display = 'flex';
        }
        if (DOM.userName) DOM.userName.textContent = AppState.userName.split(' ')[0];
        
        setLanguage(AppState.language);
        renderHistory();
        updatePhDisplay();
        updateResilienceScore();
        updateStatus('online');
        
        const greeting = LANG_LABELS[AppState.language].greeting;
        if (DOM.chatContainer) {
          DOM.chatContainer.innerHTML = '';
          addMessage('Krishi Sakhi', greeting, false);
        }
        
        Logger.success('✅ App loaded for logged in user');
      }, 2000);
    } else {
      // Set default language for login screen
      setLanguage('hi');
    }
    
    // Initialize speech
    initSpeechRecognition();
    
    // Load voices
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    
    // ============================================
    // 🎯 EVENT LISTENERS
    // ============================================
    
    // Login
    if (DOM.loginBtn) {
      DOM.loginBtn.addEventListener('click', login);
    }
    
    // Logout
    if (DOM.logoutBtn) {
      DOM.logoutBtn.addEventListener('click', logout);
    }
    
    // Settings    if (DOM.settingsBtn) {
      DOM.settingsBtn.addEventListener('click', () => {
        const lang = getLang();
        const langName = LANG_LABELS[lang].display;
        alert(`⚙️ Settings\n\nLanguage: ${langName}\nUser: ${AppState.userName}\nPhone: ${AppState.phone}\nScans: ${AppState.soilHistory.length}`);
      });
    }
    
    // Send message
    if (DOM.sendBtn) {
      DOM.sendBtn.addEventListener('click', () => {
        const text = DOM.chatInput ? DOM.chatInput.value.trim() : '';
        if (text) sendMessage(text);
      });
    }
    
    // Chat input enter key
    if (DOM.chatInput) {
      DOM.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const text = DOM.chatInput.value.trim();
          if (text) sendMessage(text);
        }
      });
    }
    
    // Mic button
    if (DOM.micBtn) {
      DOM.micBtn.addEventListener('click', () => {
        if (AppState.isListening) {
          stopListening();
        } else {
          startListening();
        }
      });
    }
    
    // Navigation
    if (DOM.navItems) {
      DOM.navItems.forEach(item => {
        item.addEventListener('click', () => {
          navigateTo(item.dataset.screen);
        });
      });
    }
    
    // Language buttons
    if (DOM.langBtns) {
      DOM.langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          setLanguage(btn.dataset.lang);
        });
      });
    }
    
    // Quick language buttons
    if (DOM.qlangs) {
      DOM.qlangs.forEach(btn => {
        btn.addEventListener('click', () => {
          setLanguage(btn.dataset.lang);
        });
      });
    }
    
    // Shortcuts
    if (DOM.shortcuts) {
      DOM.shortcuts.forEach(btn => {
        btn.addEventListener('click', () => {
          const query = btn.dataset.query;
          if (query) {
            if (DOM.chatInput) DOM.chatInput.value = query;
            sendMessage(query);
          }
        });
      });
    }
    
    // pH chips
    if (DOM.phChips) {
      DOM.phChips.forEach(chip => {
        chip.addEventListener('click', () => {
          DOM.phChips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          AppState.ph = parseFloat(chip.dataset.ph);
          updatePhDisplay();
          saveState();
        });
      });
    }
    
    // Analyze soil
    if (DOM.analyzeBtn) {
      DOM.analyzeBtn.addEventListener('click', async () => {
        const ph = AppState.ph;
        if (DOM.soilResult) DOM.soilResult.style.display = 'block';
        if (DOM.soilResultText) {
          DOM.soilResultText.textContent = '⏳ Analyzing...';
        }
        
        try {
          const response = await analyzeSoil(ph);
          if (DOM.soilResultText) DOM.soilResultText.textContent = response;
          
          AppState.soilHistory.push({
            ph: ph,
            result: response,
            timestamp: new Date().toISOString()
          });
          saveState();
          renderHistory();
          speakText(response);
        } catch (e) {
          Logger.error('❌ Soil analysis error', { error: e.message });
        }
      });
    }
    
    // Speak result
    if (DOM.speakResultBtn) {
      DOM.speakResultBtn.addEventListener('click', () => {
        const text = DOM.soilResultText ? DOM.soilResultText.textContent : '';
        if (text && !text.includes('⏳')) {
          speakText(text);
        }
      });
    }
    
    // Acknowledge alerts
    if (DOM.ackBtns) {
      DOM.ackBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          btn.textContent = '✅ Received';
          btn.disabled = true;
          btn.style.opacity = '0.5';
          showToast('Alert acknowledged ✅', 'success');
        });
      });
    }
    
    // Speak alerts
    if (DOM.speakAlertBtns) {
      DOM.speakAlertBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const alertId = btn.dataset.alert;
          const card = document.getElementById(alertId + 'Alert');
          if (card) {
            const msg = card.querySelector('.alert-message');
            if (msg) speakText(msg.textContent);
          }
        });
      });
    }
    
    // Checklists
    const CHECKLISTS = {
      livestock: {
        hi: '🐮 मवेशी सुरक्षा:\n1. ऊंचे स्थान पर ले जाएं\n2. 3 दिन का चारा रखें',
        en: '🐮 Livestock Safety:\n1. Move to high ground\n2. Keep 3 days fodder'
      },
      crops: {
        hi: '🌾 फसल सुरक्षा:\n1. नालियां साफ करें\n2. 90% पकी फसल काटें',
        en: '🌾 Crop Safety:\n1. Clear drains\n2. Harvest 90% ripe crops'
      },
      evacuation: {
        hi: '🏠 स्थानांतरण:\n1. सुरक्षित स्थान पर जाएं\n2. दस्तावेज साथ रखें',
        en: '🏠 Evacuation:\n1. Move to safe place\n2. Take documents'
      }
    };
    
    if (DOM.checklistBtns) {
      DOM.checklistBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const type = btn.dataset.checklist;
          const checklist = CHECKLISTS[type];
          if (checklist) {
            const lang = getLang();
            const content = checklist[lang] || checklist.en;
            if (DOM.checklistTitle) {
              DOM.checklistTitle.textContent = '📋 Checklist';
            }
            if (DOM.checklistContent) {
              DOM.checklistContent.textContent = content;
            }
            if (DOM.checklistDisplay) {
              DOM.checklistDisplay.style.display = 'block';
            }
            speakText(content);
          }
        });
      });
    }
    
    // Close checklist
    if (DOM.closeChecklist) {
      DOM.closeChecklist.addEventListener('click', () => {
        if (DOM.checklistDisplay) DOM.checklistDisplay.style.display = 'none';
      });
    }
    
    // Generate scheme
    if (DOM.generateSchemeBtn) {
      DOM.generateSchemeBtn.addEventListener('click', () => {
        const lang = getLang();
        const schemeName = lang === 'hi' ? 'कृषि चूना सब्सिडी योजना' :
                           lang === 'kn' ? 'ಕೃಷಿ ಸುಣ್ಣ ಸಬ್ಸಿಡಿ ಯೋಜನೆ' :
                           lang === 'mr' ? 'कृषी चुना अनुदान योजना' :
                           'Agricultural Lime Subsidy Scheme';
        
        if (DOM.schemeItems) {
          const item = document.createElement('div');
          item.className = 'scheme-item';
          item.innerHTML = `
            <div>
              <strong>${schemeName}</strong>
              <small>12 Farmers • ₹2,40,000</small>
            </div>
            <span class="status submitted">${lang === 'hi' ? 'सबमिट' : lang === 'kn' ? 'ಸಲ್ಲಿಸಲಾಗಿದೆ' : lang === 'mr' ? 'सबमिट' : 'SUBMITTED'}</span>
          `;
          DOM.schemeItems.appendChild(item);
        }
        
        const msg = '✅ Scheme submitted successfully!';
        showToast(msg, 'success');
        speakText(msg);
      });
    }
    
    // Network status
    window.addEventListener('online', () => {
      showToast('📶 Network connected', 'success');
    });
    
    window.addEventListener('offline', () => {
      showToast('📶 Offline mode', 'warning');
    });
    
    // Enter key on login
    if (DOM.pinCode) {
      DOM.pinCode.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') login();
      });
    }
    if (DOM.phoneNumber) {
      DOM.phoneNumber.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') login();
      });
    }
    if (DOM.farmerName) {
      DOM.farmerName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') login();
      });
    }
    
    AppState.isLoading = false;
    Logger.success('✅ Initialization complete!');
    console.log('🌾 Mitti Ki Awaaz is ready!');
    
  } catch (e) {
    Logger.error('💥 Fatal initialization error', { error: e.message, stack: e.stack });
    document.body.innerHTML = `
      <div style="padding:20px;text-align:center;font-family:sans-serif;max-width:480px;margin:0 auto;margin-top:50px;">
        <h2 style="color:#2E7D32;">🌾 Mitti Ki Awaaz</h2>
        <p style="color:#D84315;margin:20px 0;">⚠️ ${e.message}</p>
        <p style="font-size:12px;color:#666;">Please check the console for details</p>
        <button onclick="location.reload()" style="padding:12px 24px;margin-top:16px;background:#2E7D32;color:white;border:none;border-radius:8px;cursor:pointer;font-size:16px;">Reload</button>
      </div>
    `;
  }
}

// ============================================
// 🚀 START APP
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

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

// Expose useful functions globally
window.__app = {
  state: AppState,
  logger: Logger,
  sendMessage: sendMessage,
  speakText: speakText,
  setLanguage: setLanguage,
  navigateTo: navigateTo,
  login: login,
  logout: logout,
  exportLogs: () => Logger._buffer,
  clearLogs: () => { Logger._buffer = []; console.clear(); },
  reload: () => {
    Logger.info('🔄 Reloading app state');
    loadState();
    renderHistory();
    updatePhDisplay();
    updateResilienceScore();
    Logger.success('✅ App reloaded');
  }
};
