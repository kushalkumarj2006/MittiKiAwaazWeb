// ============================================
// MITTI KI AWAAZ - Complete Server for Render
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from root directory
app.use(express.static(__dirname));

// ============================================
// SYSTEM PROMPTS FOR EACH LANGUAGE
// ============================================
const SYSTEM_PROMPTS = {
  hi: `आप 'कृषि सखी' हैं, जो भारतीय किसानों के लिए एक बुद्धिमान और दयालु कृषि और जलवायु सलाहकार हैं।
मैंडेट: आपको अपना पूरा उत्तर पूरी तरह से हिंदी में देवनागरी लिपि में ही लिखना होगा। अंग्रेजी शब्दों या रोमन लिपि का उपयोग बिल्कुल न करें।
आपकी विशेषज्ञता: मिट्टी परीक्षण, मौसम पूर्वानुमान, सरकारी योजनाएं, फसल चयन, बाजार भाव।`,

  kn: `ನೀವು 'ಕೃಷಿ ಸಖಿ', ಭಾರತೀಯ ರೈತರಿಗೆ ಬುದ್ಧಿವಂತ ಮತ್ತು ದಯೆಯುಳ್ಳ ಕೃಷಿ ಮತ್ತು ಹವಾಮಾನ ಸಲಹೆಗಾರ್ತಿ.
ಮ್ಯಾಂಡೇಟ್: ನೀವು ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಉತ್ತರವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಕನ್ನಡ ಲಿಪಿಯಲ್ಲಿಯೇ ಬರೆಯಬೇಕು. ಇಂಗ್ಲಿಷ್ ಪದಗಳನ್ನು ಬಳಸಬೇಡಿ.
ನಿಮ್ಮ ಪರಿಣತಿ: ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ, ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಬೆಳೆ ಆಯ್ಕೆ, ಮಾರುಕಟ್ಟೆ ಬೆಲೆ.`,

  mr: `आपण 'कृषी सखी' आहात, भारतीय शेतकऱ्यांसाठी एक बुद्धिमान आणि दयाळू कृषी आणि हवामान सल्लागार.
मॅंडेट: आपण आपले संपूर्ण उत्तर पूर्णपणे मराठीत देवनागरी लिपीतच लिहिले पाहिजे. इंग्रजी शब्द वापरू नका.
आपली कौशल्ये: माती परीक्षण, हवामान अंदाज, सरकारी योजना, पीक निवड, बाजार भाव.`,

  en: `You are 'Krishi Sakhi', an intelligent and kind agricultural and climate resilience advisor for Indian farmers.
Mandate: Write your entire response in English only.
Your expertise: Soil testing, weather forecasting, government schemes, crop selection, market prices.`
};

