export const TextField = ({
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
