import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff, Volume2, X, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onCommand: (command: string) => void;
  activeTab: string;
  isVoiceMode: boolean;
}

export const VoiceControl: React.FC<Props> = ({ onCommand, activeTab, isVoiceMode }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const { i18n } = useTranslation();

  // Reference for recognition to keep it stable
  const recognitionRef = React.useRef<any>(null);

  const speak = useCallback((text: string) => {
    // Stop any existing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Choose appropriate voice based on app language
    let lang = 'en-US';
    if (i18n.language === 'kn') lang = 'kn-IN';
    if (i18n.language === 'hi') lang = 'hi-IN';
    
    utterance.lang = lang;
    const matchedVoice = voices.find(v => v.lang.includes(lang)) || voices[0];
    if (matchedVoice) utterance.voice = matchedVoice;
    
    window.speechSynthesis.speak(utterance);
  }, [i18n.language]);

  const handleVoiceCommand = useCallback((cmd: string) => {
    setFeedback(`Heard: "${cmd}"`);
    const lowerCmd = cmd.toLowerCase();
    
    // Commands in English/Kannada/Hindi
    const isHome = lowerCmd.includes('home') || lowerCmd.includes('dash') || lowerCmd.includes('ಮನೆ') || lowerCmd.includes('मुख्य');
    const isCrops = lowerCmd.includes('crop') || lowerCmd.includes('plant') || lowerCmd.includes('ಬೆಳೆ') || lowerCmd.includes('ಫಸಲು') || lowerCmd.includes('ಕ್ರಾಪ್') || lowerCmd.includes('ಫಸಲ್') || lowerCmd.includes('पौधा');
    const isScan = lowerCmd.includes('scan') || lowerCmd.includes('camera') || lowerCmd.includes('disease') || lowerCmd.includes('ಕ್ಯಾಮೆರಾ') || lowerCmd.includes('ರೋಗ') || lowerCmd.includes('ಮಾರ್ಗ') || lowerCmd.includes('स्कैन') || lowerCmd.includes('बीमारी');
    const isAlerts = lowerCmd.includes('alert') || lowerCmd.includes('warning') || lowerCmd.includes('notice') || lowerCmd.includes('ಎಚ್ಚರಿಕೆ') || lowerCmd.includes('ನೋಟಿಸ್') || lowerCmd.includes('चेतावनी') || lowerCmd.includes('अलर्ट');
    const isProfile = lowerCmd.includes('profile') || lowerCmd.includes('account') || lowerCmd.includes('setting') || lowerCmd.includes('ಪ್ರೊಫೈಲ್') || lowerCmd.includes('ಖಾತೆ') || lowerCmd.includes('प्रोफ़ाइल') || lowerCmd.includes('सेटिंग');
    const isHelp = lowerCmd.includes('help') || lowerCmd.includes('what') || lowerCmd.includes('ಸಹಾಯ') || lowerCmd.includes('मदद');

    if (isHome) {
      onCommand('home');
      const phrases: any = {
        kn: 'ಖಂಡಿತ, ನಿಮ್ಮ ಮುಖ್ಯ ಪುಟಕ್ಕೆ ಬದಲಾಯಿಸುತ್ತಿದ್ದೇನೆ.',
        hi: 'जी, आपके मुख्य डैशबोर्ड पर जा रहे हैं।',
        en: 'Sure, switching to your home dashboard. Ready for your next task.'
      };
      speak(phrases[i18n.language] || phrases['en']);
    } else if (isCrops) {
      onCommand('crops');
      const phrases: any = {
        kn: 'ನಿಮ್ಮ ಎಲ್ಲಾ ಬೆಳೆಗಳ ವಿವರಗಳನ್ನು ಇಲ್ಲಿ ನೋಡಬಹುದು.',
        hi: 'आपकी सभी फसलों की जानकारी यहाँ उपलब्ध है।',
        en: 'Accessing your crop records. Here are your active plants.'
      };
      speak(phrases[i18n.language] || phrases['en']);
    } else if (isScan) {
      onCommand('scan');
      const phrases: any = {
        kn: 'ರೋಗ ಪತ್ತೆ ಹಚ್ಚಲು ಕ್ಯಾಮರಾವನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತಿದ್ದೇನೆ.',
        hi: 'बीमारी का पता लगाने के लिए कैमरा खोल रहे हैं।',
        en: 'Activating scanning mode. Please point the camera at the affected leaves.'
      };
      speak(phrases[i18n.language] || phrases['en']);
    } else if (isAlerts) {
      onCommand('alerts');
      const phrases: any = {
        kn: 'ನಿಮ್ಮ ಪ್ರದೇಶದ ಇತ್ತೀಚಿನ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದ್ದೇನೆ.',
        hi: 'आपके क्षेत्र के ताज़ा अलर्ट देख रहे हैं।',
        en: 'Checking latest localized alerts and weather warnings for you.'
      };
      speak(phrases[i18n.language] || phrases['en']);
    } else if (isProfile) {
      onCommand('profile');
      const phrases: any = {
        kn: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್ ಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.',
        hi: 'आपकी प्रोफ़ाइल और सेटिंग्स खोल रहे हैं।',
        en: 'Opening your profile and application preferences.'
      };
      speak(phrases[i18n.language] || phrases['en']);
    } else if (isHelp) {
      const phrases: any = {
        kn: 'ನೀವು ಹೋಮ್, ಬೆಳೆಗಳು, ಸ್ಕ್ಯಾನ್, ಅಥವಾ ಎಚ್ಚರಿಕೆಗಳು ಎಂದು ಹೇಳಬಹುದು.',
        hi: 'आप होम, फसल, स्कैन या अलर्ट कह सकते हैं।',
        en: 'I can help you navigate. Try saying Home, My Crops, Scan Plant, or Show Alerts.'
      };
      speak(phrases[i18n.language] || phrases['en']);
    } else {
      const phrases: any = {
        kn: 'ಕ್ಷಮಿಸಿ, ಅದು ಅರ್ಥವಾಗಲಿಲ್ಲ. ಮತ್ತೊಮ್ಮೆ ಹೇಳಿ?',
        hi: 'माफ़ कीजिए, मैं समझ नहीं पाया। क्या आप दोहरा सकते हैं?',
        en: "I didn't quite catch that. Could you repeat the command?"
      };
      speak(phrases[i18n.language] || phrases['en']);
    }

    setTimeout(() => {
      setTranscript('');
      setFeedback('');
    }, 4000);
  }, [onCommand, speak, i18n.language]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    
    const langMap: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'kn': 'kn-IN'
    };
    rec.lang = langMap[i18n.language] || 'en-US';

    rec.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript;
      setTranscript(result);

      if (event.results[current].isFinal) {
        handleVoiceCommand(result);
      }
    };

    rec.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        console.error('Speech recognition error', event.error);
        setFeedback('Microphone access denied');
      } else if (event.error === 'no-speech') {
        // Silent or subtle feedback for no-speech
        setFeedback('No speech detected');
        setTimeout(() => setFeedback(''), 2000);
      } else if (event.error === 'network') {
        process.env.NODE_ENV === 'development' 
          ? setFeedback('Network error: Try opening in a new tab')
          : setFeedback('Network error: Check your connection');
        console.error('Speech recognition network error');
        setTimeout(() => setFeedback(''), 4000);
      } else if (event.error === 'aborted') {
        setFeedback(''); 
      } else {
        console.error('Speech recognition error', event.error);
        setFeedback(`Error: ${event.error}`);
        setTimeout(() => setFeedback(''), 3000);
      }
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
  }, [handleVoiceCommand, i18n.language]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      setFeedback('Listening...');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Recognition start error:', e);
        setIsListening(false);
      }
    }
  };

  if (!isSupported) return null;

  return (
    <div className="fixed bottom-48 right-6 z-[60]">
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 bg-black/90 text-white p-4 rounded-3xl shadow-2xl backdrop-blur-md min-w-[200px] border border-white/20 whitespace-nowrap"
          >
            <div className="flex items-center gap-2 mb-1">
              <Command className="w-3 h-3 text-green-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Voice Feedback</span>
            </div>
            <p className="font-bold text-sm">{feedback}</p>
            {transcript && transcript !== feedback.replace('Heard: "', '').replace('"', '') && (
              <p className="text-[10px] text-gray-400 italic mt-1">{transcript}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        animate={isVoiceMode && !isListening ? { scale: [1, 1.1, 1] } : {}}
        transition={isVoiceMode && !isListening ? { repeat: Infinity, duration: 2 } : {}}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all relative ${
          isListening 
            ? 'bg-red-500 text-white ring-4 ring-red-100' 
            : isVoiceMode 
              ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 shadow-indigo-200'
              : 'bg-green-600 text-white ring-4 ring-green-100'
        }`}
      >
        {isListening ? (
          <div className="relative">
            <MicOff className="w-6 h-6" />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-0 bg-white rounded-full -z-10"
            />
          </div>
        ) : (
          <Mic className="w-6 h-6" />
        )}
        
        {isListening && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};
