"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
import { env } from "@/env";
import client from "@/lib/posthog";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
	const payload = Object.fromEntries(formData.entries());
	const schema = z.object({
		email: z.email(),
		password: z.string().min(6),
	});
	const { email, password } = schema.parse(payload);

	const supabase = await createClient();
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		console.error({ error });
		redirect("/error");
	}

	client.capture({
		distinctId: data.user.id,
		event: "user_logged_in",
		properties: {
			email,
		},
	});

	revalidatePath("/auth/login", "layout");
	redirect("/");
}

export async function signup(formData: FormData) {
	const payload = Object.fromEntries(formData.entries());
	const schema = z.object({
		email: z.email(),
		password: z.string().min(6),
	});

	const { email, password } = schema.parse(payload);

	const supabase = await createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: env.NEXT_PUBLIC_APP_URL,
		},
	});

	if (error) {
		console.error({ error });
		redirect("/error");
	}

	if (data.user?.id) {
		client.capture({
			distinctId: data.user.id,
			event: "user_signed_up",
			properties: {
				email,
			},
		});
	}

	// Redirect to verify email page after successful signup
	redirect("/auth/verify-email");
}
