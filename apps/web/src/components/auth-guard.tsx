"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";
import { createClient } from "@/lib/supabase/client";

interface AuthGuardProps {
	children: React.ReactNode;
	requireVerification?: boolean;
	fallback?: React.ReactNode;
}

export function AuthGuard({
	children,
	requireVerification = true,
	fallback = <Loader />,
}: AuthGuardProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<any>(null);
	const router = useRouter();

	useEffect(() => {
		const supabase = createClient();

		const checkAuth = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				router.push("/auth/login");
				return;
			}

			if (requireVerification && !user.email_confirmed_at) {
				router.push("/auth/verify-email");
				return;
			}

			setUser(user);
			setIsLoading(false);
		};

		checkAuth();

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === "SIGNED_OUT") {
				router.push("/auth/login");
			} else if (session?.user) {
				if (requireVerification && !session.user.email_confirmed_at) {
					router.push("/auth/verify-email");
				} else {
					setUser(session.user);
					setIsLoading(false);
				}
			}
		});

		return () => subscription.unsubscribe();
	}, [router, requireVerification]);

	if (isLoading) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
