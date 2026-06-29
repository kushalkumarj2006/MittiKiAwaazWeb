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
// LANGUAGE DATA - FULL
// ============================================
const LANG = {
  hi: {
    name: 'हिंदी',
    code: 'hi-IN',
    greeting: '👋 नमस्ते! मैं कृषि सखी हूँ। आज आपके खेत का क्या हाल है?',
    online: '● ऑनलाइन',
    listening: '🎤 सुन रहा हूँ...',
    speaking: '🔊 बोल रहा हूँ...',
    thinking: '⏳ सोच रहा हूँ...',
    error: 'क्षमा करें, कुछ गड़बड़ हो गई। कृपया फिर से प्रयास करें।'
  },
  kn: {
    name: 'ಕನ್ನಡ',
    code: 'kn-IN',
    greeting: '👋 ನಮಸ್ತೆ! ನಾನು ಕೃಷಿ ಸಖಿ. ಇಂದು ನಿಮ್ಮ ಹೊಲದ ಸ್ಥಿತಿ ಹೇಗಿದೆ?',
    online: '● ಆನ್ಲೈನ್',
    listening: '🎤 ಕೇಳುತ್ತಿದ್ದೇನೆ...',
    speaking: '🔊 ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ...',
    thinking: '⏳ ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...',
    error: 'ಕ್ಷಮಿಸಿ, ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.'
  },
  mr: {
    name: 'मराठी',
    code: 'mr-IN',
    greeting: '👋 नमस्कार! मी कृषी सखी आहे. आज तुमच्या शेताची काय परिस्थिती आहे?',
    online: '● ऑनलाइन',
    listening: '🎤 ऐकत आहे...',
    speaking: '🔊 बोलत आहे...',
    thinking: '⏳ विचार करत आहे...',
    error: 'क्षमस्व, काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.'
  },
  en: {
    name: 'English',
    code: 'en-US',
    greeting: '👋 Namaste! I am Krishi Sakhi. How is your field today?',
    online: '● Online',
    listening: '🎤 Listening...',
    speaking: '🔊 Speaking...',
    thinking: '⏳ Thinking...',
    error: 'Sorry, something went wrong. Please try again.'
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
  DOM.avatarPulse = $('avatarPulse');
  DOM.qlangs = $$('.qlang');
  DOM.shortcuts = $$('.shortcut');
  DOM.phChips = $$('.ph-chip');
  DOM.phValue = $('phValue');
  DOM.phLabel = $('phLabel');
  DOM.phDisplay = $('phDisplay');
  DOM.analyzeBtn = $('analyzeBtn');
  DOM.soilResult = $('soilResult');
  DOM.soilResultText = $('soilResultText');
  DOM.speakResultBtn = $('speakResultBtn');
  DOM.historyList = $('historyList');
  DOM.scoreValue = $('scoreValue');
  DOM.scoreCircle = $('scoreCircle');
  DOM.generateSchemeBtn = $('generateSchemeBtn');
  DOM.schemeItems = $('schemeItems');
  DOM.toast = $('toast');
  DOM.toastMessage = $('toastMessage');
  DOM.ackBtns = $$('.ack-btn');
  DOM.speakAlertBtns = $$('.speak-alert-btn');
  DOM.checklistBtns = $$('.checklist-btn');
  DOM.checklistDisplay = $('checklistDisplay');
  DOM.checklistContent = $('checklistContent');
  DOM.closeChecklist = $('closeChecklist');
  DOM.appTitle = $('appTitle');
}

// ============================================
// SHOW/HIDE SCREENS
// ============================================
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  
  const screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.add('active');
    screen.style.display = 'flex';
  }
}

