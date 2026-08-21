import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: {
		default: 'HR Skills — Make people work clearer',
		template: '%s | HR Skills',
	},
	description:
		'A practical, evidence-shaped library for the people work behind better teams.',
};

export const viewport: Viewport = {
	colorScheme: 'light',
	themeColor: '#f6f4ee',
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	);
}
