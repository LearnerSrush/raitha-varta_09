import { CropType, DiseaseRisk, Crop } from './types';

export const INITIAL_CROPS: Crop[] = [
  { 
    id: '1', 
    type: CropType.PADDY, 
    health: 92, 
    healthTrend: 'improving',
    risk: DiseaseRisk.LOW, 
    lastActivity: {
      en: 'Watered today',
      kn: 'ಇಂದು ನೀರುಣಿಸಲಾಗಿದೆ',
      hi: 'आज पानी दिया गया'
    },
    growthStage: {
      en: 'Tillering Stage',
      kn: 'ತೆನೆ ಬರುವ ಹಂತ',
      hi: 'कल्ले निकलने की अवस्था'
    },
    stageProgress: 45,
    diseasePrediction: {
      en: 'Healthy, monitor for stem borer.',
      kn: 'ಆರೋಗ್ಯಕರವಾಗಿದೆ, ಕಾಂಡ ಕೊರಕ ಹುಳು ಬಗ್ಗೆ ನಿಗಾ ಇರಲಿ.',
      hi: 'स्वस्थ, तना छेदक पर नजर रखें।'
    },
    diseaseCauses: {
      en: 'No active disease, but high humidity increases pest risk.',
      kn: 'ಯಾವುದೇ ಸಕ್ರಿಯ ರೋಗ ಇಲ್ಲ, ಆದರೆ ಹೆಚ್ಚಿನ ತೇವಾಂಶವು ಕೀಟಗಳ ಅಪಾಯವನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.',
      hi: 'कोई सक्रिय रोग नहीं, लेकिन उच्च आर्द्रता कीट जोखिम को बढ़ाती है।'
    },
    preventativeMeasures: [
      { en: 'Regular monitoring', kn: 'ನಿಯಮಿತ ಮೇಲ್ವಿಚಾರಣೆ', hi: 'नियमित निगरानी' },
      { en: 'Balanced nutrients', kn: 'ಪೋಷಕಾಂಶಗಳ ಸಮತೋಲನ', hi: 'संतुलित पोषक तत्व' },
      { en: 'Maintain water level', kn: 'ನೀರಿನ ಮಟ್ಟವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳುವುದು', hi: 'जल स्तर बनाए रखें' }
    ],
    recommendedActions: [
      { en: 'Check water level', kn: 'ನೀರಿನ ಮಟ್ಟವನ್ನು ಪರೀಕ್ಷಿಸಿ', hi: 'जल स्तर की जाँच करें' },
      { en: 'Apply Nitrogen if needed', kn: 'ಅಗತ್ಯವಿದ್ದರೆ ಸಾರಜನಕ ಅನ್ವಯಿಸಿ', hi: 'आवश्यकता होने पर नाइट्रोजन लगाएं' },
      { en: 'Monitor light traps', kn: 'ಕೀಟ ಬಲೆಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ', hi: 'प्रकाश जाल की निगरानी करें' }
    ],
    healthyImage: 'https://images.unsplash.com/photo-1594488651083-29a1ee1d707c?q=80&w=800&auto=format&fit=crop',
    galleryImages: ['https://images.unsplash.com/photo-1594488651083-29a1ee1d707c?q=80&w=800&auto=format&fit=crop'],
    environmentalRisk: { 
      humidity: 78, 
      temperature: 28, 
      message: {
        en: 'High humidity → Leaf spot risk in 2 days',
        kn: 'ಹೆಚ್ಚಿನ ತೇವಾಂಶ → 2 ದಿನಗಳಲ್ಲಿ ಎಲೆ ಮಚ್ಚೆ ರೋಗದ ಅಪಾಯ',
        hi: 'उच्च आर्द्रता → 2 दिनों में पत्ती धब्बा रोग का खतरा'
      }
    }
  },
  { 
    id: '2', 
    type: CropType.TOMATO, 
    health: 65, 
    healthTrend: 'declining',
    risk: DiseaseRisk.MEDIUM, 
    lastActivity: {
      en: 'Fertilized 2 days ago',
      kn: '2 ದಿನಗಳ ಹಿಂದೆ ಗೊಬ್ಬರ ಹಾಕಲಾಗಿದೆ',
      hi: '2 दिन पहले खाद डाली गई'
    },
    growthStage: {
      en: 'Flowering Stage',
      kn: 'ಹೂಬಿಡುವ ಹಂತ',
      hi: 'फूल आने की अवस्था'
    },
    stageProgress: 60,
    diseasePrediction: {
      en: 'Early Blight symptoms detected.',
      kn: 'ಬೇಗನೆ ಬರುವ ಎಲೆ ಮಚ್ಚೆ ರೋಗದ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದಿವೆ.',
      hi: 'अगेती झुलसा के लक्षण मिले।'
    },
    diseaseCauses: {
      en: 'Alternaria solani fungus spreads in humid conditions.',
      kn: 'ಆಲ್ಟರ್ನೇರಿಯಾ ಸೋಲಾನಿ ಶಿಲೀಂಧ್ರವು ತೇವಾಂಶವುಳ್ಳ ಪರಿಸ್ಥಿತಿಗಳಲ್ಲಿ ಹರಡುತ್ತದೆ.',
      hi: 'अल्टरनेरिया सोलानी कवक आर्द्र परिस्थितियों में फैलता है।'
    },
    preventativeMeasures: [
      { en: 'Use resistant varieties', kn: 'ರೋಗ ನಿರೋಧಕ ತಳಿಗಳ ಬಳಕೆ', hi: 'प्रतिरोधी किस्मों का प्रयोग करें' },
      { en: 'Ensure air circulation', kn: 'ಉತ್ತಮ ಗಾಳಿ ಸಂಚಾರ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳುವುದು', hi: 'वायु संचार सुनिश्चित करें' },
      { en: 'Mulching', kn: 'ಮಲ್ಚಿಂಗ್ ಮಾಡುವುದು', hi: 'मल्चिंग' }
    ],
    recommendedActions: [
      { en: 'Remove infected leaves', kn: 'ಸೋಂಕಿತ ಎಲೆಗಳನ್ನು ತೆಗೆಯಿರಿ', hi: 'संक्रमित पत्तियों को हटाएँ' },
      { en: 'Apply organic fungicide', kn: 'ಸವಯವ ಶಿಲೀಂಧ್ರನಾಶಕ ಅನ್ವಯಿಸಿ', hi: 'जैविक कवकनाशी लगाएं' },
      { en: 'Maintain proper spacing', kn: 'ಸರಿಯಾದ ಅಂತರವನ್ನು ಕಾಯ್ದುಕೊಳ್ಳಿ', hi: 'उचित दूरी बनाए रखें' }
    ],
    healthyImage: 'https://images.unsplash.com/photo-1518977676601-b53f02bad6d5?q=80&w=800&auto=format&fit=crop',
    galleryImages: ['https://images.unsplash.com/photo-1518977676601-b53f02bad6d5?q=80&w=800&auto=format&fit=crop'],
    symptoms: [
      { en: 'Small brown spots on lower leaves', kn: 'ಕೆಳಭಾಗದ ಎಲೆಗಳ ಮೇಲೆ ಸಣ್ಣ ಕಂದು ಕಲೆಗಳು', hi: 'नीचे की पत्तियों पर छोटे भूरे रंग के धब्बे' },
      { en: 'Yellowing surrounding tissue', kn: 'ಸುತ್ತಮುತ್ತಲಿನ ಅಂಗಾಂಶ ಹಳದಿ ಬಣ್ಣಕ್ಕೆ ತಿರುಗುವುದು', hi: 'पीलापन आसपास का ऊतक' }
    ],
    treatmentSteps: [
      { 
        step: { en: 'Remove diseased leaves immediately.', kn: 'ಶಿಲೀಂಧ್ರ ಹರಡುವುದನ್ನು ಕಡಿಮೆ ಮಾಡಲು ರೋಗಪೀಡಿತ ಎಲೆಗಳನ್ನು ತಕ್ಷಣ ತೆಗೆದುಹಾಕಿ.', hi: 'रोगग्रस्त पत्तियों को तुरंत हटा दें।' }, 
        dosage: { en: 'Manual', kn: 'ಹಸ್ತಚಾಲಿತ', hi: 'मैनुअल' } 
      },
      { 
        step: { en: 'Apply Chlorothalonil or Copper-based fungicide.', kn: 'ಕ್ಲೋರೋಥಲೋನಿಲ್ ಅಥವಾ ತಾಮ್ರ ಆಧಾರಿತ ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ಅನ್ವಯಿಸಿ.', hi: 'क्लोरोथालोनिल या तांबा आधारित कवकनाशी लगाएं।' }, 
        dosage: { en: '2g per Litre', kn: 'ಲೀಟರ್ ನೀರಿಗೆ 2 ಗ್ರಾಂ', hi: '2 ग्राम प्रति लीटर' } 
      }
    ],
    expectedRecovery: { en: '10-14 days', kn: '10-14 ದಿನಗಳು', hi: '10-14 दिन' }
  },
  { 
    id: '3', 
    type: CropType.COCONUT, 
    health: 98, 
    healthTrend: 'stable',
    risk: DiseaseRisk.LOW, 
    lastActivity: {
      en: 'Inspected last month',
      kn: 'ಕಳೆದ ತಿಂಗಳು ತಪಾಸಣೆ ಮಾಡಲಾಗಿದೆ',
      hi: 'पिछले महीने निरीक्षण किया गया'
    },
    growthStage: {
      en: 'Mature Stage',
      kn: 'ಪಕ್ವ ಹಂತ',
      hi: 'परिपक्व अवस्था'
    },
    stageProgress: 95,
    diseasePrediction: {
      en: 'Strong immunity detected.',
      kn: 'ಹೆಚ್ಚಿನ ರೋಗ ನಿರೋಧಕ ಶಕ್ತಿ ಕಂಡುಬಂದಿದೆ.',
      hi: 'मजबूत रोग प्रतिरोधक क्षमता पाई गई।'
    },
    diseaseCauses: {
      en: 'Environment not favorable for pathogens.',
      kn: 'ಪರಿಸರವು ಪ್ರಸ್ತುತ ಪ್ರಮುಖ ರೋಗಕಾರಕಗಳಿಗೆ ಅನುಕೂಲಕರವಾಗಿಲ್ಲ.',
      hi: 'पर्यावरण रोगजनकों के लिए अनुकूल नहीं है।'
    },
    preventativeMeasures: [
      { en: 'Soil testing', kn: 'ವೈಜ್ಞಾನಿಕವಾಗಿ ಮಣ್ಣು ಪರೀಕ್ಷೆ', hi: 'मिट्टी परीक्षण' },
      { en: 'Balanced fertilizer', kn: 'ಸಮತೋಲಿತ ಗೊಬ್ಬರ', hi: 'संतुलित उर्वरक' },
      { en: 'Crown cleaning', kn: 'ಗಿಡದ ಮೇಲ್ಭಾಗವನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸುವುದು', hi: 'क्राउन की सफाई' }
    ],
    recommendedActions: [
      { en: 'Regular mulching', kn: 'ನಿಯಮಿತವಾಗಿ ಮಲ್ಚಿಂಗ್', hi: 'नियमित मल्चिंग' },
      { en: 'Check for Rhinoceros beetle', kn: 'ಮೂಗನ ಬಂಡಲಿ ಕೀಟಕ್ಕಾಗಿ ಪರೀಕ್ಷಿಸಿ', hi: 'ರಾಇನೋಸೆರೊಸ್ ಕೀಟಕ್ಕಾಗಿ ಪತ್ತೆ ಹಚ್ಚಿ' },
      { en: 'Clean base', kn: 'ಗಿಡದ ಬುಡ ಸ್ವಚ್ಛಗೊಳಿಸಿ', hi: 'आधार साफ करें' }
    ],
    healthyImage: 'https://images.unsplash.com/photo-1543158266-0066955047b1?q=80&w=800&auto=format&fit=crop',
    galleryImages: ['https://images.unsplash.com/photo-1543158266-0066955047b1?q=80&w=800&auto=format&fit=crop']
  },
  { 
    id: '4', 
    type: CropType.MAIZE, 
    health: 85, 
    healthTrend: 'stable',
    risk: DiseaseRisk.LOW, 
    lastActivity: {
      en: 'Urea applied yesterday',
      kn: 'ನಿನ್ನೆ ಯೂರಿಯಾ ಅನ್ವಯಿಸಲಾಗಿದೆ',
      hi: 'कल यूरिया डाला गया'
    },
    growthStage: {
      en: 'Knee High Stage',
      kn: 'ಮೊಣಕಾಲು ಎತ್ತರದ ಹಂತ',
      hi: 'घुटने की ऊँचाई की अवस्था'
    },
    stageProgress: 35,
    diseasePrediction: {
      en: 'Healthy, monitor for Fall Armyworm.',
      kn: 'ಆರೋಗ್ಯಕರವಾಗಿದೆ, ಸೈನಿಕ ಹುಳು ಬಗ್ಗೆ ನಿಗಾ ಇರಲಿ.',
      hi: 'स्वस्थ, फॉल आर्मीवॉर्म पर नजर रखें।'
    },
    diseaseCauses: {
      en: 'Warm temperatures favor pest reproduction.',
      kn: 'ಬೆಚ್ಚಗಿನ ತಾಪಮಾನವು ಕೀಟಗಳ ಸಂತಾನೋತ್ಪತ್ತಿಗೆ ಅನುಕೂಲಕರವಾಗಿದೆ.',
      hi: 'गर्म तापमान कीटों के प्रजनन के अनुकूल होता है।'
    },
    preventativeMeasures: [
      { en: 'Early sowing', kn: 'ಮುಂಚಿತವಾಗಿ ಬಿತ್ತನೆ ಮಾಡುವುದು', hi: 'अगेती बुवाई' },
      { en: 'Intercropping', kn: 'ಅಂತರ ಬೆಳೆ ಪದ್ಧತಿ', hi: 'अंतःफसल' },
      { en: 'Pheromone traps', kn: 'ಫೆರೋಮೋನ್ ಬಲೆಗಳ ಬಳಕೆ', hi: 'फेरोमोन ट्रैप' }
    ],
    recommendedActions: [
      { en: 'Sand/lime in whorls', kn: 'ಸುಳಿಯಲ್ಲಿ ಮರಳು ಅಥವಾ ಸುಣ್ಣದ ಬಳಕೆ', hi: 'भंवरों में रेत/चूना' },
      { en: 'Weeding', kn: 'ಕಳೆ ತೆಗೆಯುವುದು', hi: 'निराई' }
    ],
    healthyImage: 'https://images.unsplash.com/photo-1551727041-5b347d65b633?q=80&w=800&auto=format&fit=crop',
    galleryImages: ['https://images.unsplash.com/photo-1551727041-5b347d65b633?q=80&w=800&auto=format&fit=crop']
  },
  { 
    id: '5', 
    type: CropType.SUGARCANE, 
    health: 78, 
    healthTrend: 'declining',
    risk: DiseaseRisk.MEDIUM, 
    lastActivity: {
      en: 'Surface irrigation',
      kn: 'ಮೇಲ್ಮೈ ನೀರಾವರಿ',
      hi: 'सतह सिंचाई'
    },
    growthStage: {
      en: 'Grand Growth Stage',
      kn: 'ಬೆಳವಣಿಗೆಯ ಹಂತ',
      hi: 'भव्य विकास अवस्था'
    },
    stageProgress: 55,
    diseasePrediction: {
      en: 'Red Rot symptoms at base detected.',
      kn: 'ಕೆಳಭಾಗದಲ್ಲಿ ಕೆಂಪು ಕೊಳೆ ರೋಗದ ಲಕ್ಷಣಗಳು ಪತ್ತೆಯಾಗಿವೆ.',
      hi: 'आधार पर लाल सड़न के लक्षण मिले।'
    },
    diseaseCauses: {
      en: 'Waterlogging or infected sets used during planting.',
      kn: 'ನೀರು ನಿಲ್ಲುವುದು ಅಥವಾ ಬಿತ್ತನೆಯ ಸಮಯದಲ್ಲಿ ಸೋಂಕಿತ ಕಡ್ಡಿಗಳ ಬಳಕೆ.',
      hi: 'जलजमाव या रोपण के दौरान संक्रमित सेट का उपयोग।'
    },
    preventativeMeasures: [
      { en: 'Use healthy sets', kn: 'ಆರೋಗ್ಯಕರ ಕಡ್ಡಿಗಳ ಬಳಕೆ', hi: 'स्वस्थ सेट का प्रयोग करें' },
      { en: 'Good drainage', kn: 'ಉತ್ತಮ ಒಳಚರಂಡಿ', hi: 'अच्छी जल निकासी' },
      { en: 'Crop rotation', kn: 'ಬೆಳೆ ಸರದಿ', hi: 'ಫಸಲು ಚಕ್ರ' }
    ],
    recommendedActions: [
      { en: 'Remove infected plants', kn: 'ಸೋಂಕಿತ ಗಿಡಗಳನ್ನು ತೆಗೆಯಿರಿ', hi: 'संक्रमित पौधों को हटाएँ' },
      { en: 'Improve drainage', kn: 'ಒಳಚರಂಡಿ ವ್ಯವಸ್ಥೆ ಸುಧಾರಿಸಿ', hi: 'जल निकासी में सुधार करें' }
    ],
    healthyImage: 'https://images.unsplash.com/photo-1596700079541-10c0f8646b19?q=80&w=800&auto=format&fit=crop',
    galleryImages: ['https://images.unsplash.com/photo-1596700079541-10c0f8646b19?q=80&w=800&auto=format&fit=crop']
  },
  { 
    id: '6', 
    type: CropType.CHILLI, 
    health: 55, 
    healthTrend: 'declining',
    risk: DiseaseRisk.HIGH, 
    lastActivity: {
      en: 'Fungicide sprayed 4 days ago',
      kn: '4 ದಿನಗಳ ಹಿಂದೆ ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಿಸಲಾಗಿದೆ',
      hi: '4 दिन पहले कवकनाशी का छिड़काव किया गया'
    },
    growthStage: {
      en: 'Fruiting Stage',
      kn: 'ಫಲ ನೀಡುವ ಹಂತ',
      hi: 'फल लगने की अवस्था'
    },
    stageProgress: 80,
    diseasePrediction: {
      en: 'Chilli Leaf Curl Virus confirmed.',
      kn: 'ಮೆಣಸಿನಕಾಯಿ ಎಲೆ ಮುದುಡುವ ವೈರಸ್ ದೃಢಪಟ್ಟಿದೆ.',
      hi: 'मिर्च लीफ कर्ल वायरस की पुष्टि हुई।'
    },
    diseaseCauses: {
      en: 'Spread by Whiteflies (Bemisia tabaci).',
      kn: 'ಬಿಳಿ ನೊಣಗಳಿಂದ (Bemisia tabaci) ಹರಡುತ್ತದೆ.',
      hi: 'सफेद मक्खियों (बेमिसिया तबाती) द्वारा फैलता है।'
    },
    preventativeMeasures: [
      { en: 'Vector control', kn: 'ವಾಹಕ ನಿಯಂತ್ರಣ', hi: 'वेक्टर नियंत्रण' },
      { en: 'Eradicate infected plants', kn: 'ಸೋಂಕಿತ ಗಿಡಗಳ ನಿರ್ಮೂಲನೆ', hi: 'संक्रमित पौधों को खत्म करें' },
      { en: 'Yellow sticky traps', kn: 'ಹಳದಿ ಅಂಟು ಬಲೆಗಳ ಬಳಕೆ', hi: 'पीले चिपचिपे जाल' }
    ],
    recommendedActions: [
      { en: 'Apply Neem oil', kn: 'ಬೇವಿನ ಎಣ್ಣೆ ಅನ್ವಯಿಸಿ', hi: 'नीम के तेल का प्रयोग करें' },
      { en: 'Control whitefly population', kn: 'ಬಿಳಿ ನೊಣ ಸಂಖ್ಯೆ ನಿಯಂತ್ರಿಸಿ', hi: 'सफेद मक्खी की आबादी को नियंत्रित करें' },
      { en: 'Uproot infected plants', kn: 'ಸೋಂಕಿತ ಗಿಡಗಳನ್ನು ಕಿತ್ತು ಹಾಕಿ', hi: 'ಸೋಂಕಿತ ಗಿಡಗಳನ್ನು ಕಿತ್ತು ಹಾಕಿ' }
    ],
    healthyImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop',
    galleryImages: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop'],
    symptoms: [
      { en: 'Upward curling of leaves', kn: 'ಎಲೆಗಳು ಮೇಲ್ಮುಖವಾಗಿ ಮುದುಡುವುದು', hi: 'पत्तियों का ऊपर की ओर मुड़ना' },
      { en: 'Stunted plant growth', kn: 'ಗಿಡದ ಬೆಳವಣಿಗೆ ಕುಂಠಿತವಾಗುವುದು', hi: 'पौधे का विकास रुक जाना' }
    ],
    treatmentSteps: [
      { 
        step: { en: 'Install 20 yellow sticky traps per acre.', kn: 'ಬಿಳಿ ನೊಣಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಲು ಪ್ರತಿ ಎಕರೆಗೆ 20 ಹಳದಿ ಅಂಟು ಬಲೆಗಳನ್ನು ಸ್ಥಾಪಿಸಿ.', hi: 'प्रति एकड़ 20 पीले चिपचिपे जाल लगाएं।' }, 
        dosage: { en: '20 traps/acre', kn: 'ಎಕರೆಗೆ 20 ಬಲೆಗಳು', hi: '20 जाल/एकड़' } 
      },
      { 
        step: { en: 'Spray Imidacloprid 17.8 SL at early stage.', kn: 'ಆರಂಭಿಕ ಹಂತದಲ್ಲಿ ಇಮಿಡಾಕ್ಲೋಪ್ರಿಡ್ 17.8 SL ಸಿಂಪಡಿಸಿ.', hi: 'शुरुआती चरण में इमिडाक्लोप्रिड 17.8 SL का छिड़काव करें।' }, 
        dosage: { en: '0.5ml per Litre', kn: 'ಲೀಟರ್ ನೀರಿಗೆ 0.5 ಮಿಲಿ', hi: '0.5 मिली प्रति लीटर' } 
      },
      { 
        step: { en: 'Use Neem oil (1500 ppm).', kn: 'ಬೇವಿನ ಎಣ್ಣೆ (1500 ppm) ಬಳಸಿ.', hi: 'नीम तेल (1500 पीपीएम) का प्रयोग करें।' }, 
        dosage: { en: '5ml per Litre', kn: 'ಲೀಟರ್ ನೀರಿಗೆ 5 ಮಿಲಿ', hi: '5 मिली प्रति लीटर' } 
      }
    ],
    expectedRecovery: { en: '7-10 days for pest control', kn: 'ಕೀಟ ನಿಯಂತ್ರಣಕ್ಕೆ 7-10 ದಿನಗಳು', hi: 'कीट नियंत्रण के लिए 7-10 दिन' }
  }
];

