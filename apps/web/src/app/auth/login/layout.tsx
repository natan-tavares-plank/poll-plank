export default function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="m-auto flex h-full p-8">{children}</div>;
}
