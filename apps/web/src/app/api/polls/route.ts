// apps/server/src/app/polls/route.ts
// import { supabase } from "../../db";

export async function GET(req: Request) {
	// const { data, error } = await supabase
	// 	.from("polls")
	// 	.select("*")
	// 	.order("created_at", { ascending: false });

	// if (error) {
	// 	return new Response(JSON.stringify({ error: error.message }), {
	// 		status: 500,
	// 	});
	// }

	// return new Response(JSON.stringify(data), { status: 200 });
	return new Response(JSON.stringify({ message: "polls" }), {
		status: 200,
	});
}
