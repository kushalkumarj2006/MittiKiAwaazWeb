// ============================================
// MITTI KI AWAAZ - Complete Working Script
// ============================================

// ============================================
// SIMPLE LOGGER
// ============================================
const Logger = {
  info: (msg, data) => console.log(`📘 ${msg}`, data || ''),
  success: (msg, data) => console.log(`✅ ${msg}`, data || ''),
  error: (msg, data) => console.log(`❌ ${msg}`, data || ''),
  warning: (msg, data) => console.log(`⚠️ ${msg}`, data || ''),
  debug: (msg, data) => console.log(`🔍 ${msg}`, data || '')
};

// ============================================
// STATE
// ============================================
const AppState = {
  language: 'hi',
  isLoggedIn: false,
  userName: 'Rajesh Kumar',
  phone: '9876543210',
  currentScreen: 'voice',
  ph: 5.8,
  soilHistory: [],
  chatLog: [],
  isListening: false,
  isSpeaking: false
};

// ============================================
// DOM HELPERS
// ============================================
function $(id) { return document.getElementById(id); }
function $$(sel) { return document.querySelectorAll(sel); }

// ============================================
// LANGUAGE DATA
// ============================================
const LANG = {
  hi: {
    code: 'hi-IN',
    greeting: '👋 नमस्ते! मैं कृषि सखी हूँ। आज आपके खेत का क्या हाल है?',
    online: '● ऑनलाइन'
  },
  kn: {
    code: 'kn-IN',
    greeting: '👋 ನಮಸ್ತೆ! ನಾನು ಕೃಷಿ ಸಖಿ. ಇಂದು ನಿಮ್ಮ ಹೊಲದ ಸ್ಥಿತಿ ಹೇಗಿದೆ?',
    online: '● ಆನ್ಲೈನ್'
  },
  mr: {
    code: 'mr-IN',
    greeting: '👋 नमस्कार! मी कृषी सखी आहे. आज तुमच्या शेताची काय परिस्थिती आहे?',
    online: '● ऑनलाइन'
  },
  en: {
    code: 'en-IN',
    greeting: '👋 Namaste! I am Krishi Sakhi. How is your field today?',
    online: '● Online'
  }
};

function getLang() { return AppState.language || 'hi'; }

// ============================================
// DOM REFS
// ============================================
const DOM = {};

function initDOM() {
  DOM.loadingScreen = $('loadingScreen');
  DOM.loginScreen = $('loginScreen');
  DOM.appScreen = $('appScreen');
  DOM.loginBtn = $('loginBtn');
  DOM.farmerName = $('farmerName');
  DOM.phoneNumber = $('phoneNumber');
  DOM.pinCode = $('pinCode');
  DOM.langBtns = $$('.lang-btn');
  DOM.userName = $('userName');
  DOM.logoutBtn = $('logoutBtn');
  DOM.settingsBtn = $('settingsBtn');
  DOM.navItems = $$('.nav-item');
  DOM.chatContainer = $('chatContainer');
  DOM.chatInput = $('chatInput');
  DOM.sendBtn = $('sendBtn');
  DOM.micBtn = $('micBtn');
  DOM.statusBadge = $('statusBadge');
  DOM.qlangs = $$('.qlang');
  DOM.shortcuts = $$('.shortcut');
  DOM.phChips = $$('.ph-chip');
  DOM.phValue = $('phValue');
  DOM.phLabel = $('phLabel');
  DOM.phDisplay = $('phDisplay');
  DOM.analyzeBtn = $('analyzeBtn');
  DOM.soilResult = $('soilResult');
  DOM.soilResultText = $('soilResultText');
  DOM.historyList = $('historyList');
  DOM.scoreValue = $('scoreValue');
  DOM.scoreCircle = $('scoreCircle');
  DOM.generateSchemeBtn = $('generateSchemeBtn');
  DOM.schemeItems = $('schemeItems');
  DOM.toast = $('toast');
  DOM.toastMessage = $('toastMessage');
  DOM.ackBtns = $$('.ack-btn');
  DOM.checklistBtns = $$('.checklist-btn');
  DOM.checklistDisplay = $('checklistDisplay');
  DOM.checklistContent = $('checklistContent');
  DOM.closeChecklist = $('closeChecklist');
}

