import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  documentId: number;
  onJumpToTime: (time: number) => void;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp?: number | null;
}

const Chatbot: React.FC<Props> = ({ documentId, onJumpToTime }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/ask/', {
        document_id: documentId,
        question: input
      });

      const botMsg: Message = { 
        role: 'bot', 
        content: response.data.answer,
        timestamp: response.data.timestamp
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Error getting answer.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '12px 16px', 
              borderRadius: '12px', 
              backgroundColor: m.role === 'user' ? 'var(--primary)' : 'rgba(30, 41, 59, 0.5)',
              color: '#fff',
              border: m.role === 'bot' ? '1px solid rgba(255,255,255,0.05)' : 'none',
              maxWidth: '80%',
              boxShadow: m.role === 'user' ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
            }}>
              {m.content}
            </div>
            {m.timestamp !== null && m.timestamp !== undefined && (
              <div style={{ marginTop: '8px' }}>
                <button 
                  className="btn-primary"
                  style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} 
                  onClick={() => onJumpToTime(m.timestamp as number)}>
                  Play from {m.timestamp}s
                </button>
              </div>
            )}
          </div>
        ))}
        {loading && <div style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>AI is thinking...</div>}
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          className="input-field"
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your content..."
        />
        <button className="btn-primary" onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
