import { z } from "zod";

const envSchema = z.object({
	NEXT_PUBLIC_SUPABASE_URL: z.string(),
	NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
	NEXT_PUBLIC_POSTHOG_KEY: z.string(),
	NEXT_PUBLIC_POSTHOG_HOST: z.string(),
	NEXT_PUBLIC_APP_URL: z.string(),
});

export const env = envSchema.parse(process.env);