// ============================================
// SHOW/HIDE SCREENS
// ============================================
function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  
  // Show target screen
  const screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.add('active');
    screen.style.display = 'flex';
    Logger.success(`✅ Showing screen: ${screenId}`);
  } else {
    Logger.error(`❌ Screen not found: ${screenId}`);
  }
}

// ============================================
// LANGUAGE
// ============================================
function setLanguage(lang) {
  AppState.language = lang;
  
  DOM.langBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  DOM.qlangs.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // Update greeting
  if (DOM.chatContainer) {
    DOM.chatContainer.innerHTML = '';
    addMessage('Krishi Sakhi', LANG[lang].greeting, false);
  }
  
  if (DOM.statusBadge) {
    DOM.statusBadge.textContent = LANG[lang].online;
  }
  
  // Update shortcuts
  DOM.shortcuts.forEach(btn => {
    const query = btn.dataset[`query-${lang}`];
    if (query) btn.dataset.query = query;
    const span = btn.querySelector('span');
    if (span && span.dataset[lang]) {
      span.textContent = span.dataset[lang];
    }
  });
  
  localStorage.setItem('mittiLang', lang);
  Logger.success(`✅ Language set to: ${lang}`);
}

// ============================================
// CHAT
// ============================================
function addMessage(sender, text, isUser = false) {
  if (!DOM.chatContainer) return;
  
  const div = document.createElement('div');
  div.className = `message ${isUser ? 'user' : 'ai'}`;
  
  if (!isUser) {
    div.innerHTML = `<div class="msg-avatar">🌾</div><div class="msg-bubble">${text}</div>`;
  } else {
    div.innerHTML = `<div class="msg-avatar">👤</div><div class="msg-bubble">${text}</div>`;
  }
  
  DOM.chatContainer.appendChild(div);
  DOM.chatContainer.scrollTop = DOM.chatContainer.scrollHeight;
}

function showTyping() {
  const existing = document.getElementById('typingIndicator');
  if (existing) existing.remove();
  
  const div = document.createElement('div');
  div.className = 'message ai';
  div.id = 'typingIndicator';
  div.innerHTML = `<div class="msg-avatar">🌾</div><div class="msg-bubble">⏳ Thinking...</div>`;
  DOM.chatContainer.appendChild(div);
  DOM.chatContainer.scrollTop = DOM.chatContainer.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

async function sendMessage(text) {
  if (!text || !text.trim()) return;
  
  addMessage('User', text, true);
  if (DOM.chatInput) DOM.chatInput.value = '';
  
  showTyping();
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, language: getLang() })
    });
    
    const data = await response.json();
    removeTyping();
    addMessage('Krishi Sakhi', data.response || 'Sorry, no response', false);
    speakText(data.response || 'Sorry, no response');
  } catch (e) {
    removeTyping();
    addMessage('Krishi Sakhi', 'Sorry, something went wrong. Please try again.', false);
  }
}

// ============================================
// SPEECH
// ============================================
let recognition = null;

function speakText(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG[getLang()].code || 'hi-IN';
  window.speechSynthesis.speak(utterance);
}

function initSpeech() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  
  recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = LANG[getLang()].code || 'hi-IN';
  
  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    if (DOM.chatInput) DOM.chatInput.value = text;
    sendMessage(text);
  };
  
  recognition.onerror = () => {
    if (DOM.micBtn) DOM.micBtn.classList.remove('listening');
  };
  
  recognition.onend = () => {
    if (DOM.micBtn) DOM.micBtn.classList.remove('listening');
  };
}

function toggleListening() {
  if (!recognition) {
    showToast('Speech not supported', 'error');
    return;
  }
  
  if (AppState.isListening) {
    recognition.stop();
    AppState.isListening = false;
    if (DOM.micBtn) DOM.micBtn.classList.remove('listening');
    return;
  }
  
  recognition.lang = LANG[getLang()].code || 'hi-IN';
  recognition.start();
  AppState.isListening = true;
  if (DOM.micBtn) DOM.micBtn.classList.add('listening');
}

// ============================================
// SOIL
// ============================================
function updatePhDisplay() {
  const ph = AppState.ph;
  if (DOM.phValue) DOM.phValue.textContent = ph.toFixed(1);
  
  let label = '';
  let color = '';
  
  if (ph < 5.5) { label = 'अत्यंत अम्लीय'; color = '#D84315'; }
  else if (ph < 6.5) { label = 'मध्यम अम्लीय'; color = '#E8A838'; }
  else if (ph < 7.5) { label = 'उत्तम उदासीन'; color = '#2E7D32'; }
  else { label = 'क्षारीय'; color = '#3F51B5'; }
  
  if (DOM.phLabel) DOM.phLabel.textContent = label;
  if (DOM.phDisplay) {
    DOM.phDisplay.style.background = color + '22';
    DOM.phDisplay.style.border = `2px solid ${color}`;
  }
}

