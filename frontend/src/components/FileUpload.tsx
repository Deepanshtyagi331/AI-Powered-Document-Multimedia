import React, { useState } from 'react';
import axios from 'axios';
import { DocumentData } from '../App';

interface Props {
  onUploadSuccess: (data: DocumentData) => void;
}

const FileUpload: React.FC<Props> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    setError(null);
    
    try {
      const response = await axios.post<DocumentData>('http://localhost:8000/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUploadSuccess(response.data);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ border: '2px dashed rgba(99, 102, 241, 0.3)', borderRadius: '12px', padding: '30px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}>
        <input type="file" onChange={handleFileChange} style={{ cursor: 'pointer' }} id="file-upload-input" />
      </div>
      
      <button className="btn-primary" onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Processing with AI...' : 'Upload & Analyze'}
      </button>
      {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}
    </div>
  );
};

export default FileUpload;
