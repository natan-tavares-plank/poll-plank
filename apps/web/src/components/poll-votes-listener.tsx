"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client"; // Make sure this returns a browser Supabase client

export function PollVotesListener({
	pollId,
	onVote,
}: {
	pollId: string;
	onVote: (payload: any) => void;
}) {
	useEffect(() => {
		const supabase = createClient();
		const channel = supabase.channel(`poll:${pollId}`);

		channel.on("broadcast", { event: "vote" }, (payload) => {
			onVote(payload.payload); // Call your callback with the new vote data
		});

		channel.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [pollId, onVote]);

	return null; // This component just sets up the listener
}
