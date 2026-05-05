 # AI-Powered Document & Multimedia Q&A Web Application

This project is a full-stack web application that allows users to upload PDF documents, audio, and video files, and interact with an AI-powered chatbot to ask questions about the uploaded content.

## Features

- **File Upload:** Upload PDF, Audio (MP3/WAV), and Video (MP4/MOV) files.
- **Q&A Chatbot:** Ask questions about the uploaded file content.
- **Summarization:** Automatically generate a summary for uploaded files.
- **Timestamps:** Extract topics and timestamps from audio/video files.
- **Media Player Integration:** Click on a timestamp to jump to the relevant portion of an audio/video file.

## Tech Stack

- **Backend:** Python (FastAPI), SQLAlchemy, SQLite (for ease of setup)
- **Frontend:** React, TypeScript, Vite, Axios
- **AI Processing:** OpenAI, LangChain, Whisper (Mocked in the current demo implementation)
- **Containerization:** Docker, Docker Compose
- **CI/CD:** GitHub Actions

## Setup & Running Instructions

### 1. Using Docker Compose (Recommended)

1. Ensure Docker and Docker Compose are installed on your system.
2. Run the following command in the root directory:

```bash
docker-compose up --build
```

3. The Frontend will be accessible at `http://localhost:3000`
4. The Backend API will be accessible at `http://localhost:8000` (Swagger UI at `http://localhost:8000/docs`)

### 2. Manual Setup

**Backend:**
1. Navigate to the `backend` directory.
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

**Frontend:**
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Testing

The backend includes test coverage with `pytest`.

To run tests:
```bash
cd backend
pytest --cov=.
```

## API Documentation

FastAPI automatically generates API documentation.
Once the backend is running, navigate to:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Live Demo & Walkthrough
*Add the link to your walkthrough video and live demo URL here before submission.*