export const SAMPLE_TIPS = [
  {
    id: 't1',
    image: 'https://images.unsplash.com/photo-1536633100185-1d0263675a6c?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1594488651083-29a1ee1d707c?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516912481808-34091f85040d?q=80&w=400&auto=format&fit=crop'
    ],
    title: { en: 'Paddy Pest Control', hi: 'धान कीट नियंत्रण', kn: 'ಭತ್ತದ ಕೀಟಗಳ ನಿಯಂತ್ರಣ' },
    description: { en: 'Keep water level at 2-3 inches to prevent stem borer infestation.', hi: 'तना छेदक के संक्रमण को रोकने के लिए जल स्तर 2-3 इंच पर रखें।', kn: 'ಕಾಂಡ ಕೊರಕ ಹುಳು ತಡೆಗಟ್ಟಲು ನೀರಿನ ಮಟ್ಟವನ್ನು 2-3 ಇಂಚುಗಳಷ್ಟು ಇರಿಸಿ.' },
    actionLine: { en: 'Maintain field flooding consistency.', hi: 'खेत में पानी भरने की निरंतरता बनाए रखें।', kn: 'ಫೀಲ್ಡ್ ಫ್ಲಡ್ಡಿಂಗ್ ಸ್ಥಿರತೆಯನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ.' },
    dosageInfo: { en: 'Inspect every morning.', hi: 'हर सुबह निरीक्षण करें।', kn: 'ಪ್ರತಿದಿನ ಬೆಳಗ್ಗೆ ಪರಿಶೀಲಿಸಿ.' }
  },
  {
    id: 't2',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307bac?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1518977676601-b53f02bad6d5?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400&auto=format&fit=crop'
    ],
    title: { en: 'Tomato Disease Prevention', hi: 'टमाटर रोग रोकथाम', kn: 'ಟೊಮೆಟೊ ರೋಗ ತಡೆಗಟ್ಟುವಿಕೆ' },
    description: { en: 'Avoid overhead watering to reduce foliage wetness and disease risk.', hi: 'पत्तियों की नमी और बीमारी के जोखिम को कम करने के लिए ऊपर से पानी देने से बचें।', kn: 'ಎಲೆಗಳ ತೇವ ಮತ್ತು ರೋಗದ ಅಪಾಯ ಕಡಿಮೆ ಮಾಡಲು ಮೇಲಿನಿಂದ ನೀರು ಹಾಕುವುದನ್ನು ತಪ್ಪಿಸಿ.' },
    actionLine: { en: 'Water at the base of the plant.', hi: 'पौधे के आधार पर पानी दें।', kn: 'ಗಿಡದ ಬುಡಕ್ಕೆ ನೀರು ಹಾಕಿ.' },
    dosageInfo: { en: 'Use mulching to keep soil cool.', hi: 'मिट्टी को ठंडा रखने के लिए मल्चिंग का प्रयोग करें।', kn: 'ಮಣ್ಣನ್ನು ತಂಪಾಗಿರಿಸಲು ಮಲ್ಚಿಂಗ್ ಬಳಸಿ.' }
  },
  {
    id: 't3',
    image: 'https://images.unsplash.com/photo-1591857177580-dc32d7abc496?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1464226184884-fa280b6708ee?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599388301131-07775cecc476?q=80&w=400&auto=format&fit=crop'
    ],
    title: { en: 'Soil Health Management', hi: 'मृदा स्वास्थ्य प्रबंधन', kn: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ನಿರ್ವಹಣೆ' },
    description: { en: 'Test soil pH levels annually to ensure proper nutrient uptake.', hi: 'उचित पोषक तत्व ग्रहण सुनिश्चित करने के लिए सालाना मिट्टी के पीएच स्तर का परीक्षण करें।', kn: 'ಪೋಷಕಾಂಶಗಳ ಹೀರಿಕೊಳ್ಳುವಿಕೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ವಾರ್ಷಿಕವಾಗಿ ಮಣ್ಣಿನ pH ಮಟ್ಟವನ್ನು ಪರೀಕ್ಷಿಸಿ.' },
    actionLine: { en: 'Collect samples after harvest.', hi: 'कटाई के बाद नमूने एकत्र करें।', kn: 'ಕೊಯ್ಲು ಮಾಡಿದ ನಂತರ ಮಾದರಿಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ.' },
    dosageInfo: { en: 'Send to local labs for report.', hi: 'रिपोर्ट के लिए स्थानीय लैब में भेजें।', kn: 'ವರದಿಗಾಗಿ ಸ್ಥಳೀಯ ಲ್ಯಾಬ್‌ಗಳಿಗೆ ಕಳುಹಿಸಿ.' }
  },
  {
    id: 't4',
    image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c3c1b?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1463123010508-f4e47de9528a?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=400&auto=format&fit=crop'
    ],
    title: { en: 'Drip Irrigation Setup', hi: 'ड्रिप सिंचाई सेटअप', kn: 'ಹನಿ ನೀರಾವರಿ ಸ್ಥಾಪನೆ' },
    description: { en: 'Drip irrigation reduces water waste by 60% and increases yield.', hi: 'ड्रिप सिंचाई पानी की बर्बादी को 60% तक कम करती है और उपज बढ़ाती है।', kn: 'ಹನಿ ನೀರಾವರಿಯು ನೀರಿನ ವ್ಯರ್ಥವನ್ನು 60% ರಷ್ಟು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ ಮತ್ತು ಇಳುವರಿಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.' },
    actionLine: { en: 'Clean filters regularly.', hi: 'नियमित रूप से फिल्टर साफ करें।', kn: 'ಫಿಲ್ಟರ್‌ಗಳನ್ನು ನಿಯಮಿತವಾಗಿ ಸ್ವಚ್ಛಗೊಳಿಸಿ.' },
    dosageInfo: { en: 'Check emitters for clogs.', hi: 'क्लॉग्स के लिए एमिटर की जांच करें।', kn: 'ತಡೆಗಳಿಗಾಗಿ ಎಮಿಟರ್‌ಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ.' }
  },
  {
    id: 't5',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1585314062340-f1a5acc79900?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595033538458-7474482969bb?q=80&w=400&auto=format&fit=crop'
    ],
    title: { en: 'Organic Fertilizer', hi: 'जैविक खाद', kn: 'ಸವಯವ ಗೊಬ್ಬರ' },
    description: { en: 'Use vermicompost to enrich soil microbes and structure.', hi: 'मिट्टी के सूक्ष्मजीवों और संरचनाವನ್ನು समृद्ध करने के लिए वर्मीकम्पೋಸ್ಟ್ का उपयोग करें।', kn: 'ಮಣ್ಣಿನ ಸೂಕ್ಷ್ಮಜೀವಿಗಳು ಮತ್ತು ವಿನ್ಯಾಸವನ್ನು ಸಮೃದ್ಧಗೊಳಿಸಲು ವರ್ಮಿಕಾಂಪೋಸ್ಟ್ ಬಳಸಿ.' },
    actionLine: { en: 'Mix 5kg per plant base.', hi: 'प्रति पौधे के आधार पर 5 किग्रा मिलाएं।', kn: 'ಪ್ರತಿ ಸಸ್ಯದ ಬುಡಕ್ಕೆ 5 ಕೆಜಿ ಮಿಶ್ರಣ ಮಾಡಿ.' },
    dosageInfo: { en: 'Apply before monsoon.', hi: 'मानसून से पहले प्रयोग करें।', kn: 'ಮುಂಗಾರು ಮೊದಲು ಅನ್ವಯಿಸಿ.' }
  }
];

export const INITIAL_ALERTS = [
  {
    id: 'a1',
    type: 'rain',
    severity: 'high',
    message: {
      en: 'Heavy rain expected in your district tomorrow. Avoid harvesting.',
      hi: 'कल आपके जिले में भारी बारिश की संभावना है। कटाई से बचें।',
      kn: 'ನಿಮ್ಮ ಜಿಲ್ಲೆಯಲ್ಲಿ ನಾಳೆ ಭಾರಿ ಮಳೆ ನಿರೀಕ್ಷೆಯಿದೆ. ಫಸಲು ಕಟಾವು ಮಾಡಬೇಡಿ.'
    },
    timestamp: new Date().toISOString()
  }
];
