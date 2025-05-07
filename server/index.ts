import cors from "cors";
import multer from "multer";
import express from "express";
import { Queue } from "bullmq";

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

app.listen(8000, () => {
	console.log("Server running on PORT: 8000");
});
