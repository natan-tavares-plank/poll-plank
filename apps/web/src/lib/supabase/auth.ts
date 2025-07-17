import type { Session, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Get the current user and their authentication status
 */
export async function getCurrentUser(): Promise<User | null> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return null;
	}

	return user;
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth(): Promise<User> {
	const user = await getCurrentUser();

	if (!user) {
		redirect("/auth/login");
	}

	if (!user.confirmed_at) {
		redirect("/auth/verify-email");
	}

	return user;
}

/**
 * Require registered user - redirects to login if not registered
 */
export async function requireRegisteredUser(): Promise<User> {
	const user = await getCurrentUser();
	console.log({ user });

	if (!user) {
		redirect("/auth/login");
	}

	return user;
}
