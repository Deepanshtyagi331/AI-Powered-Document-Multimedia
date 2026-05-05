import faiss
import numpy as np
import json
import os
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

async def process_document(file_content: bytes, filename: str) -> dict:
    # In a full app, you would use PyPDFLoader or other loaders here
    content = f"Simulated extraction for {filename}. This document talks about artificial intelligence and its applications."
    summary = "A document focusing on artificial intelligence topics."
    
    if filename.lower().endswith(".pdf"):
        content = "PDF Content: The quick brown fox jumps over the lazy dog. It also contains details about software engineering."
        summary = "A document about a quick fox and software engineering."
    elif filename.lower().endswith((".mp3", ".wav", ".m4a")):
        content = "Audio Content: In this audio, the speaker discusses the timeline of project milestones, specifically focusing on the Q3 release schedule."
        summary = "Audio meeting about Q3 release schedule."

    return {
        "content": content,
        "summary": summary
    }

async def extract_timestamps(file_content: bytes, filename: str) -> str:
    # In a real app, use OpenAI Whisper API to get segment-level timestamps
    if filename.lower().endswith((".mp3", ".wav", ".m4a", ".mp4", ".mov", ".avi")):
        timestamps = [
            {"topic": "Introduction", "timestamp": 0},
            {"topic": "Main Content", "timestamp": 15},
            {"topic": "Conclusion", "timestamp": 45}
        ]
        return json.dumps(timestamps)
    return "[]"

async def ask_question(question: str, context: str) -> dict:
    timestamp = None
    if "schedule" in question.lower() or "q3" in question.lower():
        timestamp = 15
        
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {
            "answer": f"[Mock Mode - No OPENAI_API_KEY found]\nBased on the uploaded document, I found this context: '{context[:50]}...'. To get a real AI response, please add OPENAI_API_KEY to your environment variables.",
            "timestamp": timestamp
        }
    
    try:
        llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
        prompt = PromptTemplate(
            input_variables=["context", "question"],
            template="You are an AI assistant helping a user with their document. Based on the following context, answer the user's question.\n\nContext: {context}\n\nQuestion: {question}\n\nAnswer:"
        )
        chain = LLMChain(llm=llm, prompt=prompt)
        response = await chain.arun(context=context, question=question)
        
        return {
            "answer": response,
            "timestamp": timestamp
        }
    except Exception as e:
        return {
            "answer": f"Error communicating with OpenAI: {str(e)}",
            "timestamp": timestamp
        }
