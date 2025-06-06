import React, { useState, useRef, useEffect } from 'react';
import MyButton from './elements/MyButton';
import MyPhoneNumberCard from './elements/MyPhoneNmberCard';
import MySendBUtton from './elements/MySendButton';

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

  // NEW: Ref for chat container
  const chatContainerRef = useRef(null);

  // NEW: Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message to backend and get AI response
  const sendMessage = async (msg) => {
    setMessages(prev => [...prev, { from: 'user', text: msg }]);

    try {
      const response = await fetch('https://ai-voice-chat-agent-backend.vercel.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });

      if (!response.ok) throw new Error('AI response error');

      const data = await response.json();
      const aiResponse = data.reply;

      setMessages(prev => [...prev, { from: 'bot', text: aiResponse }]);

      if (mode === 'voice') {
        stopRecognition();
        speak(aiResponse);
      }
    } catch (error) {
      setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, something went wrong.' }]);
      console.error(error);
    }
  };

  // ... (rest of your voice recognition and speech synthesis code remains unchanged)

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

      resetSilenceTimer(() => {
        if (transcript) {
          sendMessage(transcript);
          setInput('');
        }
      });
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech' || event.error === 'aborted' || event.error === 'network') {
        recognition.stop();
        setTimeout(() => {
          if (mode === 'voice') recognition.start();
        }, 1000);
      }
    };

    recognition.onend = () => {
      if (!isSpeakingRef.current && mode === 'voice') {
        recognition.start();
      }
    };

    recognition.start();
    recognitionRef.current = recognition;

    resetSilenceTimer(() => {
      console.log('No speech detected for 4 seconds');
    });
  };

  const resetSilenceTimer = (callback) => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    silenceTimeoutRef.current = setTimeout(() => {
      callback();
    }, 4000); // 4 seconds of silence
  };

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

  useEffect(() => {
    return () => {
      stopRecognition();
      window.speechSynthesis.cancel();
    };
  }, []);

  const renderMessages = () =>
    messages.map((msg, idx) => (
      <div
        key={idx}
        style={{
          textAlign: msg.from === 'user' ? 'right' : 'left',
          marginBottom: 6,
          padding: 10,
          backgroundColor: msg.from === 'user' ? '#d1e7dd' : '#c6ff70',
          borderRadius: 8,
          maxWidth: '80%',
          alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
          wordBreak: 'break-word',
        }}
      >
        <b>{msg.from === 'user' ? 'You' : 'TREVORT'}:</b> {msg.text}
      </div>
    ));

  return (
    <div
      style={{
        
        position: 'fixed',
        bottom: 40,
        right: 40,
        width: 450,
        zIndex: 9999,
        fontFamily: 'Arial, sans-serif',
        boxShadow: '10 16px 22px rgba(14, 13, 13, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        
      }}
    >
      <div
        style={{
          background: '#d8dfeb',
          borderRadius: 16,
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
          {/* <button onClick={() => handleOpen('chat')} style={{ marginRight: 8 }}>
            Chat
          </button> */}
          {/* <button onClick={() => handleOpen('voice')} style={{ marginRight: 8 }}>
            Voice
            </button> */}
          
          <MyButton text={'Chat'}  onClick={() => handleOpen('chat')}  />
          <MyButton text={'Voice'}  onClick={() => handleOpen('voice')}  />
          <a
            href={`tel:${PHONE_NUMBER.replace('#', '')}`}
            style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}
          >
            {/* Call {PHONE_NUMBER} */}
            <MyPhoneNumberCard text={PHONE_NUMBER} />
          </a>
        </div>

        {/* Chat/Voice Window */}
        {open && (
          <div
            ref={chatContainerRef} // <-- ADD THE REF HERE
            style={{
              background: '#fff',
              borderRadius: 10,
              padding: 14,
              minHeight: 200,
              maxHeight: 600,
              overflowY: 'auto',
              marginBottom: 8,
              margin : '8px 0px',
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
            style={{ display: 'flex', gap: 8 , height: 40}}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, borderRadius: 4, border: '1px solid #ccc', padding: 8 }}
              placeholder="Type your message..."
              autoFocus
            />
            <MySendBUtton text={'Send'} />
            {/* <button type="submit">Send</button> */}
          </form>
        )}

        {/* Voice input hint */}
        {open && mode === 'voice' && (
          <div style={{ color: '#888', height: 40 }}>Listening.... Please speak.</div>
        )}
      </div>
    </div>
  );
};

export default Pack3000Widget;
