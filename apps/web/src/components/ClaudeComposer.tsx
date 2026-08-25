/* HR Skills Workspace: Radix Dialog handoff in Slate/Blue; state-aware, short motion; Inter/Manrope/Fira hierarchy. */
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, Clipboard, ExternalLink, RotateCcw, X } from 'lucide-react';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
	buildClaudeUrl,
	CLAUDE_LINK_WARNING_LENGTH,
	CLAUDE_PROMPT_TEMPLATES,
	type ClaudeTemplateId,
	getClaudeTemplatePrompt,
	getRawSkillUrl,
} from '../lib/claude';
import { copyText } from '../lib/clipboard';

export function ClaudeComposer({
	skillId,
	trigger,
}: {
	skillId: string;
	trigger: ReactNode;
}) {
	const [open, setOpen] = useState(false);
	const [templateId, setTemplateId] = useState<ClaudeTemplateId>('read');
	const [prompt, setPrompt] = useState(() => getClaudeTemplatePrompt('read', skillId));
	const rawSkillUrl = getRawSkillUrl(skillId);

	useEffect(() => {
		setTemplateId('read');
		setPrompt(getClaudeTemplatePrompt('read', skillId));
	}, [skillId]);

	const handleOpenChange = (nextOpen: boolean) => {
		if (nextOpen) {
			setTemplateId('read');
			setPrompt(getClaudeTemplatePrompt('read', skillId));
		}
		setOpen(nextOpen);
	};

	const claudeUrl = useMemo(() => buildClaudeUrl(prompt), [prompt]);
	const linkIsLong = claudeUrl.length > CLAUDE_LINK_WARNING_LENGTH;
	const applyTemplate = (id: ClaudeTemplateId) => {
		setTemplateId(id);
		setPrompt(getClaudeTemplatePrompt(id, skillId));
	};

	return (
		<Dialog.Root
			open={open}
			onOpenChange={handleOpenChange}>
			<Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className='fixed inset-0 z-60 bg-slate-950/45 backdrop-blur-[2px] data-[state=closed]:animate-workspace-overlay-out data-[state=open]:animate-workspace-overlay-in motion-reduce:animate-none' />
				<Dialog.Content className='fixed left-1/2 top-1/2 z-70 max-h-[min(86vh,760px)] w-[min(94vw,720px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-2xl shadow-slate-950/30 data-[state=closed]:animate-workspace-dialog-out data-[state=open]:animate-workspace-dialog-in motion-reduce:animate-none sm:p-6'>
					<div className='flex items-start justify-between gap-5'>
						<div>
							<p className='m-0 font-mono text-[.65rem] font-600 uppercase tracking-[.13em] text-blue-700'>
								External handoff
							</p>
							<Dialog.Title asChild>
								<h2 className='m-0 mt-1 font-heading text-[1.45rem] font-800 tracking-[-.035em] text-slate-950'>
									Prepare a Claude prompt
								</h2>
							</Dialog.Title>
							<Dialog.Description asChild>
								<p className='m-0 mt-2 max-w-[560px] text-[.86rem] leading-[1.5] text-slate-600'>
									Choose a safe starting template, edit it for your
									task, then open a new Claude conversation with the raw
									main-branch source.
								</p>
							</Dialog.Description>
						</div>
						<Dialog.Close asChild>
							<button
								className='grid size-9 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
								type='button'
								aria-label='Close Claude composer'>
								<X
									size={18}
									aria-hidden='true'
								/>
							</button>
						</Dialog.Close>
					</div>

					<fieldset className='m-0 mt-5 border-0 p-0'>
						<legend className='mb-2 font-mono text-[.65rem] font-600 uppercase tracking-[.11em] text-slate-500'>
							Prompt template
						</legend>
						<div className='grid gap-2 sm:grid-cols-2'>
							{CLAUDE_PROMPT_TEMPLATES.map((template) => (
								<button
									className={`rounded-lg border p-3 text-left transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200 ${templateId === template.id ? 'border-blue-300 bg-blue-50 text-blue-900' : 'border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50'}`}
									key={template.id}
									type='button'
									onClick={() => applyTemplate(template.id)}>
									<span className='block text-[.8rem] font-800'>
										{template.label}
									</span>
									<span className='mt-1 block text-[.7rem] leading-[1.35] opacity-75'>
										{template.description}
									</span>
								</button>
							))}
						</div>
					</fieldset>

					<div className='mt-5'>
						<div className='mb-2 flex items-center justify-between gap-3'>
							<label
								className='font-mono text-[.65rem] font-600 uppercase tracking-[.11em] text-slate-500'
								htmlFor='claude-prompt'>
								Editable prompt
							</label>
							<button
								className='inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[.7rem] font-700 text-slate-500 transition hover:bg-slate-100 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
								type='button'
								onClick={() => applyTemplate(templateId)}>
								<RotateCcw
									size={13}
									aria-hidden='true'
								/>
								Reset template
							</button>
						</div>
						<textarea
							id='claude-prompt'
							className='min-h-44 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[.78rem] leading-[1.6] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100'
							value={prompt}
							onChange={(event) => setPrompt(event.target.value)}
						/>
						<div className='mt-2 flex flex-wrap justify-between gap-2 text-[.7rem] text-slate-400'>
							<span>
								{prompt.length} characters · not stored by this app
							</span>
							<span>{claudeUrl.length} encoded link characters</span>
						</div>
					</div>

					<div className='mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[.76rem] leading-[1.5] text-amber-900'>
						<div className='flex gap-2'>
							<AlertTriangle
								size={16}
								className='mt-.25 shrink-0'
								aria-hidden='true'
							/>
							<span>
								Do not paste personal, confidential, or employee data.
								This workspace does not send your prompt anywhere; opening
								Claude is your external handoff decision.
							</span>
						</div>
					</div>

					<div className='mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3'>
						<p className='m-0 font-mono text-[.63rem] font-600 uppercase tracking-[.1em] text-slate-500'>
							Canonical source · main branch
						</p>
						<p className='m-0 mt-1 break-all font-mono text-[.7rem] leading-[1.45] text-slate-600'>
							{rawSkillUrl}
						</p>
					</div>
					{linkIsLong && (
						<p className='m-0 mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[.75rem] leading-[1.45] text-amber-800'>
							This prefilled URL is long and may not open consistently. Copy
							the prompt and source URL as a fallback.
						</p>
					)}

					<div className='mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between'>
						<div className='flex flex-wrap gap-2'>
							<button
								className='inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[.76rem] font-700 text-slate-600 transition hover:border-blue-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
								type='button'
								onClick={async () => {
									if (await copyText(prompt))
										toast.success('Claude prompt copied.');
									else toast.error('Unable to copy this prompt.');
								}}>
								<Clipboard
									size={14}
									aria-hidden='true'
								/>
								Copy prompt
							</button>
							<button
								className='inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[.76rem] font-700 text-slate-600 transition hover:border-blue-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
								type='button'
								onClick={async () => {
									if (await copyText(rawSkillUrl))
										toast.success('Raw source URL copied.');
									else
										toast.error('Unable to copy the raw source URL.');
								}}>
								<Clipboard
									size={14}
									aria-hidden='true'
								/>
								Copy source
							</button>
						</div>
						<a
							className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-[.8rem] font-800 text-white no-underline transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200 ${prompt.trim() ? 'bg-blue-700 hover:bg-blue-800' : 'pointer-events-none bg-slate-300'}`}
							href={prompt.trim() ? claudeUrl : undefined}
							target='_blank'
							rel='noreferrer'
							onClick={() => {
								if (prompt.trim())
									toast.success('Opening Claude in a new tab.');
							}}>
							Open Claude
							<ExternalLink
								size={14}
								aria-hidden='true'
							/>
						</a>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
