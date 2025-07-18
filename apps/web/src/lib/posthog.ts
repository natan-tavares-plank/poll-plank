import { PostHog } from "posthog-node";
import { env } from "@/env";

/**
 * @description PostHog client for server-side actions
 * @see https://posthog.com/docs/libraries/node
 */
const client = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
	host: env.NEXT_PUBLIC_POSTHOG_HOST,
	flushAt: 1,
	flushInterval: 0,
});

export default client;