// ============================================
// COMPLETE FALLBACK RESPONSES (No API Key Mode)
// ============================================
function getFallbackResponse(query, lang = 'hi') {
  const q = query.toLowerCase();
  
  // Language-specific fallbacks
  const fallbacks = {
    hi: {
      soil: `🌿 मिट्टी विश्लेषण और उर्वरता निदान (कृषि सखी सलाहकार)

1. मिट्टी की स्थिति: पीएच 5.8 (मध्यम अम्लीय) है, नाइट्रोजन कम है और पोटेशियम उच्च है।

2. सुधार उपाय: अम्लता को संतुलित करने के लिए प्रति बीघा 2.5 किलोग्राम कृषि चूना (Agricultural Lime) मिलाएं। रासायनिक यूरिया से बचें और 150 किलोग्राम जैविक केंचुआ खाद (वर्मिकम्पोस्ट) का उपयोग करें।

3. सर्वोत्तम फसलें: मूंगफली, सरसों और सोयाबीन इस मिट्टी में अच्छी उपज देंगे और प्राकृतिक उर्वरता बढ़ाएंगे।`,

      weather: `🌦️ जलवायु और सिंचाई सलाह (कृषि सखी पूर्वानुमान)

1. मौसम का हाल: अगले 5 दिनों में गर्म और उमस भरा मौसम रहेगा, शाम को हल्की बारिश की संभावना है।

2. सिंचाई सलाह: वाष्पीकरण को रोकने के लिए केवल शाम को पानी दें। यदि 10 मिमी से अधिक बारिश होती है, तो सिंचाई टाल दें।

3. फसल सुरक्षा: मक्के के खेतों में जलभराव रोकने के लिए नालियों को साफ रखें और धान में 2-3 सेमी पानी बनाए रखें।`,

      scheme: `📋 सरकारी योजनाएं और सब्सिडी सलाह (कृषि सखी पोर्टल)

1. पीएम-किसान निधि: यदि आपके पास 2 हेक्टेयर तक कृषि भूमि है, तो आप सालाना ₹6,000 पाने के पात्र हैं। पीएम-किसान पोर्टल पर पंजीकरण करें या सरपंच से संपर्क करें।

2. चूना सब्सिडी: अम्लीय भूमि सुधार योजना के तहत, कृषि चूने की खरीद पर 50% की सब्सिडी मिलती है। आवश्यक दस्तावेजों के साथ पंचायत कार्यालय में आवेदन करें।`,

      crop: `🌱 फसल चयन और कृषि विज्ञान सलाह (कृषि सखी विशेषज्ञ)

1. अनुशंसित किस्में: अम्लीय मिट्टी के लिए, मूंगफली (K-6, कदिरी-9) या सरसों (पूसा बोल्ड, वरुणा) सर्वोत्तम विकल्प हैं।

2. बीज उपचार: जड़ सड़न से बचाव के लिए बुवाई से पहले मूंगफली के बीजों को ट्राइकोडरमा (5 ग्राम प्रति किलोग्राम बीज) से उपचारित करें।

3. दूरी और गहराई: अधिकतम उपज के लिए बीजों को 5 सेमी की गहराई पर और कतारों के बीच 30 सेमी की दूरी पर बोएं।`,

      price: `💰 बाजार भाव और मंडी खुफिया जानकारी (कृषि सखी मंडी सेवा)

1. मूंगफली: मंडी भाव ₹6,800 से ₹7,200 प्रति क्विंटल पर स्थिर हैं। न्यूनतम समर्थन मूल्य (MSP) ₹6,780 है।

2. सरसों: कीमतें बढ़ रही हैं, बाजार भाव ₹5,900 से ₹6,300 प्रति क्विंटल चल रहा है। एमएसपी ₹5,650 है।

3. व्यापार सलाह: यदि आपके पास भंडारण की सुविधा है, तो सरसों के स्टॉक को 3-4 सप्ताह तक रोककर रखें; अधिक लाभ मिल सकता है।`,

      default: `👋 नमस्ते! मैं आपकी कृषि सखी हूँ, आपकी व्यक्तिगत जलवायु-अनुकूल कृषि सलाहकार।

मैं आपकी निम्न विषयों में मदद कर सकती हूँ:
1. मिट्टी परीक्षण, पीएच विश्लेषण और जैविक खाद की सलाह में।
2. मौसम अनुकूल फसल योजना और सिंचाई कार्यक्रम तय करने में।
3. सरकारी योजनाओं, पीएम-किसान और चूना सब्सिडी की पात्रता में।
4. नवीनतम मंडी भाव और उपज बेचने की सही सलाह में।

अपने खेत के बारे में कुछ भी पूछें!`
    },

    kn: {
      soil: `🌿 ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಫಲವತ್ತತೆಯ ರೋಗನಿರ್ಣಯ (ಕೃಷಿ ಸಖಿ ಸಲಹೆಗಾರ್ತಿ)

1. ಮಣ್ಣಿನ ಸ್ಥಿತಿ: pH ಮಟ್ಟ 5.8 (ಮಧ್ಯಮ ಆಮ್ಲೀಯ), ಸಾರಜನಕ ಕಡಿಮೆ ಮತ್ತು ಪೊಟ್ಯಾಸಿಯಮ್ ಹೆಚ್ಚಾಗಿದೆ.

2. ಸುಧಾರಣಾ ಕ್ರಮ: ಆಮ್ಲೀಯತೆಯನ್ನು ಸರಿದೂಗಿಸಲು ಪ್ರತಿ ಬಿಘಾಕ್ಕೆ 2.5 ಕೆಜಿ ಕೃಷಿ ಸುಣ್ಣವನ್ನು (ಚುನಾ) ಬಳಸಿ. ರಾಸಾಯನಿಕ ಗೊಬ್ಬರ ಬಳಸಬೇಡಿ, ಬದಲಿಗೆ 150 ಕೆಜಿ ಸಾವಯವ ಎರೆಗೊಬ್ಬರವನ್ನು ಬಳಸಿ.

3. ಸೂಕ್ತ ಬೆಳೆಗಳು: ಶೇಂಗಾ (ನೆಲಗಡಲೆ), ಸಾಸಿವೆ ಮತ್ತು ಸೋಯಾಬೀನ್ ಈ ಮಣ್ಣಿನಲ್ಲಿ ಉತ್ತಮ ಇಳುವರಿ ನೀಡುತ್ತವೆ.`,

      weather: `🌦️ ಹವಾಮಾನ ಮತ್ತು ನೀರಾವರಿ ಸಲಹೆ (ಕೃಷಿ ಸಖಿ ಮುನ್ಸೂಚನೆ)

1. ಹವಾಮಾನ ವಿವರ: ಮುಂದಿನ 5 ದಿನಗಳು ಬಿಸಿ ಮತ್ತು ಆರ್ದ್ರತೆಯಿಂದ ಕೂಡಿದ್ದು, ಸಂಜೆ ಸಣ್ಣ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ.

2. ನೀರಾವರಿ ಸಲಹೆ: ಆವಿಯಾಗುವಿಕೆ ತಡೆಯಲು ಸಂಜೆ ನೀರುಣಿಸಿ. ಮಳೆ 10 ಮಿಮೀ ದಾಟಿದರೆ ನೀರಾವರಿಯನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ನಿಲ್ಲಿಸಿ.

3. ಬೆಳೆ ರಕ್ಷಣೆ: ಜೋಳದ ಹೊಲಗಳಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ ಮತ್ತು ಭತ್ತದ ಬೆಳೆಗೆ 2-3 ಸೆಂ.ಮೀ ನೀರನ್ನು ಕಾಯ್ದುಕೊಳ್ಳಿ.`,

      scheme: `📋 ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಸಹಾಯಧನ ಸಲಹೆ (ಕೃಷಿ ಸಖಿ ಮಾಹಿತಿ)

1. ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆ: ನಿಮ್ಮ ಹೆಸರಿನಲ್ಲಿ 2 ಹೆಕ್ಟೇರ್‌ವರೆಗಿನ ಕೃಷಿ ಭೂಮಿ ಇದ್ದರೆ ವರ್ಷಕ್ಕೆ ₹6,000 ಪಡೆಯಲು ನೀವು ಅರ್ಹರು. ಪಿಎಂ-ಕಿಸಾನ್ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಅಥವಾ ಸರಪಂಚರ ಬಳಿ ನೋಂದಣಿ ಮಾಡಿ.

2. ಸುಣ್ಣದ ಸಹಾಯಧನ: ಆಮ್ಲೀಯ ಮಣ್ಣು ಸುಧಾರಣೆ ಯೋಜನೆಯಡಿ, ಕೃಷಿ ಸುಣ್ಣದ ಖರೀದಿಗೆ 50% ರಿಯಾಯಿತಿ ಸಿಗುತ್ತದೆ. ನಿಮ್ಮ ದಾಖಲೆಗಳೊಂದಿಗೆ ಪಂಚಾಯಿತಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.`,

      default: `👋 ನಮಸ್ತೆ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಖಿ, ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಹವಾಮಾನ-ಸ್ನೇಹಿ ಕೃಷಿ ಸಲಹೆಗಾರ್ತಿ.

ನಾನು ನಿಮಗೆ ಇವುಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ:
1. ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ, pH ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಗೊಬ್ಬರದ ಶಿಫಾರಸುಗಳು.
2. ಹವಾಮಾನ ಆಧಾರಿತ ಬೆಳೆ ಯೋಜನೆ ಮತ್ತು ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ.
3. ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಪಿಎಂ-ಕಿಸಾನ್ ಮತ್ತು ಸುಣ್ಣದ ಸಹಾಯಧನ.
4. ಇತ್ತೀಚಿನ ಮಂಡಿ ದರಗಳು ಮತ್ತು ಬೆಳೆ ಮಾರಾಟದ ಸಲಹೆಗಳು.

ನಿಮ್ಮ ಜಮೀನಿನ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ!`
    },

    mr: {
      soil: `🌿 माती विश्लेषण आणि सुपीकता निदान (कृषी सखी सल्लागार)

1. मातीची स्थिती: पीएच पातळी 5.8 (मध्यम आम्लीय) आहे, नायट्रोजन कमी आहे आणि पोटॅशियम जास्त आहे.

2. सुधारणा उपाय: आम्लता संतुलित करण्यासाठी पेरणीपूर्वी प्रति बिघा 2.5 किलो कृषी चुना शेतात वापरा। युरियाऐवजी 150 किलो सेंद्रिय गांडूळ खत वापरा.

3. सर्वोत्तम पिके: भुईमूग, मोहरी आणि सोयाबीन या आम्लीय मातीत उत्तम वाढतात.`,

      weather: `🌦️ हवामान आणि सिंचन सल्ला (कृषी सखी अंदाज)

1. हवामान स्थिती: पुढील 5 दिवसांत उष्ण आणि दमट हवामान राहील, संध्याकाळी हलक्या सरी पडण्याची शक्यता आहे.

2. सिंचन सल्ला: बाष्पीभवन टाळण्यासाठी संध्याकाळी पाणी द्या। जर 10 मिमी पेक्षा जास्त पाऊस पडला तर सिंचन थांबवा.

3. पीक संरक्षण: मक्याच्या शेतात पाणी साचू नये म्हणून पाण्याचा निचरा करणारी गटारे मोकळी ठेवा आणि भात पिकात 2-3 सेमी पाणी ठेवा.`,

      scheme: `📋 सरकारी योजना आणि अनुदान सल्ला (कृषी सखी माहिती)

1. पीएम-किसान निधी: आपल्याकडे 2 हेक्टरपर्यंत शेतजमीन असल्यास, आपण वार्षिक ₹6,000 मिळण्यास पात्र आहात। पीएम-किसान पोर्टलवर किंवा स्थानिक सरपंचांशी संपर्क साधून नोंदणी करा.

2. चुना अनुदान: आम्लीय जमीन सुधारणा योजनेअंतर्गत, कृषी चुन्याच्या खरेदीवर 50% अनुदान उपलब्ध आहे। आवश्यक कागदपत्रांसह पंचायत कार्यालयात अर्ज करा.`,

      default: `👋 नमस्कार! मी तुमची कृषी सखी आहे, तुमची वैयक्तिक हवामान-अनुकूल कृषी सल्लागार.

मी तुम्हाला खालील गोष्टींमध्ये मदत करू शकते:
1. माती परीक्षण, पीएच विश्लेषण आणि खतांच्या शिफारसी.
2. हवामान-अनुकूल पीक नियोजन आणि सिंचन वेळापत्रक.
3. सरकारी योजना, पीएम-किसान आणि चुना अनुदान माहिती.
4. ताजे बाजार भाव आणि पीक विक्रीबाबत योग्य सल्ला.

तुमच्या शेतीबद्दल कोणताही प्रश्न विचारा!`
    },

    en: {
      soil: `🌿 Soil & Fertility Diagnostics (Krishi Sakhi Assistant)

1. Soil Health: pH is 5.8 (moderately acidic), nitrogen is low, and potassium is high.

2. Recommendation: Apply 2.5 kg of agricultural lime (chuna) per bigha to balance acidity. Avoid chemical nitrogen; use organic vermicompost (150 kg per bigha) instead.

3. Best Crops: Groundnut, mustard, and soybean will thrive and help restore natural soil balance.`,

      weather: `🌦️ Climate & Irrigation Advisory (Krishi Sakhi Forecast)

1. Outlook: Warm and humid conditions with light evening showers expected over the next 5 days.

2. Irrigation: Schedule watering for late evenings to minimize evaporation loss. Skip irrigation if cumulative rain exceeds 10mm.

3. Standing Crops: Ensure proper drainage channels in maize fields to prevent waterlogging, and maintain 2-3 cm shallow water in paddy.`,

      scheme: `📋 Government Schemes & Subsidy Advisory (Krishi Sakhi Portal)

1. PM-KISAN Nidhi: If you own agricultural land up to 2 hectares, you are eligible for ₹6,000 yearly in 3 installments. Register via the PM-KISAN portal or contact your local Sarpanch.

2. Lime Subsidy: Under the acidic soil reclamation scheme, a 50% subsidy is available for agricultural lime purchase. Register with the Panchayat office.`,

      crop: `🌱 Crop Selection & Agronomy Advisory (Krishi Sakhi Agronomist)

1. Recommended Varieties: For acidic soils, Groundnut (K-6, Kadiri-9) or Mustard (Pusa Bold, Varuna) are excellent choices.

2. Seed Treatment: Always treat groundnut seeds with Trichoderma (5g per kg seed) before sowing to protect against root-rot disease.

3. Spacing & Depth: Sow seeds at 5 cm depth with 30 cm row spacing for optimal yield and growth.`,

      price: `💰 Market Rates & Mandi Intelligence (Krishi Sakhi Mandi Info)

1. Groundnut: Current Mandi prices are stable at ₹6,800 to ₹7,200 per quintal. MSP is ₹6,780.

2. Mustard: Current prices are trending upward, trading around ₹5,900 to ₹6,300 per quintal. MSP is ₹5,650.

3. Advice: If storage is available, hold mustard stock for another 3-4 weeks as demand is projected to rise, leading to higher prices.`,

      default: `👋 Namaste! I am Krishi Sakhi, your personal climate-resilience agricultural advisor.

I can help you with:
1. Soil testing, pH analysis, and fertilizer recipes.
2. Climate-smart crop planning and irrigation scheduling.
3. Government schemes, PM-KISAN, and lime subsidies.
4. Mandi prices and crop sales recommendations.

Ask me anything about your farm!`
    }
  };

  // Detect query type
  const langData = fallbacks[lang] || fallbacks.en;
  
  if (q.includes('मिट्टी') || q.includes('soil') || q.includes('माती') || q.includes('ಮಣ್ಣು') || q.includes('pH') || q.includes('पीएच')) {
    return langData.soil;
  }
  if (q.includes('मौसम') || q.includes('weather') || q.includes('हवामान') || q.includes('ಹವಾಮಾನ') || q.includes('बारिश') || q.includes('मಳೆ')) {
    return langData.weather;
  }
  if (q.includes('योजना') || q.includes('scheme') || q.includes('सब्सिडी') || q.includes('ಸಹಾಯಧನ') || q.includes('अनुदान') || q.includes('PM-KISAN') || q.includes('पीएम-किसान')) {
    return langData.scheme;
  }
  if (q.includes('फसल') || q.includes('crop') || q.includes('ಬೆಳೆ') || q.includes('पीक') || q.includes('बीज') || q.includes('बुवाई') || q.includes('ಬಿತ್ತನೆ')) {
    return langData.crop;
  }
  if (q.includes('भाव') || q.includes('price') || q.includes('मारुकಟ್ಟೆ') || q.includes('बाजार') || q.includes('ಮಾರುಕಟ್ಟೆ') || q.includes('मंडी') || q.includes('ಮಂಡಿ')) {
    return langData.price;
  }
  
  return langData.default;
}

