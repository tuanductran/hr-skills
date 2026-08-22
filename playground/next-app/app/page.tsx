import { ClientWidget } from './client-widget';

export default function Page() {
	return (
		<main className='mx-auto grid min-h-dvh w-[min(960px,calc(100%-2rem))] content-start gap-8 py-12 sm:py-20'>
			<header className='max-w-3xl'>
				<p className='mb-3 text-xs font-black uppercase tracking-[0.17em] text-brand'>
					Playground · Next.js
				</p>
				<h1 className='text-balance text-5xl font-medium tracking-[-0.07em] sm:text-7xl'>
					Client-safe HR Skills APIs.
				</h1>
				<p className='mt-5 text-pretty text-lg leading-8 text-muted'>
					A focused sandbox for verifying browser-safe imports from{' '}
					<code className='rounded bg-brand-soft px-1.5 py-0.5 text-sm text-brand-strong'>
						hr-skills-build/client
					</code>
					.
				</p>
			</header>
			<ClientWidget />
		</main>
	);
}
