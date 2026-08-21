'use client';

import { ArrowUpRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

const links = [
	{ href: '#library', label: 'Library' },
	{ href: '#method', label: 'How it works' },
	{ href: '#products', label: 'Product tracks' },
];

export default function MobileNav() {
	const [open, setOpen] = useState(false);
	const menuId = useId();
	const triggerRef = useRef<HTMLButtonElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const wasOpenRef = useRef(false);

	useEffect(() => {
		if (!open) {
			if (wasOpenRef.current) triggerRef.current?.focus();
			wasOpenRef.current = false;
			return;
		}
		wasOpenRef.current = true;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const panel = panelRef.current;
		const firstFocusable = panel?.querySelector<HTMLElement>(
			'a[href], button:not([disabled])',
		);
		firstFocusable?.focus();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				setOpen(false);
				return;
			}
			if (event.key !== 'Tab' || !panel) return;

			const focusable = [
				...panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
			];
			if (focusable.length === 0) return;

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		window.addEventListener('keydown', onKeyDown);
		return () => {
			window.removeEventListener('keydown', onKeyDown);
			document.body.style.overflow = previousOverflow;
		};
	}, [open]);

	return (
		<div className='md:hidden'>
			<button
				ref={triggerRef}
				type='button'
				className='inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--white)] px-4 text-sm font-bold text-[var(--ink)] transition hover:border-[var(--blue)] active:scale-[0.97]'
				aria-expanded={open}
				aria-controls={menuId}
				aria-label={open ? 'Close menu' : 'Menu'}
				onClick={() => setOpen((value) => !value)}>
				{open ? (
					<X
						aria-hidden='true'
						size={18}
						strokeWidth={2.5}
					/>
				) : (
					<Menu
						aria-hidden='true'
						size={18}
						strokeWidth={2.5}
					/>
				)}

				<span>{open ? 'Close' : 'Menu'}</span>
			</button>
			{open ? (
				<>
					<button
						className='fixed inset-0 z-40 bg-[var(--ink)]/20 md:hidden'
						type='button'
						aria-label='Close mobile navigation'
						onClick={() => setOpen(false)}
					/>
					<div
						ref={panelRef}
						id={menuId}
						className='absolute inset-x-0 top-full border-b border-[var(--line)] bg-[var(--paper)] px-5 pb-5 pt-3 shadow-lg'
						role='dialog'
						aria-modal='true'
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
								View on GitHub{' '}
								<ArrowUpRight
									aria-hidden='true'
									size={17}
									strokeWidth={2.5}
								/>
							</a>
						</nav>
					</div>
				</>
			) : null}
		</div>
	);
}