// ============================================
// LANGUAGE - FULL
// ============================================
function setLanguage(lang) {
  AppState.language = lang;
  const langData = LANG[lang];
  
  DOM.langBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  DOM.qlangs.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // Update app title
  if (DOM.appTitle) {
    const titles = { hi: 'मिट्टी की आवाज़', kn: 'ಮಣ್ಣಿನ ಧ್ವನಿ', mr: 'मातीचा आवाज', en: 'Mitti Ki Awaaz' };
    DOM.appTitle.textContent = titles[lang] || 'Mitti Ki Awaaz';
  }
  
  // Update all text elements
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.dataset[lang];
    if (text) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else if (el.tagName === 'LABEL') {
        el.textContent = text;
      } else if (el.tagName === 'BUTTON') {
        const span = el.querySelector('span');
        if (span && span.dataset[lang]) {
          span.textContent = span.dataset[lang];
        } else {
          el.textContent = text;
        }
      } else {
        const textNodes = [];
        el.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            textNodes.push(node);
          }
        });
        if (textNodes.length > 0) {
          textNodes[0].textContent = text;
        } else if (el.childNodes.length === 0) {
          el.textContent = text;
        }
      }
    }
  });
  
  // Update greeting
  if (DOM.chatContainer && DOM.chatContainer.children.length === 0) {
    DOM.chatContainer.innerHTML = '';
    addMessage('Krishi Sakhi', langData.greeting, false);
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
  
  updateStatus('online');
  updatePhDisplay();
  localStorage.setItem('mittiLang', lang);
}

function updateStatus(status) {
  const langData = LANG[AppState.language];
  if (!DOM.statusBadge) return;
  
  if (status === 'listening') DOM.statusBadge.textContent = langData.listening;
  else if (status === 'speaking') DOM.statusBadge.textContent = langData.speaking;
  else DOM.statusBadge.textContent = langData.online;
}

// ============================================
// GEMINI API - REAL
// ============================================
async function callGeminiAPI(message) {
  const lang = AppState.language;
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language: lang })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return data.response || getFallbackResponse(message);
  } catch (error) {
    Logger.error('API Error:', error);
    return getFallbackResponse(message);
  }
}

async function analyzeSoilAPI(ph) {
  const lang = AppState.language;
  
  try {
    const response = await fetch('/api/soil-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ph, language: lang })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return data.response || getFallbackResponse('soil');
  } catch (error) {
    Logger.error('Soil API Error:', error);
    return getFallbackResponse('soil');
  }
}

// ============================================
// FALLBACK RESPONSES - LANGUAGE SPECIFIC
// ============================================
function getFallbackResponse(query) {
  const lang = AppState.language;
  const q = query.toLowerCase();
  
  const fallbacks = {
    hi: {
      soil: '🌿 मिट्टी पीएच 5.8 है। नाइट्रोजन कम है। 2.5 किलो चूना प्रति बीघा डालें। मूंगफली या सरसों बोएं।',
      weather: '🌦️ अगले 5 दिन गर्मी रहेगी, शाम को हल्की बारिश। शाम को ही पानी दें।',
      scheme: '📋 पीएम-किसान योजना में ₹6000 सालाना मिलते हैं। चूना सब्सिडी 50% है।',
      default: '👋 नमस्ते! मैं कृषि सखी हूँ। मिट्टी, मौसम, योजनाएं, फसल या भाव पूछें।'
    },
    kn: {
      soil: '🌿 ಮಣ್ಣಿನ pH 5.8. ಸಾರಜನಕ ಕಡಿಮೆ. 2.5 ಕೆಜಿ ಸುಣ್ಣ ಬಳಸಿ. ಶೇಂಗಾ ಅಥವಾ ಸಾಸಿವೆ ಬೆಳೆಯಿರಿ.',
      weather: '🌦️ 5 ದಿನ ಬಿಸಿ, ಸಂಜೆ ಮಳೆ ಸಾಧ್ಯತೆ. ಸಂಜೆ ನೀರುಣಿಸಿ.',
      scheme: '📋 ಪಿಎಂ-ಕಿಸಾನ್ ₹6000/ವರ್ಷ. ಸುಣ್ಣಕ್ಕೆ 50% ಸಹಾಯಧನ.',
      default: '👋 ನಮಸ್ತೆ! ನಾನು ಕೃಷಿ ಸಖಿ. ಮಣ್ಣು, ಹವಾಮಾನ, ಯೋಜನೆ, ಬೆಳೆ, ಬೆಲೆ ಕೇಳಿ.'
    },
    mr: {
      soil: '🌿 माती pH 5.8. नायट्रोजन कमी. 2.5 किलो चुना वापरा. भुईमूग किंवा मोहरी पेरा.',
      weather: '🌦️ 5 दिवस उष्णता, संध्याकाळी हलका पाऊस. संध्याकाळी पाणी द्या.',
      scheme: '📋 पीएम-किसान ₹6000/वर्ष. चुन्यावर 50% अनुदान.',
      default: '👋 नमस्कार! मी कृषी सखी. माती, हवामान, योजना, पीक, भाव विचारा.'
    },
    en: {
      soil: '🌿 Soil pH 5.8. Nitrogen low. Apply 2.5 kg lime per bigha. Grow Groundnut or Mustard.',
      weather: '🌦️ 5 days warm, evening showers. Irrigate in evenings.',
      scheme: '📋 PM-KISAN ₹6000/year. 50% lime subsidy available.',
      default: '👋 Namaste! I am Krishi Sakhi. Ask about soil, weather, schemes, crops, or prices.'
    }
  };
  
  const langData = fallbacks[lang] || fallbacks.en;
  
  if (q.includes('मिट्टी') || q.includes('soil') || q.includes('माती') || q.includes('ಮಣ್ಣು') || q.includes('pH')) {
    return langData.soil;
  }
  if (q.includes('मौसम') || q.includes('weather') || q.includes('हवामान') || q.includes('ಹವಾಮಾನ') || q.includes('बारिश')) {
    return langData.weather;
  }
  if (q.includes('योजना') || q.includes('scheme') || q.includes('सब्सिडी') || q.includes('ಸಬ್ಸಿಡಿ') || q.includes('अनुदान')) {
    return langData.scheme;
  }
  
  return langData.default;
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
  div.innerHTML = `<div class="msg-avatar">🌾</div><div class="msg-bubble">${LANG[AppState.language].thinking}</div>`;
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
    const response = await callGeminiAPI(text);
    removeTyping();
    addMessage('Krishi Sakhi', response, false);
    speakText(response);
  } catch (e) {
    removeTyping();
    addMessage('Krishi Sakhi', LANG[AppState.language].error, false);
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
  utterance.lang = LANG[AppState.language].code || 'hi-IN';
  utterance.rate = 0.9;
  
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
}

function initSpeech() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  
  recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = LANG[AppState.language].code || 'hi-IN';
  
  recognition.onstart = () => {
    AppState.isListening = true;
    if (DOM.micBtn) DOM.micBtn.classList.add('listening');
    updateStatus('listening');
    if (DOM.avatarPulse) DOM.avatarPulse.style.animationDuration = '0.5s';
  };
  
  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    if (DOM.chatInput) DOM.chatInput.value = text;
    sendMessage(text);
  };
  
  recognition.onerror = () => {
    if (DOM.micBtn) DOM.micBtn.classList.remove('listening');
    updateStatus('online');
  };
  
  recognition.onend = () => {
    AppState.isListening = false;
    if (DOM.micBtn) DOM.micBtn.classList.remove('listening');
    updateStatus('online');
    if (DOM.avatarPulse) DOM.avatarPulse.style.animationDuration = '2.5s';
  };
}

