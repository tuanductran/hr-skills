import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hr-skills.dev';

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: 'HR Skills — Make people work clearer',
		template: '%s | HR Skills',
	},
	description:
		'A practical, evidence-shaped library for the people work behind better teams.',
	keywords: ['HR skills', 'human resources', 'talent acquisition', 'people operations'],
	authors: [{ name: 'HR Skills' }],
	creator: 'HR Skills',
	alternates: { canonical: '/' },
	openGraph: {
		type: 'website',
		url: siteUrl,
		siteName: 'HR Skills',
		title: 'HR Skills — Make people work clearer',
		description:
			'A practical, evidence-shaped library for the people work behind better teams.',
		locale: 'en_US',
	},
	twitter: {
		card: 'summary',
		title: 'HR Skills — Make people work clearer',
		description:
			'A practical, evidence-shaped library for the people work behind better teams.',
	},
	robots: { index: true, follow: true },
};

export const viewport: Viewport = {
	colorScheme: 'light',
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#f6f4ee' },
		{ media: '(prefers-color-scheme: dark)', color: '#132238' },
	],
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
