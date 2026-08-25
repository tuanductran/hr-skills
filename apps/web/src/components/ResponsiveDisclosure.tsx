import { ChevronDown } from 'lucide-react';
import { type ReactNode, useId, useState } from 'react';

export function ResponsiveDisclosure({
	label,
	children,
	defaultOpen = false,
}: {
	label: string;
	children: ReactNode;
	defaultOpen?: boolean;
}) {
	const [open, setOpen] = useState(defaultOpen);
	const contentId = useId();

	return (
		<>
			<button
				className='flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-[.8rem] font-800 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200 xl:hidden'
				type='button'
				aria-expanded={open}
				aria-controls={contentId}
				onClick={() => setOpen((value) => !value)}>
				<span>{label}</span>
				<ChevronDown
					size={16}
					className={`transition ${open ? 'rotate-180' : ''}`}
					aria-hidden='true'
				/>
			</button>
			<div
				id={contentId}
				className={`${open ? 'mt-3 grid' : 'hidden'} xl:mt-0 xl:grid`}>
				{children}
			</div>
		</>
	);
}
