from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database
import models
from fastapi.security import OAuth2PasswordRequestForm
import auth
from datetime import timedelta
import ai_services
from pydantic import BaseModel

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="AI-Powered Document & Multimedia Q&A")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    username: str
    password: str

@app.post("/register/")
def register(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_pw = auth.get_password_hash(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "User created"}

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

class QuestionRequest(BaseModel):
    document_id: int
    question: str

@app.post("/upload/")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    content = await file.read()
    
    # Process document
    processed = await ai_services.process_document(content, file.filename)
    timestamps = await ai_services.extract_timestamps(content, file.filename)
    
    file_type = "pdf"
    if file.filename.lower().endswith((".mp3", ".wav", ".m4a")):
        file_type = "audio"
    elif file.filename.lower().endswith((".mp4", ".mov", ".avi")):
        file_type = "video"

    db_document = models.Document(
        filename=file.filename,
        file_type=file_type,
        content=processed["content"],
        summary=processed["summary"],
        timestamps=timestamps
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

@app.get("/documents/")
def list_documents(db: Session = Depends(database.get_db)):
    return db.query(models.Document).all()

@app.get("/documents/{document_id}")
def get_document(document_id: int, db: Session = Depends(database.get_db)):
    doc = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@app.post("/ask/")
async def ask_question(req: QuestionRequest, db: Session = Depends(database.get_db)):
    doc = db.query(models.Document).filter(models.Document.id == req.document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    answer_data = await ai_services.ask_question(req.question, doc.content)
    return {
        "answer": answer_data["answer"],
        "timestamp": answer_data["timestamp"]
    }
