import { ChevronDown, Clipboard, FileCode2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { copyText } from '../lib/clipboard';

export function SupportingFiles({
	label,
	files,
}: {
	label: string;
	files: readonly { fileName: string; markdown: string }[];
}) {
	if (!files.length) return null;
	return (
		<details className='group rounded-xl border border-slate-200 bg-white p-4'>
			<summary className='flex cursor-pointer list-none items-center justify-between gap-3 rounded-md font-heading text-[.95rem] font-800 text-slate-900 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'>
				<span className='flex items-center gap-2'>
					<FileCode2
						size={16}
						className='text-blue-700'
						aria-hidden='true'
					/>
					{label}
					<span className='rounded-full bg-slate-100 px-1.75 py-.5 font-mono text-[.62rem] text-slate-500'>
						{files.length}
					</span>
				</span>
				<ChevronDown
					className='transition group-open:rotate-180'
					size={16}
					aria-hidden='true'
				/>
			</summary>
			<div className='mt-4 grid gap-3'>
				{files.map((file) => (
					<article
						className='overflow-hidden rounded-lg border border-slate-200'
						key={file.fileName}>
						<div className='flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2'>
							<h4 className='m-0 min-w-0 truncate font-mono text-[.72rem] font-600 text-slate-700'>
								{file.fileName}
							</h4>
							<button
								className='inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-[.65rem] font-700 text-slate-500 transition hover:bg-white hover:text-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
								type='button'
								onClick={async () => {
									if (await copyText(file.markdown))
										toast.success(`${file.fileName} copied.`);
									else toast.error(`Unable to copy ${file.fileName}.`);
								}}>
								<Clipboard
									size={12}
									aria-hidden='true'
								/>
								Copy
							</button>
						</div>
						<pre className='m-0 max-h-90 overflow-auto bg-slate-950 p-3 font-mono text-[.72rem] leading-[1.6] text-slate-100'>
							<code>{file.markdown}</code>
						</pre>
					</article>
				))}
			</div>
		</details>
	);
}