function toggleListening() {
  if (!recognition) {
    showToast('Speech not supported', 'error');
    return;
  }
  
  if (AppState.isListening) {
    recognition.stop();
    return;
  }
  
  recognition.lang = LANG[AppState.language].code || 'hi-IN';
  recognition.start();
}

// ============================================
// SOIL
// ============================================
function updatePhDisplay() {
  const ph = AppState.ph;
  if (DOM.phValue) DOM.phValue.textContent = ph.toFixed(1);
  
  const lang = AppState.language;
  let label = '';
  let color = '';
  
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
}

async function analyzeSoil() {
  const ph = AppState.ph;
  if (DOM.soilResult) DOM.soilResult.style.display = 'block';
  if (DOM.soilResultText) DOM.soilResultText.textContent = LANG[AppState.language].thinking;
  
  try {
    const response = await analyzeSoilAPI(ph);
    if (DOM.soilResultText) DOM.soilResultText.textContent = response;
    
    AppState.soilHistory.push({
      ph: ph,
      result: response,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('mittiSoilHistory', JSON.stringify(AppState.soilHistory));
    renderHistory();
    speakText(response);
  } catch (e) {
    if (DOM.soilResultText) DOM.soilResultText.textContent = LANG[AppState.language].error;
  }
}

function renderHistory() {
  if (!DOM.historyList) return;
  
  DOM.historyList.innerHTML = '';
  
  if (AppState.soilHistory.length === 0) {
    const emptyMsg = AppState.language === 'hi' ? 'अभी कोई रिकॉर्ड नहीं' :
                     AppState.language === 'kn' ? 'ಇನ್ನೂ ಯಾವುದೇ ದಾಖಲೆಗಳಿಲ್ಲ' :
                     AppState.language === 'mr' ? 'अद्याप कोणतेही रेकॉर्ड नाहीत' :
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
}

// ============================================
// RESILIENCE SCORE
// ============================================
function updateResilienceScore() {
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
  
  showScreen('appScreen');
  
  if (DOM.chatContainer) {
    DOM.chatContainer.innerHTML = '';
    addMessage('Krishi Sakhi', LANG[AppState.language].greeting, false);
  }
  
  updatePhDisplay();
  updateResilienceScore();
  renderHistory();
  
  showToast(`Welcome ${name}! 🌾`, 'success');
  
  localStorage.setItem('mittiLoggedIn', 'true');
  localStorage.setItem('mittiUser', name);
}

function logout() {
  AppState.isLoggedIn = false;
  showScreen('loginScreen');
  localStorage.removeItem('mittiLoggedIn');
  localStorage.removeItem('mittiUser');
  showToast('Logged out', 'info');
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
// CHECKLISTS - LANGUAGE SPECIFIC
// ============================================
const CHECKLISTS = {
  livestock: {
    hi: '🐮 मवेशी सुरक्षा चेकलिस्ट\n\n1. गाय, भैंस और बकरियों को तुरंत पंचायत भवन या स्कूल के ऊंचे मैदान में ले जाएं।\n2. 3 दिनों का सूखा भूसा और चारा प्लास्टिक शीट में सुरक्षित रखें।\n3. पशुओं को आज रात खूंटे से बांधकर न रखें।\n4. पीने के पानी में जंतुनाशक पावडर मिलाएं।',
    kn: '🐮 ಜಾನುವಾರು ಸುರಕ್ಷತೆ\n\n1. ಜಾನುವಾರುಗಳನ್ನು ತಕ್ಷಣ ಶಾಲೆಯ ಆಟದ ಮೈದಾನ ಅಥವಾ ಎತ್ತರದ ಸ್ಥಳಕ್ಕೆ ಸ್ಥಳಾಂತರಿಸಿ.\n2. 3 ದಿನಗಳಿಗೆ ಸಾಕಾಗುವಷ್ಟು ಒಣ ಹುಲ್ಲು ಮತ್ತು ಮೇವನ್ನು ಪ್ಲಾಸ್ಟಿಕ್ ಚೀಲದಲ್ಲಿ ಸಂಗ್ರಹಿಸಿಡಿ.\n3. ಇಂದು ರಾತ್ರಿ ಪ್ರಾಣಿಗಳನ್ನು ಹಗ್ಗದಿಂದ ಕಟ್ಟಬೇಡಿ.\n4. ಕುಡಿಯುವ ನೀರಿಗೆ ಔಷಧ ಬೆರೆಸಿ ಸಾಂಕ್ರಾಮಿಕ ರೋಗಗಳಿಂದ ಕಾಪಾಡಿ.',
    mr: '🐮 पशुधन संरक्षण\n\n1. गायी, म्हशी आणि शेळ्यांना त्वरित पंचायत कार्यालय किंवा शाळेच्या उंच मैदानावर न्यावे.\n2. 3 दिवसांचा सुका चारा प्लास्टिक शीटमध्ये गुंडाळून सुरक्षित ठेवावा.\n3. आज रात्री जनावरांना गोठ्यात घट्ट बांधू नका.\n4. पिण्याच्या पाण्यात जंतुनाशक पावडर वापरावी.',
    en: '🐮 Livestock Safety Checklist\n\n1. Move cows, buffaloes, and goats immediately to elevated school playground or Panchayat yard.\n2. Pack dry straw/fodder inside protective plastic sheets for at least 3 days.\n3. Do NOT tie ropes or chains around animals\' necks tonight.\n4. Add bleaching powder to stock water tanks to avoid diseases.'
  },
  crops: {
    hi: '🌾 फसल सुरक्षा चेकलिस्ट\n\n1. खेतों के जल निकासी नालों को तुरंत साफ करें।\n2. 90% पकी फसल की तुरंत कटाई कर लें।\n3. कटी हुई फसलों के बोरों को खुले मैदान से हटाकर सूखे गोदामों में रखें।',
    kn: '🌾 ಬೆಳೆ ಸುರಕ್ಷತೆ\n\n1. ಜಮೀನಿನ ನೀರು ಹರಿದುಹೋಗಲು ಚರಂಡಿಗಳನ್ನು ತಕ್ಷಣ ಸ್ವಚ್ಛಗೊಳಿಸಿ.\n2. 90% ಬೆಳೆದ ಬೆಳೆಗಳನ್ನು ತಕ್ಷಣ ಕೊಯ್ಲು ಮಾಡಿ.\n3. ಕೊಯ್ಲು ಮಾಡಿದ ಮೂಟೆಗಳನ್ನು ತೆರೆದ ಮೈದಾನದಿಂದ ಒಣ ಗೋದಾಮಿಗೆ ಸಾಗಿಸಿ.',
    mr: '🌾 पीक संरक्षण\n\n1. शेतातील पाण्याचा निचरा होणारे नाले त्वरित मोकळे करा.\n2. 90% पक्व झालेली पिके त्वरित कापणी करून घ्या.\n3. कापणी केलेल्या पोत्यांना उघड्या मैदानावरून सुरक्षित व सुक्या गोदामात हलवा.',
    en: '🌾 Crop Rescue Checklist\n\n1. Clear crop drains and silt canals immediately so floodwater does not pool in the roots.\n2. Harvest early pods of soybean/mustard now, even if 90% ripe, to prevent rot damage.\n3. Shift harvested sacks from open ground to dry storage sheds.'
  },
  evacuation: {
    hi: '🏠 स्थानांतरण चेकलिस्ट\n\n1. बाढ़ की चेतावनी मिलने पर तुरंत सुरक्षित स्थान पर जाएं।\n2. महत्वपूर्ण दस्तावेज, नकदी और आवश्यक दवाइयां अपने साथ रखें।\n3. बिजली के मुख्य स्विच बंद कर दें।\n4. पालतू जानवरों को सुरक्षित स्थान पर ले जाएं।',
    kn: '🏠 ಸ್ಥಳಾಂತರ\n\n1. ಪ್ರವಾಹದ ಎಚ್ಚರಿಕೆ ಬಂದ ತಕ್ಷಣ ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ತೆರಳಿ.\n2. ಪ್ರಮುಖ ದಾಖಲೆಗಳು, ನಗದು ಮತ್ತು ಅಗತ್ಯ ಔಷಧಿಗಳನ್ನು ಕೊಂಡೊಯ್ಯಿರಿ.\n3. ಮುಖ್ಯ ವಿದ್ಯುತ್ ಸ್ವಿಚ್ ಆಫ್ ಮಾಡಿ.\n4. ಸಾಕು ಪ್ರಾಣಿಗಳನ್ನು ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ಸ್ಥಳಾಂತರಿಸಿ.',
    mr: '🏠 स्थलांतरण\n\n1. पुराचा इशारा मिळताच सुरक्षित ठिकाणी जा.\n2. महत्वाची कागदपत्रे, रोख रक्कम आणि आवश्यक औषधे सोबत ठेवा.\n3. मुख्य वीज स्विच बंद करा.\n4. पाळीव प्राण्यांना सुरक्षित ठिकाणी हलवा.',
    en: '🏠 Evacuation Checklist\n\n1. Move to safe, elevated ground immediately upon flood warning.\n2. Take important documents, cash, and essential medicines with you.\n3. Turn off main electrical switches.\n4. Move pets to safe location.'
  }
};

// ============================================
// INIT
// ============================================
function init() {
  console.log('🌾 Mitti Ki Awaaz - Starting...');
  
  initDOM();
  
  const savedLang = localStorage.getItem('mittiLang') || 'hi';
  const loggedIn = localStorage.getItem('mittiLoggedIn') === 'true';
  const savedUser = localStorage.getItem('mittiUser') || 'Rajesh Kumar';
  const savedHistory = localStorage.getItem('mittiSoilHistory');
  if (savedHistory) {
    try { AppState.soilHistory = JSON.parse(savedHistory); } catch (e) {}
  }
  
  setLanguage(savedLang);
  
  showScreen('loadingScreen');
  
  setTimeout(() => {
    if (loggedIn) {
      AppState.isLoggedIn = true;
      AppState.userName = savedUser;
      if (DOM.userName) DOM.userName.textContent = savedUser.split(' ')[0];
      
      showScreen('appScreen');
      
      if (DOM.chatContainer) {
        DOM.chatContainer.innerHTML = '';
        addMessage('Krishi Sakhi', LANG[AppState.language].greeting, false);
      }
      
      updatePhDisplay();
      updateResilienceScore();
      renderHistory();
    } else {
      showScreen('loginScreen');
    }
  }, 2000);
  
  setupEvents();
  initSpeech();
  
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
  if (DOM.loginBtn) DOM.loginBtn.addEventListener('click', login);
  
  [DOM.pinCode, DOM.phoneNumber, DOM.farmerName].forEach(el => {
    if (el) el.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') login();
    });
  });
  
  if (DOM.logoutBtn) DOM.logoutBtn.addEventListener('click', logout);
  
  if (DOM.settingsBtn) {
    DOM.settingsBtn.addEventListener('click', () => {
      alert(`⚙️ Settings\n\nLanguage: ${LANG[AppState.language].name}\nUser: ${AppState.userName}\nScans: ${AppState.soilHistory.length}`);
    });
  }
  
  DOM.langBtns.forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  DOM.qlangs.forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  
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
  
  if (DOM.micBtn) DOM.micBtn.addEventListener('click', toggleListening);
  
  DOM.navItems.forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.screen));
  });
  
  DOM.shortcuts.forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.dataset.query;
      if (query) sendMessage(query);
    });
  });
  
  DOM.phChips.forEach(chip => {
    chip.addEventListener('click', () => {
      DOM.phChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      AppState.ph = parseFloat(chip.dataset.ph);
      updatePhDisplay();
    });
  });
  
  if (DOM.analyzeBtn) DOM.analyzeBtn.addEventListener('click', analyzeSoil);
  
  if (DOM.speakResultBtn) {
    DOM.speakResultBtn.addEventListener('click', () => {
      const text = DOM.soilResultText ? DOM.soilResultText.textContent : '';
      if (text && !text.includes('⏳')) speakText(text);
    });
  }
  
  DOM.ackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.textContent = '✅ Received';
      btn.disabled = true;
      btn.style.opacity = '0.5';
      showToast('Alert acknowledged ✅', 'success');
    });
  });
  
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
  
  DOM.checklistBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.checklist;
      const list = CHECKLISTS[type];
      if (list && DOM.checklistContent) {
        const lang = AppState.language;
        DOM.checklistContent.textContent = list[lang] || list.en;
        if (DOM.checklistDisplay) DOM.checklistDisplay.style.display = 'block';
        speakText(DOM.checklistContent.textContent);
      }
    });
  });
  
  if (DOM.closeChecklist) {
    DOM.closeChecklist.addEventListener('click', () => {
      if (DOM.checklistDisplay) DOM.checklistDisplay.style.display = 'none';
    });
  }
  
  if (DOM.generateSchemeBtn) {
    DOM.generateSchemeBtn.addEventListener('click', () => {
      const lang = AppState.language;
      const name = lang === 'hi' ? 'कृषि चूना सब्सिडी योजना' : 
                   lang === 'kn' ? 'ಕೃಷಿ ಸುಣ್ಣ ಸಬ್ಸಿಡಿ ಯೋಜನೆ' : 
                   lang === 'mr' ? 'कृषी चुना अनुदान योजना' : 
                   'Agricultural Lime Subsidy Scheme';
      
      if (DOM.schemeItems) {
        const item = document.createElement('div');
        item.className = 'scheme-item';
        const statusText = lang === 'hi' ? 'सबमिट' : lang === 'kn' ? 'ಸಲ್ಲಿಸಲಾಗಿದೆ' : lang === 'mr' ? 'सबमिट' : 'SUBMITTED';
        item.innerHTML = `
          <div><strong>${name}</strong><small>12 Farmers • ₹2,40,000</small></div>
          <span class="status submitted">${statusText}</span>
        `;
        DOM.schemeItems.appendChild(item);
      }
      
      const msg = lang === 'hi' ? '✅ योजना सबमिट!' : 
                  lang === 'kn' ? '✅ ಯೋಜನೆ ಸಲ್ಲಿಸಲಾಗಿದೆ!' : 
                  lang === 'mr' ? '✅ योजना सबमिट!' : 
                  '✅ Scheme submitted!';
      showToast(msg, 'success');
      speakText(msg);
    });
  }
}

// ============================================
// START
// ============================================
document.addEventListener('DOMContentLoaded', init);

console.log('🌾 ==========================================');
console.log('🌾 MITTI KI AWAAZ - Krishi Sakhi');
console.log('🌾 Version 2.0.0');
console.log('🌾 ==========================================');
