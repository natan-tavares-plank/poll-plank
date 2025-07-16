"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
	const user = {
		name: "John Doe",
	};

	const polls = [
		{
			title: "Favorite IDE",
			description: "What's your favorite IDE?",
			url: "/polls/1",
			type: "community-poll",
			cover: "/images/polls/favorite-ide.png",
		},
		{
			title: "Best Programming Language",
			description: "Which programming language is the best?",
			url: "/polls/2",
			type: "quick-poll",
			cover: "/images/polls/best-programming-language.png",
		},
	];

	const surveys = [
		{
			title: "Product Feedback Survey",
			description: "Insights from users on your latest product release.",
			url: "/surveys/1",
			cover: "/images/surveys/product-feedback.png",
		},
		{
			title: "Customer Satisfaction Survey",
			description: "Results from your recent customer feedback survey.",
			url: "/surveys/2",
			cover: "/images/surveys/customer-satisfaction.png",
		},
	];

	return (
		<div className="container mx-auto max-w-5xl px-4 py-2">
			<section className="py-4">
				<div className="mb-8">
					<h2 className="mb-2 font-bold text-2xl">Dashboard</h2>
					<p className="text-sm text-zinc-700">
						Welcome back, {user.name}! Here's an overview of your polls and
						surveys.
					</p>
				</div>

				<section className="grid gap-4">
					<h3 className="font-bold text-xl">Active Polls</h3>
					{polls.map((poll) => (
						<div key={poll.url} className="flex justify-between gap-2">
							<div>
								<h3 className="font-semibold">{poll.title}</h3>
								<p className="text-sm text-zinc-600">{poll.description}</p>
								<div className="mt-4">
									<Link key={poll.url} href={poll.url}>
										<div className="w-20 rounded-sm bg-gray-100 px-2 py-1 text-center font-semibold text-sm dark:bg-gray-800">
											View Poll
										</div>
									</Link>
								</div>
							</div>
							<Image
								src={poll.cover}
								alt={poll.title}
								width={250}
								height={120}
								className="rounded-lg bg-indigo-500"
							/>
						</div>
					))}
				</section>

				<section className="mt-4 grid gap-4">
					<h3 className="font-bold text-xl">Recent Surveys Results</h3>
					{surveys.map((survey) => (
						<div key={survey.url} className="flex justify-between gap-2">
							<div>
								<h3 className="font-semibold">{survey.title}</h3>
								<p className="text-sm text-zinc-600">{survey.description}</p>
								<div className="mt-4">
									<Link key={survey.url} href={survey.url}>
										<div className="w-28 rounded-sm bg-gray-100 px-2 py-1 text-center font-semibold text-sm dark:bg-gray-800">
											View Results
										</div>
									</Link>
								</div>
							</div>
							<Image
								src={survey.cover}
								alt={survey.title}
								width={250}
								height={120}
								className="rounded-lg bg-fuchsia-500"
							/>
						</div>
					))}
				</section>

				<div className="mt-4 flex gap-2">
					<Button variant="default" size="sm">
						Create New Poll
					</Button>
					<Button variant="secondary" size="sm">
						Create New Survey
					</Button>
				</div>
			</section>
		</div>
	);
}
