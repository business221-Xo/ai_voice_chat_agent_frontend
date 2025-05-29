// Pack3000Widget.jsx
import React, { useState, useRef } from 'react';

// Replace with your real logo
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

  // Dummy AI response (replace with real API call)
  const getAIResponse = async (msg) => {
    // Replace with your backend/AI API call
    return `${msg}`;
  };

  // Handle sending messages
  const sendMessage = async (msg) => {
    setMessages((prev) => [...prev, { from: 'user', text: msg }]);
    const aiResponse = await getAIResponse(msg);
    setMessages((prev) => [...prev, { from: 'bot', text: aiResponse }]);
    if (mode === 'voice') {
      speak(aiResponse);
    }
  };

  // Voice recognition
  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  // Voice synthesis
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utter);
    }
  };

  // Handle chat/voice button
  const handleOpen = (selectedMode) => {
    setOpen(true);
    setMode(selectedMode);
    if (selectedMode === 'voice') {
      startVoiceRecognition();
    }
  };

  // Render chat messages
  const renderMessages = () =>
    messages.map((msg, idx) => (
      <div key={idx} style={{ textAlign: msg.from === 'user' ? 'right' : 'left' }}>
        <b>{msg.from === 'user' ? 'You' : 'Pack 3000'}:</b> {msg.text}
      </div>
    ));

  return (
    <div style={{
      position: 'fixed',
      bottom: 40,
      right: 40,
      width: 350,
      zIndex: 9999,
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #ddd',
        padding: 16
      }}>
        {/* Logo and controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <img src={PACK_3000_LOGO} alt="Pack 3000 Logo" style={{ height: 40, marginRight: 12 }} />
          
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '6px 22px' }}>
          <button onClick={() => handleOpen('chat')} style={{ marginRight: 8 }}>Chat</button>
          <button onClick={() => handleOpen('voice')} style={{ marginRight: 8 }}>Voice</button>
          <a href={`tel:${PHONE_NUMBER.replace('#','')}`} style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
            Call {PHONE_NUMBER}
          </a>
        </div>
        {/* Chat/Voice Window */}
        {open && (
          <div style={{
            background: '#f9f9f9',
            borderRadius: 8,
            padding: 12,
            minHeight: 200,
            maxHeight: 300,
            overflowY: 'auto',
            marginBottom: 8
          }}>
            {renderMessages()}
          </div>
        )}
        {/* Input for chat */}
        {open && mode === 'chat' && (
          <form
            onSubmit={e => {
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
              onChange={e => setInput(e.target.value)}
              style={{ flex: 1, borderRadius: 4, border: '1px solid #ccc', padding: 8 }}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        )}
        {/* Voice input hint */}
        {open && mode === 'voice' && (
          <div style={{ fontStyle: 'italic', color: '#888' }}>
            Listening... Please speak.
          </div>
        )}
      </div>
    </div>
  );
};

export default Pack3000Widget;
