import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Chatbot from './components/Chatbot';

export interface DocumentData {
  id: number;
  filename: string;
  file_type: string;
  summary: string;
  timestamps: string;
}

function App() {
  const [currentDoc, setCurrentDoc] = useState<DocumentData | null>(null);
  const [videoTimestamp, setVideoTimestamp] = useState<number | null>(null);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AI Multimedia Q&A
        </h1>
        <p style={{ color: '#94a3b8' }}>Upload documents, audio, or video and chat with your content.</p>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div className="glass-card">
          <h2 style={{ marginTop: 0 }}>Upload & Analysis</h2>
          <FileUpload onUploadSuccess={setCurrentDoc} />

          {currentDoc && (
            <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
              <h3 style={{ color: '#6366f1' }}>Document Details</h3>
              <p><strong>Type:</strong> <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', background: '#334155', padding: '2px 8px', borderRadius: '4px' }}>{currentDoc.file_type}</span></p>
              <p style={{ lineHeight: '1.6', color: '#cbd5e1' }}>{currentDoc.summary}</p>
              
              {currentDoc.file_type !== 'pdf' && currentDoc.timestamps && (
                <div style={{ marginTop: '20px' }}>
                  <h4>Smart Timestamps</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {JSON.parse(currentDoc.timestamps).map((ts: any, idx: number) => (
                      <button key={idx} className="btn-primary" style={{ padding: '8px 12px', fontSize: '0.9rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }} onClick={() => setVideoTimestamp(ts.timestamp)}>
                        <span>{ts.topic}</span>
                        <span style={{ opacity: 0.7 }}>{ts.timestamp}s</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="glass-card">
          <h2 style={{ marginTop: 0 }}>AI Assistant</h2>
          {currentDoc ? (
            <Chatbot documentId={currentDoc.id} onJumpToTime={(time) => setVideoTimestamp(time)} />
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', textAlign: 'center' }}>
              <p>Waiting for an upload...<br/>Upload a file to start the conversation.</p>
            </div>
          )}
        </div>
      </div>
      
      {currentDoc && currentDoc.file_type !== 'pdf' && (
        <div className="glass-card" style={{ marginTop: '32px' }}>
          <h2>Media Playback</h2>
          <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: '100%', height: '400px', backgroundColor: '#020617', border: '1px solid #334155', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ color: '#6366f1', marginBottom: '20px' }}>
                 <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
               </div>
               <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>Playing {currentDoc.filename}</p>
               <p style={{ color: '#94a3b8' }}>Jumped to: <span style={{ color: '#6366f1', fontWeight: 'bold' }}>{videoTimestamp !== null ? videoTimestamp : 0}s</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
