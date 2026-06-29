// ============================================
// MITTI KI AWAAZ - Complete Server
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// 📝 LOGGING SYSTEM
// ============================================

const LOG_LEVELS = {
  INFO: '📘 INFO',
  SUCCESS: '✅ SUCCESS',
  WARNING: '⚠️ WARNING',
  ERROR: '❌ ERROR',
  DEBUG: '🔍 DEBUG',
  REQUEST: '📨 REQUEST',
  RESPONSE: '📤 RESPONSE',
  GEMINI: '🤖 GEMINI',
  FALLBACK: '📋 FALLBACK'
};

const COLORS = {
  reset: '\x1b[0m',
  fg: {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    crimson: '\x1b[38m'
  }
};

// Log file setup
const LOG_FILE = path.join(__dirname, 'logs', 'app.log');
const ERROR_LOG_FILE = path.join(__dirname, 'logs', 'error.log');

try {
  if (!fs.existsSync(path.join(__dirname, 'logs'))) {
    fs.mkdirSync(path.join(__dirname, 'logs'), { recursive: true });
  }
} catch (err) {}

function writeToLogFile(level, message, data = null) {
  try {
    const timestamp = new Date().toISOString();
    let logEntry = `[${timestamp}] [${level}] ${message}`;
    if (data) {
      logEntry += `\n${JSON.stringify(data, null, 2)}`;
    }
    logEntry += '\n';
    fs.appendFileSync(LOG_FILE, logEntry, 'utf8');
    if (level === LOG_LEVELS.ERROR || level === LOG_LEVELS.WARNING) {
      fs.appendFileSync(ERROR_LOG_FILE, logEntry, 'utf8');
    }
  } catch (err) {}
}

function logger(level, message, data = null) {
  const timestamp = new Date().toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    hour12: true 
  });
  
  let prefix = '';
  switch(level) {
    case LOG_LEVELS.INFO: prefix = COLORS.fg.blue; break;
    case LOG_LEVELS.SUCCESS: prefix = COLORS.fg.green; break;
    case LOG_LEVELS.WARNING: prefix = COLORS.fg.yellow; break;
    case LOG_LEVELS.ERROR: prefix = COLORS.fg.red; break;
    case LOG_LEVELS.DEBUG: prefix = COLORS.fg.cyan; break;
    case LOG_LEVELS.REQUEST: prefix = COLORS.fg.magenta; break;
    case LOG_LEVELS.RESPONSE: prefix = COLORS.fg.green; break;
    case LOG_LEVELS.GEMINI: prefix = COLORS.fg.crimson; break;
    case LOG_LEVELS.FALLBACK: prefix = COLORS.fg.yellow; break;
    default: prefix = COLORS.fg.white;
  }
  
  console.log(`${prefix}[${timestamp}] ${level}${COLORS.reset} ${message}`);
  if (data) {
    if (typeof data === 'object') {
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log(data);
    }
  }
  
  writeToLogFile(level, message, data);
}

// Request logger middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  logger(LOG_LEVELS.REQUEST, `${req.method} ${req.url}`, {
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'] || 'Unknown',
    contentType: req.headers['content-type'] || 'None',
    bodySize: req.headers['content-length'] || '0'
  });
  
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    logger(LOG_LEVELS.RESPONSE, `${req.method} ${req.url} → ${status} (${duration}ms)`, {
      status: status,
      duration: `${duration}ms`,
      size: data ? data.length : 0
    });
    originalSend.call(this, data);
  };
  
  next();
});

// ============================================
// MIDDLEWARE
// ============================================

logger(LOG_LEVELS.INFO, '🚀 Initializing Mitti Ki Awaaz Server...');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// ============================================
// SYSTEM PROMPTS
// ============================================

const SYSTEM_PROMPTS = {
  hi: `आप 'कृषि सखी' हैं, भारतीय किसानों के लिए बुद्धिमान और दयालु कृषि सलाहकार।
मैंडेट: पूरा उत्तर पूरी तरह से हिंदी में देवनागरी लिपि में लिखें। अंग्रेजी शब्द न करें।`,

  kn: `ನೀವು 'ಕೃಷಿ ಸಖಿ', ಭಾರತೀಯ ರೈತರಿಗೆ ಬುದ್ಧಿವಂತ ಕೃಷಿ ಸಲಹೆಗಾರ್ತಿ.
ಮ್ಯಾಂಡೇಟ್: ಸಂಪೂರ್ಣ ಉತ್ತರವನ್ನು ಕನ್ನಡ ಲಿಪಿಯಲ್ಲಿ ಬರೆಯಿರಿ. ಇಂಗ್ಲಿಷ್ ಬೇಡ.`,

  mr: `आपण 'कृषी सखी' आहात, भारतीय शेतकऱ्यांसाठी बुद्धिमान कृषी सल्लागार.
मॅंडेट: संपूर्ण उत्तर मराठीत देवनागरी लिपीत लिहा. इंग्रजी नको.`,

  en: `You are 'Krishi Sakhi', an intelligent agricultural advisor for Indian farmers.
Write your entire response in English.`
};

