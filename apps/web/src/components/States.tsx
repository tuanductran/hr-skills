import { LoaderCircle } from 'lucide-react';

export function LoadingState() {
	return (
		<section
			className='flex flex-1 items-center justify-center py-16'
			aria-busy='true'
			aria-live='polite'>
			<div className='flex max-w-sm flex-col items-center text-center'>
				<span className='mb-4 grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100'>
					<LoaderCircle
						className='animate-spin'
						size={24}
						aria-hidden='true'
					/>
				</span>
				<p className='m-0 mb-2 font-mono text-[.76rem] font-600 uppercase tracking-[.08em] text-blue-700'>
					Canonical registry
				</p>
				<h1 className='m-0 font-heading text-[1.12rem] font-700 leading-[1.3] text-slate-900'>
					Loading HR Skills
				</h1>
				<p className='m-0 mt-1 text-[.92rem] text-slate-500'>
					Reading the current skills snapshot.
				</p>
			</div>
		</section>
	);
}

export function ErrorState({
	message,
	primaryAction,
}: {
	message: string;
	primaryAction?: { label: string; onClick: () => void };
}) {
	return (
		<section className='max-w-[760px] py-18 pb-10'>
			<p className='m-0 mb-3.5 font-mono text-[.76rem] font-600 uppercase tracking-[.08em] text-blue-700'>
				Registry unavailable
			</p>
			<h1 className='m-0 mb-4.5 font-heading text-[clamp(2.8rem,6vw,4.2rem)] font-700 leading-[1.05] tracking-[-.04em] text-slate-900'>
				Unable to load the skills directory.
			</h1>
			<p className='m-0 mb-7 text-[1.18rem] leading-[1.55] text-slate-600'>
				{message}
			</p>
			{primaryAction && (
				<button
					className='rounded-lg bg-blue-700 px-3.5 py-2 text-[.86rem] font-700 text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
					type='button'
					onClick={primaryAction.onClick}>
					{primaryAction.label}
				</button>
			)}
		</section>
	);
}
