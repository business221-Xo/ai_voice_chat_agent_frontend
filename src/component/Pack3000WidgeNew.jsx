import React, { useState, useRef, useEffect } from 'react';

const PACK_3000_LOGO = 'pack-slogan.png';
const PHONE_NUMBER = '#11222212';

const Pack3000Widget = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(null); // 'chat' or 'voice'
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello, what can I help you with?' }
  ]);
  const [input, setInput] = useState('');

  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const isSpeakingRef = useRef(false);

  // Send message to backend and get AI response
  const sendMessage = async (msg) => {
    setMessages(prev => [...prev, { from: 'user', text: msg }]);

    try {
      const response = await fetch('https://ai-voice-chat-agent-backend.vercel.app/api/chat', { // Replace with your backend URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });

      if (!response.ok) throw new Error('AI response error');

      const data = await response.json();
      const aiResponse = data.reply;

      setMessages(prev => [...prev, { from: 'bot', text: aiResponse }]);

      if (mode === 'voice') {
        // Stop recognition while speaking to avoid overlap
        stopRecognition();
        speak(aiResponse);
      }
    } catch (error) {
      setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, something went wrong.' }]);
      console.error(error);
    }
  };

  // Start speech recognition with silence detection
  const startRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      if (!event.results) return;

      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      setInput(transcript);

      // Reset silence timer on every speech result
      resetSilenceTimer(() => {
        // When silence detected, send message
        if (transcript) {
          sendMessage(transcript);
          setInput('');
        }
      });
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      // Restart recognition on recoverable errors
      if (event.error === 'no-speech' || event.error === 'aborted' || event.error === 'network') {
        recognition.stop();
        setTimeout(() => {
          if (mode === 'voice') recognition.start();
        }, 1000);
      }
    };

    recognition.onend = () => {
      // Restart recognition if not speaking and still in voice mode
      if (!isSpeakingRef.current && mode === 'voice') {
        recognition.start();
      }
    };

    recognition.start();
    recognitionRef.current = recognition;

    // Start silence timer initially
    resetSilenceTimer(() => {
      // If silence detected before any speech, do nothing or prompt user
      console.log('No speech detected for 4 seconds');
    });
  };

  // Reset the silence detection timer (4 seconds)
  const resetSilenceTimer = (callback) => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    silenceTimeoutRef.current = setTimeout(() => {
      callback();
    }, 4000); // 4 seconds of silence
  };

  // Stop speech recognition and clear timers
  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  };

  // Speak AI response and restart recognition after speaking
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      isSpeakingRef.current = true;
      const utter = new SpeechSynthesisUtterance(text);

      utter.onend = () => {
        isSpeakingRef.current = false;
        if (mode === 'voice') {
          startRecognition();
        }
      };

      utter.onerror = (e) => {
        console.error('Speech synthesis error:', e.error);
        isSpeakingRef.current = false;
        if (mode === 'voice') {
          startRecognition();
        }
      };

      window.speechSynthesis.speak(utter);
    }
  };

  // Handle mode selection and initialize
  const handleOpen = (selectedMode) => {
    setOpen(true);
    setMode(selectedMode);
    setMessages([{ from: 'bot', text: 'Hello, what can I help you with?' }]);
    setInput('');

    if (selectedMode === 'voice') {
      startRecognition();
    } else {
      stopRecognition();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecognition();
      window.speechSynthesis.cancel();
    };
  }, []);

  // Render chat messages
  const renderMessages = () =>
    messages.map((msg, idx) => (
      <div
        key={idx}
        style={{
          textAlign: msg.from === 'user' ? 'right' : 'left',
          marginBottom: 6,
          padding: 6,
          backgroundColor: msg.from === 'user' ? '#d1e7dd' : '#f8d7da',
          borderRadius: 8,
          maxWidth: '80%',
          alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
          wordBreak: 'break-word',
        }}
      >
        <b>{msg.from === 'user' ? 'You' : 'Pack 3000'}:</b> {msg.text}
      </div>
    ));

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 40,
        right: 40,
        width: 350,
        zIndex: 9999,
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 8,
          border: '1px solid #ddd',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo and controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
          }}
        >
          <img src={PACK_3000_LOGO} alt="Pack 3000 Logo" style={{ height: 40, marginRight: 12 }} />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '6px 22px',
          }}
        >
          <button onClick={() => handleOpen('chat')} style={{ marginRight: 8 }}>
            Chat
          </button>
          <button onClick={() => handleOpen('voice')} style={{ marginRight: 8 }}>
            Voice
          </button>
          <a
            href={`tel:${PHONE_NUMBER.replace('#', '')}`}
            style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}
          >
            Call {PHONE_NUMBER}
          </a>
        </div>

        {/* Chat/Voice Window */}
        {open && (
          <div
            style={{
              background: '#f9f9f9',
              borderRadius: 8,
              padding: 12,
              minHeight: 200,
              maxHeight: 300,
              overflowY: 'auto',
              marginBottom: 8,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {renderMessages()}
          </div>
        )}

        {/* Input for chat */}
        {open && mode === 'chat' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                sendMessage(input.trim());
                setInput('');
              }
            }}
            style={{ display: 'flex', gap: 8 }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, borderRadius: 4, border: '1px solid #ccc', padding: 8 }}
              placeholder="Type your message..."
              autoFocus
            />
            <button type="submit">Send</button>
          </form>
        )}

        {/* Voice input hint */}
        {open && mode === 'voice' && (
          <div style={{ fontStyle: 'italic', color: '#888' }}>Listening... Please speak.</div>
        )}
      </div>
    </div>
  );
};

export default Pack3000Widget;