// ============================================
// GEMINI API - USING gemini-2.5-flash-lite
// ============================================

async function callGemini(prompt, language = 'hi') {
  // Check if API key exists
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    logger(LOG_LEVELS.WARNING, 'No Gemini API key found - using fallback mode');
    return null;
  }

  try {
    logger(LOG_LEVELS.GEMINI, 'Calling Gemini API (gemini-2.5-flash-lite)...', { 
      language, 
      promptLength: prompt.length 
    });
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // ✅ USING gemini-2.5-flash-lite
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    logger(LOG_LEVELS.SUCCESS, 'Gemini API responded successfully', {
      responseLength: text.length
    });
    
    return text;
  } catch (error) {
    logger(LOG_LEVELS.ERROR, 'Gemini API error', {
      error: error.message,
      stack: error.stack
    });
    return null;
  }
}

// ============================================
// FALLBACK RESPONSES
// ============================================

function getFallbackResponse(query, lang = 'hi') {
  const q = query.toLowerCase();
  
  const fallbacks = {
    hi: {
      soil: `🌿 मिट्टी विश्लेषण और उर्वरता निदान

1. मिट्टी की स्थिति: पीएच 5.8 (मध्यम अम्लीय), नाइट्रोजन कम, पोटेशियम उच्च।

2. सुधार उपाय: 2.5 किलो चूना प्रति बीघा डालें। 150 किलो जैविक खाद use करें।

3. सर्वोत्तम फसलें: मूंगफली, सरसों, सोयाबीन।`,
      weather: `🌦️ जलवायु सलाह

1. अगले 5 दिन गर्मी, शाम को हल्की बारिश।

2. शाम को ही पानी दें। 10mm से ज्यादा बारिश पर सिंचाई रोकें।

3. मक्के में जलभराव रोकें, धान में 2-3cm पानी रखें।`,
      scheme: `📋 सरकारी योजनाएं

1. पीएम-किसान: ₹6000/साल, 2 हेक्टेयर तक पात्र।

2. चूना सब्सिडी: 50% सब्सिडी, पंचायत में आवेदन करें।`,
      default: `👋 नमस्ते! मैं कृषि सखी हूँ। मिट्टी, मौसम, योजनाएं, फसल या भाव पूछें।`
    },
    kn: {
      soil: `🌿 ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ

1. pH 5.8 (ಮಧ್ಯಮ ಆಮ್ಲೀಯ), ಸಾರಜನಕ ಕಡಿಮೆ, ಪೊಟ್ಯಾಸಿಯಮ್ ಹೆಚ್ಚು.

2. 2.5 ಕೆಜಿ ಸುಣ್ಣ ಬಳಸಿ, 150 ಕೆಜಿ ಸಾವಯವ ಗೊಬ್ಬರ.

3. ಶೇಂಗಾ, ಸಾಸಿವೆ, ಸೋಯಾಬೀನ್.`,
      weather: `🌦️ ಹವಾಮಾನ

1. 5 ದಿನ ಬಿಸಿ, ಸಂಜೆ ಮಳೆ ಸಾಧ್ಯತೆ.

2. ಸಂಜೆ ನೀರುಣಿಸಿ. 10mm ಮಳೆಗೆ ಸಿಂಚನ ನಿಲ್ಲಿಸಿ.

3. ಜೋಳದಲ್ಲಿ ನೀರು ನಿಲ್ಲಿಸಬೇಡಿ, ಭತ್ತದಲ್ಲಿ 2-3cm ನೀರು.`,
      scheme: `📋 ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು

1. ಪಿಎಂ-ಕಿಸಾನ್: ₹6000/ವರ್ಷ, 2 ಹೆಕ್ಟೇರ್ ವರೆಗೆ.

2. ಸುಣ್ಣ ಸಬ್ಸಿಡಿ: 50%, ಪಂಚಾಯಿತಿಯಲ್ಲಿ ಅರ್ಜಿ.`,
      default: `👋 ನಮಸ್ತೆ! ನಾನು ಕೃಷಿ ಸಖಿ. ಮಣ್ಣು, ಹವಾಮಾನ, ಯೋಜನೆ, ಬೆಳೆ, ಬೆಲೆ ಕೇಳಿ.`
    },
    mr: {
      soil: `🌿 माती विश्लेषण

1. pH 5.8 (मध्यम आम्लीय), नायट्रोजन कमी, पोटॅशियम जास्त.

2. 2.5 किलो चुना वापरा, 150 किलो सेंद्रिय खत.

3. भुईमूग, मोहरी, सोयाबीन.`,
      weather: `🌦️ हवामान

1. 5 दिवस उष्णता, संध्याकाळी हलका पाऊस.

2. संध्याकाळी पाणी द्या. 10mm पावसावर सिंचन थांबवा.

3. मक्यात पाणी साचू देऊ नका, भातात 2-3cm पाणी.`,
      scheme: `📋 सरकारी योजना

1. पीएम-किसान: ₹6000/वर्ष, 2 हेक्टर पर्यंत.

2. चुना अनुदान: 50%, पंचायत मध्ये अर्ज.`,
      default: `👋 नमस्कार! मी कृषी सखी. माती, हवामान, योजना, पीक, भाव विचारा.`
    },
    en: {
      soil: `🌿 Soil Analysis

1. pH 5.8 (moderately acidic), Nitrogen low, Potassium high.

2. Apply 2.5 kg lime per bigha, 150 kg organic compost.

3. Best crops: Groundnut, Mustard, Soybean.`,
      weather: `🌦️ Weather Advisory

1. 5 days warm, evening showers possible.

2. Irrigate in evenings. Stop if rain exceeds 10mm.

3. Drain maize fields, maintain 2-3cm water in paddy.`,
      scheme: `📋 Government Schemes

1. PM-KISAN: ₹6000/year, eligible up to 2 hectares.

2. Lime Subsidy: 50%, apply at Panchayat office.`,
      default: `👋 Namaste! I am Krishi Sakhi. Ask about soil, weather, schemes, crops, or prices.`
    }
  };

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
// API ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: '🌾 Mitti Ki Awaaz is running!',
    timestamp: new Date().toISOString(),
    gemini: process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' ? '✅ Connected' : '❌ Fallback Mode',
    model: 'gemini-2.5-flash-lite'
  });
});

