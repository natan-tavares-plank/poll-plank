"use client";

import { SearchIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
	const links = [
		{ to: "/", label: "Home" },
		{ to: "/", label: "My Polls" },
		{ to: "/", label: "My Surveys" },
		{ to: "/", label: "Templates" },
	];

	return (
		<div>
			<div className="flex flex-row items-center gap-8 px-2 py-2">
				<Link href="/">
					<p className="font-bold text-xl">Pools & Surveys</p>
				</Link>

				<nav className="flex gap-8 text-sm">
					{links.map(({ to, label }) => {
						return (
							<Link
								key={to}
								href={to}
								className="transition-colors duration-300 hover:text-zinc-500"
							>
								{label}
							</Link>
						);
					})}
				</nav>

				<div className="ml-auto flex items-center gap-6">
					<div className="search-container flex items-center rounded-md bg-gray-100 pl-2 focus-within:outline focus-within:outline-indigo-400 dark:bg-zinc-800">
						<SearchIcon className="h-4 w-4 text-gray-500" />
						<input
							type="text"
							placeholder="Search"
							className="w-32 p-1.5 pl-1 text-sm focus:outline-none"
						/>
					</div>

					<ModeToggle />

					<div className="rounded-full bg-indigo-400 p-2">
						<UserIcon className="h-4 w-4 text-white" />
					</div>
				</div>
			</div>
			<hr />
		</div>
	);
}