async function analyzeSoil() {
  const ph = AppState.ph;
  if (DOM.soilResult) DOM.soilResult.style.display = 'block';
  if (DOM.soilResultText) DOM.soilResultText.textContent = '⏳ Analyzing...';
  
  try {
    const response = await fetch('/api/soil-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ph, language: getLang() })
    });
    const data = await response.json();
    if (DOM.soilResultText) DOM.soilResultText.textContent = data.response || 'Analysis complete';
    speakText(data.response || 'Analysis complete');
  } catch (e) {
    if (DOM.soilResultText) DOM.soilResultText.textContent = 'Error analyzing soil. Please try again.';
  }
}

// ============================================
// TOAST
// ============================================
let toastTimer = null;

function showToast(msg, type = 'info') {
  if (!DOM.toast || !DOM.toastMessage) return;
  
  DOM.toastMessage.textContent = msg;
  DOM.toast.style.display = 'block';
  DOM.toast.style.background = type === 'error' ? '#D84315' : 
                               type === 'success' ? '#2E7D32' : 
                               '#1A1A2E';
  
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    if (DOM.toast) DOM.toast.style.display = 'none';
  }, 3000);
}

// ============================================
// LOGIN / LOGOUT
// ============================================
function login() {
  const name = DOM.farmerName ? DOM.farmerName.value.trim() || 'Rajesh Kumar' : 'Rajesh Kumar';
  const pin = DOM.pinCode ? DOM.pinCode.value.trim() || '1234' : '1234';
  
  if (pin.length !== 4) {
    showToast('Please enter 4-digit PIN', 'error');
    return;
  }
  
  AppState.isLoggedIn = true;
  AppState.userName = name;
  
  if (DOM.userName) DOM.userName.textContent = name.split(' ')[0];
  
  // Switch to app
  showScreen('appScreen');
  
  // Set greeting
  if (DOM.chatContainer) {
    DOM.chatContainer.innerHTML = '';
    addMessage('Krishi Sakhi', LANG[getLang()].greeting, false);
  }
  
  updatePhDisplay();
  showToast(`Welcome ${name}! 🌾`, 'success');
  Logger.success('✅ Login successful');
  
  // Save state
  localStorage.setItem('mittiLoggedIn', 'true');
  localStorage.setItem('mittiUser', name);
}

function logout() {
  AppState.isLoggedIn = false;
  showScreen('loginScreen');
  localStorage.removeItem('mittiLoggedIn');
  localStorage.removeItem('mittiUser');
  showToast('Logged out', 'info');
  Logger.success('✅ Logout successful');
}

// ============================================
// NAVIGATION
// ============================================
function navigateTo(screen) {
  AppState.currentScreen = screen;
  
  DOM.navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.screen === screen);
  });
  
  document.querySelectorAll('.page').forEach(page => {
    page.classList.toggle('active', page.id === screen + 'Screen');
  });
}

// ============================================
// CHECKLISTS
// ============================================
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

