import { NextResponse } from "next/server";
import { Poll } from "@/lib/supabase/polls";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ poll_id: string }> },
) {
	const { poll_id } = await params;
	const pollClient = new Poll(poll_id);
	await pollClient.init();

	const { option } = await request.json();

	await pollClient.vote(option);
	return NextResponse.json({ message: "Vote received" });
}

export async function GET(
	_: Request,
	{ params }: { params: Promise<{ poll_id: string }> },
) {
	const { poll_id } = await params;
	const pollClient = new Poll(poll_id);
	await pollClient.init();

	const votes = await pollClient.getVotes();
	return NextResponse.json(votes);
}
