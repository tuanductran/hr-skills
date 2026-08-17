import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
	title: 'hr-skills-build playground (Next.js)',
	description:
		'Browser smoke test proving hr-skills-build/client bundles without node: builtins.',
};

// Keep the playground aligned with the shared light Design System tokens.
export const viewport: Viewport = {
	colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	);
}
