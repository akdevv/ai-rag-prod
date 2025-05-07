# AI-RAG: PDF Document Chat Application

A powerful RAG (Retrieval-Augmented Generation) application that allows users to upload PDF documents and engage in contextual conversations with AI about the document content.

## Features

- PDF document upload and processing
- AI-powered chat interface for document interaction
- Local LLM integration using Ollama
- Vector database for efficient document retrieval
- Queue-based document processing
- Modern and responsive UI

## Tech Stack

### Frontend
- Next.js - React framework for building the user interface
- Shadcn - UI component library for a modern design system

### Backend
- Express.js - Node.js web application framework
- Bun - JavaScript runtime and package manager
- LangChain - Framework for building LLM-powered applications
- Ollama - Local LLM integration (Mistral model)
- QdrantDB - Vector database for storing embeddings
- BullMQ - Queue system for handling document processing
- Multer - File upload handling
- Docker - Containerization
- Valkey - Key-value store

## Prerequisites

- Docker and Docker Compose
- Bun runtime
- Ollama

## Local Setup

1. **Start Docker Services**
   ```bash
   docker compose up -d
   # To stop services
   docker compose down
   ```

2. **Setup Ollama**
   - Install Ollama from [ollama.ai](https://ollama.ai)
   - Pull required models:
     ```bash
     ollama pull mistral
     ollama pull nomic-embed-text
     ```
   - Start Ollama service

3. **Backend Setup**
   ```bash
   cd server
   bun install
   # Start the worker
   bun run dev:worker
   # In a new terminal, start the server
   bun run dev
   ```

4. **Frontend Setup**
   ```bash
   cd client
   bun install
   bun run dev
   ```

5. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Upload a PDF document
   - Start chatting with the AI about the document content

## Technology Details

- **Ollama**: Local LLM framework for running open-source models
- **Docker**: Containerization platform for consistent development environments
- **BullMQ**: Redis-based queue system for handling background jobs
- **Valkey**: High-performance key-value store
- **LangChain**: Framework for building LLM applications with RAG capabilities
- **Multer**: Middleware for handling multipart/form-data (file uploads)
- **QdrantDB**: Vector similarity search engine for storing and retrieving embeddings

## Credits

This project was inspired by and built following the tutorial from [Build AI Chat with PDF App with Next.js and Vector DB](https://www.youtube.com/watch?v=2DXiOtEwWtU).

