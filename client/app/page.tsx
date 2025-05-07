import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import FileUpload from "@/components/file-upload";
import Chat from "@/components/chat";

export default async function Home() {
	const { userId } = await auth();

	if (!userId) {
		redirect("/auth/sign-in");
	}

	return (
		<main>
			<header className="border-b border-neutral-700 h-16">
				<nav className="flex justify-between items-center p-3">
					<h1 className="text-2xl text-accent font-bold flex items-center gap-2">
						<Image
							src="/ai-rag-logo.svg"
							alt="logo"
							width={28}
							height={28}
						/>
						<span>AI RAG</span>
					</h1>
					<div className="border border-accent rounded-full p-0.5 flex items-center justify-center">
						<UserButton />
					</div>
				</nav>
			</header>

			<section className="flex p-3 gap-3 h-[calc(100vh-4rem)]">
				<div className="w-1/4">
					<FileUpload />
				</div>

				<div className="w-3/4 bg-neutral-900 rounded-lg">
					<Chat />
				</div>
			</section>
		</main>
	);
}
