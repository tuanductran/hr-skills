import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
	title: 'hr-skills-build playground (Next.js)',
	description:
		'Browser smoke test proving hr-skills-build/client bundles without node: builtins.',
};

// `colorScheme` lets the UA supply a dark background and readable text in dark
// mode without this playground shipping a stylesheet.
export const viewport: Viewport = {
	colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	);
}
