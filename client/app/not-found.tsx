import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaLongArrowAltLeft } from "react-icons/fa";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center h-screen p-5">
			<h1 className="text-6xl font-bold mb-2">404</h1>
			<p className="text-xl text-foreground-hover mb-6">Page not found</p>
			<Button
				asChild
				className="flex items-center gap-2 bg-accent text-foreground hover:bg-accent/90 transition-all duration-300"
			>
				<Link href="/">
					<FaLongArrowAltLeft className="h-4 w-4" />
					Back to Home
				</Link>
			</Button>
		</div>
	);
}
