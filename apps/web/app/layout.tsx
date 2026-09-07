import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SiteFooter } from './components/site-footer';
import { SiteHeader } from './components/site-header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
	description:
		'Browse practical HR Skills for modern human resources and talent acquisition work.',
	title: { default: 'HR Skills', template: '%s | HR Skills' },
};

export const viewport: Viewport = { colorScheme: 'light' };

interface RootLayoutProps {
	readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html
			lang='en'
			className={inter.variable}
			data-scroll-behavior='smooth'>
			<body>
				<a
					className='skip-link'
					href='#main-content'>
					Skip to content
				</a>
				<SiteHeader />
				{children}
				<SiteFooter />
			</body>
		</html>
	);
}
