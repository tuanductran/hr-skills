import { Clipboard } from 'lucide-react';
import { isValidElement, type ReactNode, useMemo } from 'react';
import toast from 'react-hot-toast';
import ReactMarkdown, { type Components } from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { copyText } from '../lib/clipboard';

function nodeText(value: ReactNode): string {
	if (typeof value === 'string' || typeof value === 'number') return String(value);
	if (Array.isArray(value)) return value.map(nodeText).join('');
	if (isValidElement<{ children?: ReactNode }>(value))
		return nodeText(value.props.children);
	return '';
}

function slugify(value: ReactNode) {
	return nodeText(value)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

function CopyablePre({ children }: { children?: ReactNode }) {
	const code = String(children ?? '').replace(/^\n|\n$/g, '');
	return (
		<div className='group relative mb-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-sm shadow-slate-950/10'>
			<button
				className='absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/8 px-2 py-1 font-mono text-[.65rem] text-slate-300 opacity-0 transition hover:bg-white/15 hover:text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-300 group-hover:opacity-100'
				type='button'
				onClick={async () => {
					if (await copyText(code)) toast.success('Code block copied.');
					else toast.error('Unable to copy this block.');
				}}>
				<Clipboard
					size={13}
					aria-hidden='true'
				/>
				Copy
			</button>
			<pre className='m-0 overflow-x-auto p-4 pr-18 font-mono text-[.8rem] leading-[1.65] text-slate-100'>
				{children}
			</pre>
		</div>
	);
}

export function MarkdownContent({ content }: { content: string }) {
	const components = useMemo<Components>(
		() => ({
			h1: ({ children, ...props }) => (
				<h2
					{...props}
					id={slugify(children)}
					className='mb-5 mt-12 scroll-mt-22 font-heading text-[1.8rem] font-800 leading-[1.12] tracking-[-.035em] text-slate-950'>
					{children}
				</h2>
			),
			h2: ({ children, ...props }) => (
				<h3
					{...props}
					id={slugify(children)}
					className='mb-3 mt-10 scroll-mt-22 border-b border-slate-200 pb-2 font-heading text-[1.35rem] font-800 leading-[1.2] tracking-[-.025em] text-slate-950'>
					{children}
				</h3>
			),
			h3: ({ children, ...props }) => (
				<h4
					{...props}
					id={slugify(children)}
					className='mb-2.5 mt-8 scroll-mt-22 font-heading text-[1.05rem] font-800 leading-[1.3] text-slate-900'>
					{children}
				</h4>
			),
			p: ({ children, ...props }) => (
				<p
					{...props}
					className='m-0 mb-5 text-[.96rem] leading-[1.75] text-slate-700'>
					{children}
				</p>
			),
			ul: ({ children, ...props }) => (
				<ul
					{...props}
					className='mb-5 mt-0 grid gap-1.5 pl-5 text-[.96rem] leading-[1.65] text-slate-700'>
					{children}
				</ul>
			),
			ol: ({ children, ...props }) => (
				<ol
					{...props}
					className='mb-5 mt-0 grid gap-1.5 pl-5 text-[.96rem] leading-[1.65] text-slate-700'>
					{children}
				</ol>
			),
			li: ({ children, ...props }) => (
				<li
					{...props}
					className='pl-1'>
					{children}
				</li>
			),
			blockquote: ({ children, ...props }) => (
				<blockquote
					{...props}
					className='mb-5 border-l-3 border-blue-600 bg-blue-50/70 py-3 pl-4 pr-4 text-slate-700'>
					{children}
				</blockquote>
			),
			pre: ({ children }) => <CopyablePre>{children}</CopyablePre>,
			code: ({ children, className, ...props }) => {
				const isBlock = Boolean(className);
				return isBlock ? (
					<code
						{...props}
						className='font-mono'>
						{children}
					</code>
				) : (
					<code
						{...props}
						className='rounded bg-slate-100 px-1.25 py-.5 font-mono text-[.84em] text-blue-800'>
						{children}
					</code>
				);
			},
			a: ({ children, href, ...props }) => (
				<a
					{...props}
					href={href}
					target='_blank'
					rel='noreferrer'
					className='font-700 text-blue-700 underline decoration-blue-300 underline-offset-3 transition hover:text-blue-900 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'>
					{children}
				</a>
			),
			table: ({ children, ...props }) => (
				<div className='mb-5 overflow-x-auto rounded-xl border border-slate-200'>
					<table
						{...props}
						className='w-full border-collapse text-left text-[.82rem] text-slate-700'>
						{children}
					</table>
				</div>
			),
			th: ({ children, ...props }) => (
				<th
					{...props}
					className='border-b border-slate-200 bg-slate-50 px-3 py-2.5 font-800 text-slate-900'>
					{children}
				</th>
			),
			td: ({ children, ...props }) => (
				<td
					{...props}
					className='border-b border-slate-100 px-3 py-2.5 align-top last:border-0'>
					{children}
				</td>
			),
		}),
		[],
	);

	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			rehypePlugins={[rehypeSanitize]}
			components={components}>
			{content}
		</ReactMarkdown>
	);
}
