import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { requireAuth } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export class Poll {
	private supabase!: SupabaseClient;
	private pollChannel!: RealtimeChannel;
	private userID!: string;

	constructor(private readonly pollId: string) {
		this.init();
	}

	async init() {
		this.supabase = await createClient();
		const user = await requireAuth();

		this.userID = user.id;

		this.pollChannel = this.supabase.channel(`poll:${this.pollId}`);
		this.subscribe();
	}

	protected async subscribe() {
		this.pollChannel?.on("broadcast", { event: "vote" }, (payload) => {
			console.log({ payload });
		});
	}

	async getPollsList() {
		const { data, error } = await this.supabase
			.from("polls")
			.select("id, title, description")
			.eq("published", true);

		if (error) {
			throw error;
		}

		return data;
	}

	async getPoll() {
		const { data, error } = await this.supabase
			.from("polls")
			.select("id, title, description, options(id, option_text)")
			.eq("id", this.pollId);

		if (error) {
			throw error;
		}

		return data[0];
	}

	async vote(option_id: string) {
		if (!option_id) {
			throw new Error("Option ID is required");
		}

		const { data, error } = await this.supabase.from("votes").insert({
			option_id,
			poll_id: this.pollId,
			user_id: this.userID,
		});

		console.log({ data, error });

		if (error) {
			throw error;
		}

		this.pollChannel.send({
			type: "broadcast",
			event: "vote",
			payload: {
				option_id,
			},
		});
	}

	async getVotes() {
		const { data, error } = await this.supabase
			.from("votes")
			.select("*")
			.eq("poll_id", this.pollId);

		if (error) {
			throw error;
		}

		console.log({ data, error });

		return data;
	}
}
