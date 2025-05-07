import { Worker } from "bullmq";
import { OllamaEmbeddings } from "@langchain/ollama";
import { QdrantClient } from "@qdrant/js-client-rest";
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

type JobData = {
	filename: string;
	destination: string;
	path: string;
};

const qdrantClient = new QdrantClient({ url: "http://localhost:6333" });

const worker = new Worker(
	"file-upload-queue",
	async (job) => {
		const data: JobData = JSON.parse(job.data);
		/*
        Path: data.path
        - read the pdf
        - chunk the pdf
        - call openai embeddings model for every chunk
        - save the chunks to the database (qdrant db)
        */

		// Load PDF
		const loader = new PDFLoader(data.path);
		const docs = await loader.load();

		// Chunk the PDF
		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 200,
		});

		const texts = await splitter.splitDocuments(docs);

		try {
			// Initialize embeddings model
			const embeddings = new OllamaEmbeddings({
				model: "nomic-embed-text",
			});

			// Initialize vector store and add documents
			const vectorStore = await QdrantVectorStore.fromExistingCollection(
				embeddings,
				{
					url: "http://localhost:6333",
					collectionName: "pdf-embeddings",
				}
			);

			await vectorStore.addDocuments(texts);
		} catch (error) {
			console.error("Error processing document:", error);
			throw error;
		}
	},
	{
		concurrency: 100,
		connection: {
			host: "localhost",
			port: 6379,
		},
	}
);

console.log("Worker started");
