'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';

const links = [
	{ href: '#library', label: 'Library' },
	{ href: '#method', label: 'How it works' },
	{ href: '#products', label: 'Product tracks' },
];

export default function MobileNav() {
	const [open, setOpen] = useState(false);
	const menuId = useId();

	useEffect(() => {
		if (!open) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setOpen(false);
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [open]);

	return (
		<div className='md:hidden'>
			<button
				type='button'
				className='inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--white)] px-4 text-sm font-bold text-[var(--ink)] transition hover:border-[var(--blue)] active:scale-[0.97]'
				aria-expanded={open}
				aria-controls={menuId}
				onClick={() => setOpen((value) => !value)}>
				<span aria-hidden='true'>{open ? '×' : '☰'}</span>
				<span>{open ? 'Close' : 'Menu'}</span>
			</button>
			{open ? (
				<div
					id={menuId}
					className='absolute inset-x-0 top-full border-b border-[var(--line)] bg-[var(--paper)] px-5 pb-5 pt-3 shadow-lg'
					role='dialog'
					aria-label='Mobile navigation'>
					<nav
						className='grid gap-1'
						aria-label='Mobile main navigation'>
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className='rounded-xl px-3 py-3 text-base font-bold text-[var(--ink)] transition hover:bg-[var(--white)] hover:text-[var(--blue)]'
								onClick={() => setOpen(false)}>
								{link.label}
							</Link>
						))}
						<a
							href='https://github.com/tuanductran/hr-skills'
							target='_blank'
							rel='noreferrer'
							className='mt-2 rounded-xl bg-[var(--ink)] px-3 py-3 text-base font-bold text-white transition hover:bg-[var(--blue-deep)]'
							onClick={() => setOpen(false)}>
							View on GitHub <span aria-hidden='true'>↗</span>
						</a>
					</nav>
				</div>
			) : null}
		</div>
	);
}
