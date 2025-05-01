import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { FileProvider } from "@/context/file-context";

export const metadata: Metadata = {
	title: "AI RAG",
	description: "AI RAG - AI-powered RAG application",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body
					className={`antialiased bg-background text-foreground font-bricolage flex flex-col min-h-screen`}
				>
					<FileProvider>{children}</FileProvider>
					<Toaster />
				</body>
			</html>
		</ClerkProvider>
	);
}
