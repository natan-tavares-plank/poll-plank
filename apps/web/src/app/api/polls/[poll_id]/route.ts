import { NextResponse } from "next/server";
import { Poll } from "@/lib/supabase/polls";

export async function GET(
	_: Request,
	{ params }: { params: Promise<{ poll_id: string }> },
) {
	const { poll_id } = await params;
	const pollClient = new Poll(poll_id);
	await pollClient.init();

	const poll = await pollClient.getPoll();
	return NextResponse.json(poll);
}
