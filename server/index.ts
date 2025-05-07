import cors from "cors";
import multer from "multer";
import express from "express";
import { Queue } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";

// Queue for file upload
const queue = new Queue("file-upload-queue", {
	connection: {
		host: "localhost",
		port: 6379,
	},
});

// Multer storage configuration
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, `${uniqueSuffix}-${file.originalname}`);
	},
});
const upload = multer({ storage });

const app = express();
app.use(cors());

app.get("/", (req, res) => {
	res.json({
		message: "Hello World!",
		status: "success",
	});
});

app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
	await queue.add(
		"file-ready",
		JSON.stringify({
			filename: req.file?.originalname,
			destination: req.file?.destination,
			path: req.file?.path,
		})
	);
	res.json({
		message: "PDF uploaded successfully!",
		status: "success",
	});
});

app.get("/chat", async (req: any, res: any) => {
	const userQuery = req.query.message;

	const embeddings = new OllamaEmbeddings({
		model: "nomic-embed-text",
	});

	const vectorStore = await QdrantVectorStore.fromExistingCollection(
		embeddings,
		{
			url: "http://localhost:6333",
			collectionName: "pdf-embeddings",
		}
	);

	const retriever = vectorStore.asRetriever({ k: 2 });
	const result = await retriever.invoke(userQuery);

	const SYSTEM_PROMPT = `
	You are a helpful assistant who answers the user's question based on the available context from PDF document.
	
	Context:
	${JSON.stringify(result)}

	User Query:
	${userQuery}`;

	// Generate response
	const model = new ChatOllama({
		baseUrl: "http://localhost:11434",
		model: "mistral",
	});
	const response = await model.invoke(SYSTEM_PROMPT);

	return res.json({
		status: "success",
		aiResponse: response.content,
	});
});

app.listen(8000, () => {
	console.log("Server running on PORT: 8000");
});
