"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { BiSolidSend } from "react-icons/bi";
import { toast } from "sonner";
import { FaUser } from "react-icons/fa";
import { FaRobot } from "react-icons/fa";

type Message = {
	role: "user" | "assistant";
	content: string;
	thinking?: boolean;
};

export default function Chat() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState("");
	const [isAiResponding, setIsAiResponding] = useState(false);

	const handleSendMessage = async () => {
		const userMessage = inputMessage;
		setInputMessage("");

		// Add user message to messages array
		setMessages((prev) => [
			...prev,
			{ role: "user", content: userMessage },
		]);

		// Add a temporary "thinking" message from the assistant
		setMessages((prev) => [
			...prev,
			{ role: "assistant", content: "", thinking: true },
		]);

		setIsAiResponding(true);

		try {
			// Fetch AI response
			const response = await fetch(
				`http://localhost:8000/chat?message=${userMessage}`
			);

			const data = await response.json();

			// Replace the thinking message with the actual response
			if (data.status === "success") {
				setMessages((prev) =>
					prev.slice(0, -1).concat({
						role: "assistant",
						content: data?.aiResponse,
					})
				);
			}
		} catch (error) {
			// Remove the thinking message if there's an error
			setMessages((prev) => prev.slice(0, -1));
			toast.error("An error occurred while sending the message.");
		} finally {
			setIsAiResponding(false);
		}
	};

	return (
		<div className="flex flex-col h-full p-5">
			<div className="flex-1 overflow-y-auto mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
				{messages.map((msg, idx) => (
					<div
						key={idx}
						className={`flex ${
							msg.role === "user"
								? "justify-end"
								: "justify-start"
						}`}
					>
						<div
							className={`flex items-end gap-2 max-w-[80%] ${
								msg.role === "user"
									? "flex-row-reverse"
									: "flex-row"
							}`}
						>
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center ${
									msg.role === "user"
										? "bg-neutral-800"
										: "bg-accent"
								}`}
							>
								{msg.role === "user" ? (
									<FaUser className="text-white" />
								) : (
									<FaRobot className="text-white" />
								)}
							</div>
							<div className="p-3 max-w-[80%] rounded-xl bg-neutral-800 border border-neutral-700">
								{msg.thinking ? (
									<div className="flex items-center gap-1 py-2">
										<div className="w-1 h-1 bg-accent rounded-full animate-pulse"></div>
										<div className="w-1 h-1 bg-accent rounded-full animate-pulse delay-150"></div>
										<div className="w-1 h-1 bg-accent rounded-full animate-pulse delay-300"></div>
									</div>
								) : (
									<p className="text-neutral-100 text-base">
										{msg.content}
									</p>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Message Input */}
			<div className="sticky bottom-0 bg-neutral-900 px-3">
				<div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-full p-2">
					<input
						type="text"
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						placeholder="Type your message here..."
						className="flex-1 outline-none bg-transparent pl-2 text-neutral-100"
					/>
					<Button
						className="bg-accent text-foreground hover:bg-accent/90 rounded-full p-2 transition-all duration-300"
						disabled={isAiResponding || !inputMessage}
						onClick={handleSendMessage}
					>
						<BiSolidSend />
					</Button>
				</div>
			</div>
		</div>
	);
}
