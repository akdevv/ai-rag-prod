import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import FileUpload from "@/components/file-upload";

export default async function Home() {
	const { userId } = await auth();

	if (!userId) {
		redirect("/auth/sign-in");
	}

	return (
		<main>
			<header className="border-b border-neutral-700">
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

			<section className="flex p-3 gap-3">
				<div className="bg-red-400 w-1/3">
					<FileUpload />
				</div>
				<div className="bg-blue-400 w-2/3">3</div>
			</section>
		</main>
	);
}
