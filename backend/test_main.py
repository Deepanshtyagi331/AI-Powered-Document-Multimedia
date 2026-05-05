from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)

def test_list_documents_empty():
    response = client.get("/documents/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_upload_document():
    files = {"file": ("test.pdf", b"dummy content", "application/pdf")}
    response = client.post("/upload/", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == "test.pdf"
    assert data["file_type"] == "pdf"
    assert "summary" in data

def test_upload_audio():
    files = {"file": ("test.mp3", b"dummy audio content", "audio/mpeg")}
    response = client.post("/upload/", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == "test.mp3"
    assert data["file_type"] == "audio"
    assert "timestamps" in data

def test_get_document():
    files = {"file": ("test2.pdf", b"dummy content", "application/pdf")}
    upload_res = client.post("/upload/", files=files)
    doc_id = upload_res.json()["id"]

    response = client.get(f"/documents/{doc_id}")
    assert response.status_code == 200
    assert response.json()["id"] == doc_id

def test_get_document_not_found():
    response = client.get("/documents/9999")
    assert response.status_code == 404

def test_ask_question():
    files = {"file": ("test_ask.pdf", b"dummy content", "application/pdf")}
    upload_res = client.post("/upload/", files=files)
    doc_id = upload_res.json()["id"]

    response = client.post("/ask/", json={"document_id": doc_id, "question": "What is the main point?"})
    assert response.status_code == 200
    assert "answer" in response.json()
    assert "timestamp" in response.json()

def test_ask_question_not_found():
    response = client.post("/ask/", json={"document_id": 9999, "question": "Hello?"})
    assert response.status_code == 404
