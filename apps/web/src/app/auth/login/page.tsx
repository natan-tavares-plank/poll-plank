import { Button } from "@/components/ui/button";
import { login, signup } from "./actions";

const InputField = ({
	label,
	...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => {
	return (
		<div className="flex flex-col gap-2 text-sm dark:text-zinc-100">
			<label htmlFor={rest.id}>{label}:</label>
			<input
				{...rest}
				className="rounded-md border border-gray-300 p-1.5 outline-indigo-500 dark:border-zinc-800"
			/>
		</div>
	);
};

export default function LoginPage() {
	return (
		<div className="flex w-72 flex-col gap-4">
			<h1 className="font-bold text-2xl">Authentication</h1>
			<form className="flex flex-col gap-4">
				<InputField
					label="Email"
					id="email"
					name="email"
					type="email"
					required
					value={"natan.tavares@joinplank.com"}
				/>

				<InputField
					label="Password"
					id="password"
					name="password"
					type="password"
					required
					value={"123456"}
				/>

				<Button type="submit" formAction={login}>
					Log in
				</Button>
				<Button type="submit" variant="secondary" formAction={signup}>
					Sign up
				</Button>
			</form>
		</div>
	);
}
