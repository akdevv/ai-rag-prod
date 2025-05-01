import cors from "cors";
import express from "express";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const app = express();
app.use(cors());

app.get("/", (req, res) => {
	res.json({
		message: "Hello World!",
		status: "success",
	});
});

app.post("/upload/pdf", upload.single("pdf"), (req, res) => {
	res.json({
		message: "PDF uploaded successfully!",
		status: "success",
	});
});

app.listen(8000, () => {
	console.log("Server running on PORT: 8000");
});