// ============================================
// GEMINI API HELPER
// ============================================
async function callGemini(prompt, language = 'hi') {
  // Check if API key exists
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.log('⚠️ No Gemini API key - using fallback mode');
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    return null;
  }
}

// ============================================
// API ROUTES
// ============================================

// 1. Health Check (for Render)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: '🌾 Mitti Ki Awaaz is running!', 
    timestamp: new Date().toISOString(),
    gemini: process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' ? '✅ Connected' : '❌ Fallback Mode',
    uptime: process.uptime()
  });
});

// 2. Chat with Krishi Sakhi
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'hi' } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.json({ 
        success: true, 
        response: "Please ask something about farming! / कृपया खेती के बारे में कुछ पूछें!" 
      });
    }

    const systemPrompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS.en;
    const langName = language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : language === 'mr' ? 'Marathi' : 'English';
    
    const fullPrompt = `
${systemPrompt}

Farmer's Question: ${message}

Instructions:
1. Reply ONLY in ${langName} (${language})
2. Keep it short (3-5 sentences max)
3. Be helpful, empathetic, and actionable
4. Include specific numbers/quantities if relevant (kg, bigha, rupees, etc.)
5. Use bullet points for clarity

Response:`;

    // Try Gemini first
    let aiResponse = await callGemini(fullPrompt, language);
    
    // If Gemini fails, use fallback
    if (!aiResponse) {
      aiResponse = getFallbackResponse(message, language);
    }
    
    res.json({ 
      success: true, 
      response: aiResponse 
    });
    
  } catch (error) {
    console.error('Chat Error:', error.message);
    res.json({ 
      success: false, 
      response: getFallbackResponse(req.body.message, req.body.language || 'hi')
    });
  }
});

