"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

// Types
interface PollOption {
	id: string;
	option_text: string;
}

interface Poll {
	id: string;
	title: string;
	description: string;
	options: PollOption[];
}

export default function PollPageClient({ pollId }: { pollId: string }) {
	const [poll, setPoll] = useState<Poll | null>(null);
	const [votes, setVotes] = useState<Record<string, number>>({});

	const [loading, setLoading] = useState<Record<string, boolean>>({
		poll: false,
		votes: false,
		submit: false,
	});
	const [error, setError] = useState<string | null>(null);

	const supabase = createClient();
	const subscribedRef = useRef(false);

	// Fetch poll data
	const fetchPoll = useCallback(async () => {
		setLoading((prev) => ({ ...prev, poll: true }));
		setError(null);
		try {
			const res = await fetch(`/api/polls/${pollId}`);
			if (!res.ok) throw new Error("Failed to fetch poll");
			const data = await res.json();

			setPoll(data);
		} catch (err: any) {
			setError(err.message || "Unknown error");
		} finally {
			setLoading((prev) => ({ ...prev, poll: false }));
		}
	}, [pollId]);

	// Fetch votes
	const fetchVotes = useCallback(async () => {
		// setLoading((prev) => ({ ...prev, votes: true }));
		try {
			const res = await fetch(`/api/polls/${pollId}/votes`);
			if (!res.ok) throw new Error("Failed to fetch votes");
			const data = await res.json();

			// Expecting data to be an array of votes: { option_id: string }[]
			setVotes(() => {
				const counts: Record<string, number> = {};
				poll?.options.forEach(({ id }) => {
					counts[id] = 0;
				});
				data.forEach((vote: { option_id: string }) => {
					counts[vote.option_id] = (counts[vote.option_id] || 0) + 1;
				});
				return counts;
			});
		} catch (err: any) {
			setError(err.message || "Unknown error");
		} finally {
			setLoading((prev) => ({ ...prev, votes: false }));
		}
	}, [pollId, poll]);

	// Handle voting
	const handleVote = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// setLoading((prev) => ({ ...prev, submit: true }));
		setError(null);

		const formData = new FormData(event.target as HTMLFormElement);
		const optionId = formData.get("option");
		if (!optionId) {
			setError("Please select an option.");
			return;
		}

		try {
			const res = await fetch(`/api/polls/${pollId}/votes`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ option: optionId }),
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData.message || "Failed to submit vote");
			}
			await fetchVotes();
		} catch (err: any) {
			setError(err.message || "Unknown error");
		} finally {
			// setLoading((prev) => ({ ...prev, submit: false }));
		}
	};

	// Initial fetch
	useEffect(() => {
		fetchPoll();
	}, [fetchPoll]);

	// Fetch votes when poll loads
	useEffect(() => {
		if (poll) fetchVotes();
	}, [poll, fetchVotes]);

	// Real-time updates
	useEffect(() => {
		if (!poll) return;
		if (subscribedRef.current) return; // Prevent duplicate subscription in dev
		subscribedRef.current = true;

		const channel = supabase.channel(`poll:${pollId}`);
		channel.on("broadcast", { event: "vote" }, ({ payload }) => {
			setVotes((prev) => {
				const newVotes = {
					...prev,
					[payload.option_id]: (prev[payload.option_id] || 0) + 1,
				};
				return newVotes;
			});
		});
		channel.subscribe();

		return () => {
			supabase.removeChannel(channel);
			subscribedRef.current = false;
		};
	}, [pollId, poll, supabase]);

	if (Object.values(loading).some((v) => v)) return <div>Loading...</div>;
	if (error) return <div className="text-red-500">Error: {error}</div>;
	if (!poll) return <div>No poll found.</div>;

	return (
		<div className="container mx-auto max-w-5xl px-4 py-2">
			<h1 className="mb-2 font-bold text-2xl">{poll.title}</h1>
			<p className="mb-6 text-gray-500 text-sm">{poll.description}</p>
			<form className="flex flex-col gap-4" onSubmit={handleVote}>
				{poll.options.map((option) => (
					<label
						key={option.id}
						className="flex cursor-pointer items-center gap-2 rounded-lg border p-2"
					>
						<input type="radio" name="option" value={option.id} />
						<span>{option.option_text}</span>
						<span className="ml-auto text-green-500 text-sm">
							{votes[option.id]}
						</span>
					</label>
				))}
				<div className="mt-4 flex justify-end">
					<Button type="submit" disabled={loading.submit}>
						{loading.submit ? "Voting..." : "Vote"}
					</Button>
				</div>
			</form>
		</div>
	);
}
