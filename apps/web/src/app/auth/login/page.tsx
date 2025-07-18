import { AuthForm } from "./form";

export default function LoginPage() {
	return (
		<div className="flex w-72 flex-col gap-4">
			<h1 className="font-bold text-2xl">Authentication</h1>
			<AuthForm />
		</div>
	);
}