// 3. Soil Analysis
app.post('/api/soil-analyze', async (req, res) => {
  try {
    const { ph, language = 'hi' } = req.body;
    
    const systemPrompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS.en;
    const langName = language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : language === 'mr' ? 'Marathi' : 'English';
    
    const prompt = `
${systemPrompt}

Soil pH: ${ph}
Nutrients: Nitrogen - Low, Phosphorus - Medium, Potassium - High

Provide a 3-point analysis in ${langName}:
1. Soil health classification (Acidic/Neutral/Alkaline)
2. Treatment recommendation with exact quantities (kg per bigha)
3. Top 2 crop recommendations

Keep it short and actionable.

Response:`;

    // Try Gemini first
    let aiResponse = await callGemini(prompt, language);
    
    // If Gemini fails, use fallback
    if (!aiResponse) {
      aiResponse = getFallbackResponse('soil', language);
    }
    
    res.json({ 
      success: true, 
      response: aiResponse 
    });
    
  } catch (error) {
    console.error('Soil Analysis Error:', error.message);
    res.json({ 
      success: false, 
      response: getFallbackResponse('soil', req.body.language || 'hi')
    });
  }
});

// 4. Weather Forecast
app.post('/api/weather', async (req, res) => {
  try {
    const { location = 'Ramnagar, Karnataka', language = 'hi' } = req.body;
    
    const systemPrompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS.en;
    const langName = language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : language === 'mr' ? 'Marathi' : 'English';
    
    const prompt = `
${systemPrompt}

Location: ${location}

Provide a 3-day weather forecast in ${langName} including:
1. Temperature summary (high/low)
2. Rainfall chances
3. Any extreme weather warnings
4. Farming advice (irrigation timing, crop protection)

Keep it under 5 sentences.

Response:`;

    // Try Gemini first
    let aiResponse = await callGemini(prompt, language);
    
    // If Gemini fails, use fallback
    if (!aiResponse) {
      aiResponse = getFallbackResponse('weather', language);
    }
    
    res.json({ 
      success: true, 
      response: aiResponse 
    });
    
  } catch (error) {
    console.error('Weather Error:', error.message);
    res.json({ 
      success: false, 
      response: getFallbackResponse('weather', req.body.language || 'hi')
    });
  }
});

