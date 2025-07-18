"use client";

import { TextField } from "@/components/text-field";
import { Button } from "@/components/ui/button";
import { login, signup } from "./actions";

export const AuthForm = () => {
	return (
		<form className="flex flex-col gap-4">
			<TextField label="Email" id="email" name="email" type="email" required />

			<TextField
				label="Password"
				id="password"
				name="password"
				type="password"
				required
			/>

			<Button type="submit" formAction={login}>
				Log in
			</Button>
			<Button type="submit" variant="secondary" formAction={signup}>
				Sign up
			</Button>
		</form>
	);
};
