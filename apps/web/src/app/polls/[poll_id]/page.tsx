import PollPageClient from "./PollPageClient";

export default async function PollPage({
	params,
}: {
	params: Promise<{ poll_id: string }>;
}) {
	const { poll_id } = await params;

	return <PollPageClient pollId={poll_id} />;
}