// 5. Scheme Information
app.post('/api/scheme', async (req, res) => {
  try {
    const { schemeName = 'PM-KISAN', language = 'hi' } = req.body;
    
    const systemPrompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS.en;
    const langName = language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : language === 'mr' ? 'Marathi' : 'English';
    
    const prompt = `
${systemPrompt}

Scheme: ${schemeName}

Provide information about this government scheme in ${langName} including:
1. Eligibility criteria
2. Benefits (amount, subsidies)
3. How to apply
4. Required documents

Keep it short and clear.

Response:`;

    // Try Gemini first
    let aiResponse = await callGemini(prompt, language);
    
    // If Gemini fails, use fallback
    if (!aiResponse) {
      aiResponse = getFallbackResponse('scheme', language);
    }
    
    res.json({ 
      success: true, 
      response: aiResponse 
    });
    
  } catch (error) {
    console.error('Scheme Error:', error.message);
    res.json({ 
      success: false, 
      response: getFallbackResponse('scheme', req.body.language || 'hi')
    });
  }
});

// 6. Crop Price Information
app.post('/api/price', async (req, res) => {
  try {
    const { crop = 'groundnut', language = 'hi' } = req.body;
    
    const systemPrompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS.en;
    const langName = language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : language === 'mr' ? 'Marathi' : 'English';
    
    const prompt = `
${systemPrompt}

Crop: ${crop}

Provide current market price information in ${langName} including:
1. Current Mandi price (per quintal)
2. MSP (Minimum Support Price)
3. Price trend (UP/DOWN/STABLE)
4. Selling advice

Keep it short.

Response:`;

    // Try Gemini first
    let aiResponse = await callGemini(prompt, language);
    
    // If Gemini fails, use fallback
    if (!aiResponse) {
      aiResponse = getFallbackResponse('price', language);
    }
    
    res.json({ 
      success: true, 
      response: aiResponse 
    });
    
  } catch (error) {
    console.error('Price Error:', error.message);
    res.json({ 
      success: false, 
      response: getFallbackResponse('price', req.body.language || 'hi')
    });
  }
});

// ============================================
// SERVE FRONTEND (SPA support)
// ============================================

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// For all other routes, serve index.html (SPA routing)
app.get('*', (req, res) => {
  // Don't interfere with API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong! Please try again.',
    details: err.message 
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(50));
  console.log('🌾 MITTI KI AWAAZ - Server Started');
  console.log('='.repeat(50));
  console.log(`📍 Local:    http://localhost:${PORT}`);
  console.log(`📍 Network:  http://0.0.0.0:${PORT}`);
  console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' ? '✅ CONNECTED' : '❌ FALLBACK MODE'}`);
  console.log(`📁 Serving:  ${__dirname}`);
  console.log('='.repeat(50) + '\n');
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});
