"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFile } from "@/context/file-context";
import { MdArrowRightAlt } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";

export default function FileUpload() {
	const router = useRouter();
	const { file, setFile } = useFile();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileUpload = async () => {
		if (file) {
			try {
				const formData = new FormData();
				formData.append("pdf", file);

				const response = await fetch(
					"http://localhost:8000/upload/pdf",
					{
						method: "POST",
						body: formData,
					}
				);

				toast.success("File uploaded successfully!");
			} catch (error) {
				console.error("Error uploading file:", error);
				toast.error("Error uploading file!");
			}
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile && selectedFile.type === "application/pdf") {
			setFile(selectedFile);
		} else if (selectedFile) {
			toast.error("Please upload a PDF file only!");
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			const droppedFile = e.dataTransfer.files[0];
			if (droppedFile.type === "application/pdf") {
				setFile(droppedFile);
			} else {
				toast.error("Please upload a PDF file only!");
			}
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} bytes`;
		else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
		else return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	const truncateFileName = (fileName: string) => {
		if (fileName.length <= 20) return fileName;
		const extension = fileName.split(".").pop() || "";
		const baseName = fileName.substring(0, fileName.lastIndexOf("."));
		const truncatedName = baseName.substring(0, 10) + "...";
		return `${truncatedName}.${extension}`;
	};

	return (
		<div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto">
			<div className="p-6 w-full">
				<div
					className="border-2 border-dashed border-neutral-500 rounded-lg text-center cursor-pointer h-60"
					onClick={() => fileInputRef.current?.click()}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
				>
					<div className="flex flex-col items-center justify-center h-full p-2">
						<input
							type="file"
							ref={fileInputRef}
							className="hidden"
							accept="application/pdf"
							onChange={handleFileChange}
						/>
						<div className="">
							{!file ? (
								<>
									<div className="w-16 h-16 bg-neutral-700 rounded-full mx-auto mb-4 flex items-center justify-center">
										<FiUploadCloud className="w-8 h-8 text-neutral-400" />
									</div>
									<p className="text-lg">
										Drag and drop your
									</p>
									<p className="text-lg -mt-1">
										resume or click to browse
									</p>
									<p className="text-xs text-neutral-500 mt-1">
										Supported format: PDF only
									</p>
								</>
							) : (
								<>
									<div className="flex items-center justify-between gap-2">
										<div className="flex items-center gap-2">
											<FaFilePdf />
											<span className="text-sm font-medium">
												{truncateFileName(file.name)}
											</span>
											<span className="text-xs text-neutral-500">
												({formatFileSize(file.size)})
											</span>
										</div>
										<button
											className="flex items-center justify-center rounded-full bg-neutral-700 p-1 text-red-500 hover:bg-neutral-600 cursor-pointer transition-all duration-300"
											onClick={(e) => {
												e.stopPropagation();
												setFile(null);
											}}
										>
											<IoClose />
										</button>
									</div>
								</>
							)}
						</div>
					</div>
				</div>

				{/* Continue button */}
				<div className="mt-6">
					<Button
						disabled={!file}
						className="bg-accent text-foreground hover:bg-accent-hover transition-all duration-300 w-full cursor-pointer py-5 gap-2"
						onClick={handleFileUpload}
					>
						{file ? "Continue" : "Upload a file"}
						<MdArrowRightAlt className="text-xl" />
					</Button>
				</div>
			</div>
		</div>
	);
}