// ============================================
// INIT - THE MAIN FUNCTION
// ============================================
function init() {
  console.log('🌾 Mitti Ki Awaaz - Starting...');
  
  // 1. Init DOM
  initDOM();
  
  // 2. Set language from localStorage
  const savedLang = localStorage.getItem('mittiLang') || 'hi';
  setLanguage(savedLang);
  
  // 3. Check if user is logged in
  const loggedIn = localStorage.getItem('mittiLoggedIn') === 'true';
  const savedUser = localStorage.getItem('mittiUser') || 'Rajesh Kumar';
  
  // 4. SHOW LOADING SCREEN FIRST
  showScreen('loadingScreen');
  
  // 5. After 2 seconds, show login or app
  setTimeout(() => {
    if (loggedIn) {
      // User is logged in - show app
      AppState.isLoggedIn = true;
      AppState.userName = savedUser;
      if (DOM.userName) DOM.userName.textContent = savedUser.split(' ')[0];
      
      showScreen('appScreen');
      
      // Set greeting
      if (DOM.chatContainer) {
        DOM.chatContainer.innerHTML = '';
        addMessage('Krishi Sakhi', LANG[getLang()].greeting, false);
      }
      
      updatePhDisplay();
      Logger.success('✅ App loaded for logged in user');
    } else {
      // Show login screen
      showScreen('loginScreen');
      Logger.success('✅ Login screen shown');
    }
  }, 2000);
  
  // 6. Setup event listeners
  setupEvents();
  
  // 7. Init speech
  initSpeech();
  
  // 8. Load voices
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
  
  console.log('🌾 Mitti Ki Awaaz - Ready!');
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEvents() {
  // Login
  if (DOM.loginBtn) DOM.loginBtn.addEventListener('click', login);
  
  // Enter key on login
  [DOM.pinCode, DOM.phoneNumber, DOM.farmerName].forEach(el => {
    if (el) el.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') login();
    });
  });
  
  // Logout
  if (DOM.logoutBtn) DOM.logoutBtn.addEventListener('click', logout);
  
  // Settings
  if (DOM.settingsBtn) {
    DOM.settingsBtn.addEventListener('click', () => {
      alert(`⚙️ Settings\n\nLanguage: ${getLang()}\nUser: ${AppState.userName}`);
    });
  }
  
  // Language buttons
  DOM.langBtns.forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  
  DOM.qlangs.forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  
  // Send message
  if (DOM.sendBtn) {
    DOM.sendBtn.addEventListener('click', () => {
      const text = DOM.chatInput ? DOM.chatInput.value.trim() : '';
      if (text) sendMessage(text);
    });
  }
  
  if (DOM.chatInput) {
    DOM.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const text = DOM.chatInput.value.trim();
        if (text) sendMessage(text);
      }
    });
  }
  
  // Mic
  if (DOM.micBtn) DOM.micBtn.addEventListener('click', toggleListening);
  
  // Navigation
  DOM.navItems.forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.screen));
  });
  
  // Shortcuts
  DOM.shortcuts.forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.dataset.query;
      if (query) sendMessage(query);
    });
  });
  
  // pH chips
  DOM.phChips.forEach(chip => {
    chip.addEventListener('click', () => {
      DOM.phChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      AppState.ph = parseFloat(chip.dataset.ph);
      updatePhDisplay();
    });
  });
  
  // Analyze soil
  if (DOM.analyzeBtn) DOM.analyzeBtn.addEventListener('click', analyzeSoil);
  
  // Acknowledge alerts
  DOM.ackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.textContent = '✅ Received';
      btn.disabled = true;
      btn.style.opacity = '0.5';
      showToast('Alert acknowledged ✅', 'success');
    });
  });
  
  // Checklists
  DOM.checklistBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.checklist;
      const list = CHECKLISTS[type];
      if (list && DOM.checklistContent) {
        const lang = getLang();
        DOM.checklistContent.textContent = list[lang] || list.en;
        if (DOM.checklistDisplay) DOM.checklistDisplay.style.display = 'block';
        speakText(DOM.checklistContent.textContent);
      }
    });
  });
  
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
      const name = lang === 'hi' ? 'कृषि चूना सब्सिडी योजना' : 
                   lang === 'kn' ? 'ಕೃಷಿ ಸುಣ್ಣ ಸಬ್ಸಿಡಿ ಯೋಜನೆ' : 
                   lang === 'mr' ? 'कृषी चुना अनुदान योजना' : 
                   'Agricultural Lime Subsidy Scheme';
      
      if (DOM.schemeItems) {
        const item = document.createElement('div');
        item.className = 'scheme-item';
        item.innerHTML = `
          <div><strong>${name}</strong><small>12 Farmers • ₹2,40,000</small></div>
          <span class="status submitted">${lang === 'hi' ? 'सबमिट' : lang === 'kn' ? 'ಸಲ್ಲಿಸಲಾಗಿದೆ' : lang === 'mr' ? 'सबमिट' : 'SUBMITTED'}</span>
        `;
        DOM.schemeItems.appendChild(item);
      }
      
      showToast('✅ Scheme submitted!', 'success');
      speakText('Scheme submitted successfully');
    });
  }
}

// ============================================
// START
// ============================================
document.addEventListener('DOMContentLoaded', init);

console.log('🌾 ==========================================');
console.log('🌾 MITTI KI AWAAZ - Krishi Sakhi');
console.log('🌾 Version 1.0.0');
console.log('🌾 ==========================================');
