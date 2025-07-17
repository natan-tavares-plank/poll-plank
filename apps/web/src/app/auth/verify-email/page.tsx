import { redirect } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/supabase/auth";

export default async function VerifyEmailPage() {
	const user = await getCurrentUser();

	if (user?.confirmed_at) {
		redirect("/");
	}

	return (
		<div className="container mx-auto max-w-md px-4 py-8">
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Check your email</CardTitle>
					<CardDescription>
						We've sent a verification link to your email address.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="text-muted-foreground text-sm">
						<p className="mb-4">
							Click the link in your email to verify your account and start
							using Poll Plank.
						</p>
						<p>
							Didn't receive the email? Check your spam folder or try resending
							it.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
