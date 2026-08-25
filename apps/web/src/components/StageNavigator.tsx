import { ChevronRight, Workflow } from 'lucide-react';
import type { PeopleSystemStage } from '../lib/peopleSystem';

export function StageNavigator({
	stages,
	activeStageId,
	onSelect,
}: {
	stages: readonly PeopleSystemStage[];
	activeStageId: string;
	onSelect: (stageId: string) => void;
}) {
	return (
		<section className='rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm shadow-slate-200/40'>
			<div className='mb-3 flex items-center gap-2'>
				<Workflow
					size={16}
					className='text-blue-700'
					aria-hidden='true'
				/>
				<h2 className='m-0 font-heading text-[.9rem] font-800 text-slate-900'>
					Decision stages
				</h2>
			</div>
			<div className='grid gap-1'>
				{stages.map((stage, index) => {
					const selected = stage.id === activeStageId;
					return (
						<button
							className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200 ${selected ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
							key={stage.id}
							type='button'
							onClick={() => onSelect(stage.id)}>
							<span
								className={`grid size-6 shrink-0 place-items-center rounded-md font-mono text-[.64rem] ${selected ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500'}`}>
								{String(index + 1).padStart(2, '0')}
							</span>
							<span className='min-w-0 flex-1 text-[.8rem] font-700 leading-[1.25]'>
								{stage.title}
							</span>
							<ChevronRight
								size={14}
								className={selected ? 'opacity-100' : 'opacity-35'}
								aria-hidden='true'
							/>
						</button>
					);
				})}
			</div>
		</section>
	);
}
