'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';

const exploreLinks = [
	{ href: '/graph', label: 'Skill graph', description: 'How skills relate' },
	{ href: '/runtime', label: 'Runtime trace', description: 'Replay a workflow' },
	{ href: '/evaluation', label: 'Evaluation', description: 'Planner quality' },
	{ href: '/changelog', label: 'Changelog', description: 'What shipped' },
] as const;

function ChevronIcon() {
	return (
		<svg
			aria-hidden='true'
			viewBox='0 0 16 16'
			width='14'
			height='14'
			fill='none'>
			<path
				d='M4 6l4 4 4-4'
				stroke='currentColor'
				strokeWidth='1.75'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	);
}

function MenuIcon() {
	return (
		<svg
			aria-hidden='true'
			viewBox='0 0 20 20'
			width='18'
			height='18'
			fill='none'>
			<path
				d='M3 6h14M3 10h14M3 14h14'
				stroke='currentColor'
				strokeWidth='1.6'
				strokeLinecap='round'
			/>
		</svg>
	);
}

export function SiteHeader() {
	return (
		<header className='site-header'>
			<div className='site-shell site-header__inner'>
				<Link
					className='brand'
					href='/'>
					<span
						aria-hidden='true'
						className='brand__mark'>
						HR
					</span>
					<span>
						<strong>HR Skills</strong>
						<small>Practical HR knowledge</small>
					</span>
				</Link>

				<nav
					aria-label='Primary navigation'
					className='site-nav'>
					<Link href='/'>Home</Link>
					<Link href='/skills'>Catalog</Link>
					<Link
						className='site-nav__primary'
						href='/planner'>
						Planner
					</Link>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger
							className='nav-menu-trigger'
							type='button'>
							How it works
							<ChevronIcon />
						</DropdownMenu.Trigger>
						<DropdownMenu.Portal>
							<DropdownMenu.Content
								align='end'
								className='nav-menu-content'
								sideOffset={8}>
								{exploreLinks.map((item) => (
									<DropdownMenu.Item
										asChild
										className='nav-menu-item'
										key={item.href}>
										<Link href={item.href}>
											{item.label}
											<span>{item.description}</span>
										</Link>
									</DropdownMenu.Item>
								))}
							</DropdownMenu.Content>
						</DropdownMenu.Portal>
					</DropdownMenu.Root>
					<a
						className='site-nav__github'
						href='https://github.com/tuanductran/hr-skills'>
						GitHub <span aria-hidden='true'>↗</span>
					</a>
				</nav>

				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						aria-label='Open navigation menu'
						className='mobile-nav-trigger'
						type='button'>
						<MenuIcon />
					</DropdownMenu.Trigger>
					<DropdownMenu.Portal>
						<DropdownMenu.Content
							align='end'
							className='nav-menu-content'
							sideOffset={8}>
							<DropdownMenu.Item
								asChild
								className='nav-menu-item'>
								<Link href='/'>Home</Link>
							</DropdownMenu.Item>
							<DropdownMenu.Item
								asChild
								className='nav-menu-item'>
								<Link href='/skills'>Catalog</Link>
							</DropdownMenu.Item>
							<DropdownMenu.Item
								asChild
								className='nav-menu-item'>
								<Link href='/planner'>Planner</Link>
							</DropdownMenu.Item>
							<DropdownMenu.Separator className='nav-menu-separator' />
							{exploreLinks.map((item) => (
								<DropdownMenu.Item
									asChild
									className='nav-menu-item'
									key={item.href}>
									<Link href={item.href}>
										{item.label}
										<span>{item.description}</span>
									</Link>
								</DropdownMenu.Item>
							))}
							<DropdownMenu.Separator className='nav-menu-separator' />
							<DropdownMenu.Item
								asChild
								className='nav-menu-item'>
								<a href='https://github.com/tuanductran/hr-skills'>
									GitHub ↗
								</a>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
			</div>
		</header>
	);
}