// Chat with Krishi Sakhi
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'hi' } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.json({ 
        success: true, 
        response: "Please ask something about farming!" 
      });
    }

    logger(LOG_LEVELS.INFO, 'Chat request', { message, language });

    const systemPrompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS.en;
    const langName = language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : language === 'mr' ? 'Marathi' : 'English';
    
    const fullPrompt = `
${systemPrompt}

Farmer's Question: ${message}

Instructions:
1. Reply ONLY in ${langName} (${language})
2. Keep it short (3-5 sentences)
3. Be helpful and actionable
4. Include specific numbers (kg, bigha, rupees)`;

    // Try Gemini first
    let aiResponse = await callGemini(fullPrompt, language);
    
    // If Gemini fails, use fallback
    if (!aiResponse) {
      logger(LOG_LEVELS.FALLBACK, 'Using fallback for chat');
      aiResponse = getFallbackResponse(message, language);
    }
    
    res.json({ success: true, response: aiResponse });
    
  } catch (error) {
    logger(LOG_LEVELS.ERROR, 'Chat error', { error: error.message });
    res.json({ 
      success: false, 
      response: getFallbackResponse(req.body.message, req.body.language || 'hi')
    });
  }
});

// Soil Analysis
app.post('/api/soil-analyze', async (req, res) => {
  try {
    const { ph, language = 'hi' } = req.body;
    
    logger(LOG_LEVELS.INFO, 'Soil analysis request', { ph, language });

    const systemPrompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS.en;
    const langName = language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : language === 'mr' ? 'Marathi' : 'English';
    
    const prompt = `
${systemPrompt}

Soil pH: ${ph}
Nutrients: Nitrogen - Low, Phosphorus - Medium, Potassium - High

Provide a 3-point analysis in ${langName}:
1. Soil health classification
2. Treatment with exact quantities (kg per bigha)
3. Top 2 crop recommendations`;

    let aiResponse = await callGemini(prompt, language);
    
    if (!aiResponse) {
      logger(LOG_LEVELS.FALLBACK, 'Using fallback for soil analysis');
      aiResponse = getFallbackResponse('soil', language);
    }
    
    res.json({ success: true, response: aiResponse });
    
  } catch (error) {
    logger(LOG_LEVELS.ERROR, 'Soil analysis error', { error: error.message });
    res.json({ 
      success: false, 
      response: getFallbackResponse('soil', req.body.language || 'hi')
    });
  }
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch all - serve index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(60));
  console.log('🌾 MITTI KI AWAAZ - Server Started Successfully');
  console.log('='.repeat(60));
  console.log(`📍 Local:    http://localhost:${PORT}`);
  console.log(`📍 Network:  http://0.0.0.0:${PORT}`);
  console.log(`🤖 Gemini:   ${process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' ? '✅ CONNECTED' : '❌ FALLBACK MODE'}`);
  console.log(`📦 Model:    gemini-2.5-flash-lite`);
  console.log('='.repeat(60) + '\n');
  
  logger(LOG_LEVELS.SUCCESS, '🚀 Server initialization complete');
});

// Handle shutdown
process.on('SIGTERM', () => {
  logger(LOG_LEVELS.WARNING, '🛑 Received SIGTERM, shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger(LOG_LEVELS.WARNING, '🛑 Received SIGINT, shutting down...');
  process.exit(0);
});
