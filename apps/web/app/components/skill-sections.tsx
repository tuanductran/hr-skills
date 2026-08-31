'use client';

import * as Accordion from '@radix-ui/react-accordion';
import type { DocumentationSection } from 'hr-skills-build/client';
import { MarkdownContent } from './markdown-content';

function sourceLabel(fileName: string): string {
	return fileName.replace(/\.md$/, '').replaceAll('-', ' ');
}

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

interface SkillSectionsProps {
	readonly sections: readonly DocumentationSection[];
}

/** Independently expandable Markdown sections (skill Prompts / Examples). */
export function SkillSections({ sections }: SkillSectionsProps) {
	const defaultValue = sections.length === 1 ? [sections[0].fileName] : [];

	return (
		<Accordion.Root
			className='skill-accordion'
			defaultValue={defaultValue}
			type='multiple'>
			{sections.map((section) => (
				<Accordion.Item
					className='skill-accordion-item'
					key={section.fileName}
					value={section.fileName}>
					<Accordion.Header>
						<Accordion.Trigger className='skill-accordion-trigger'>
							{sourceLabel(section.fileName)}
							<ChevronIcon />
						</Accordion.Trigger>
					</Accordion.Header>
					<Accordion.Content className='skill-accordion-content'>
						<div className='skill-accordion-content-inner'>
							<MarkdownContent content={section.markdown} />
						</div>
					</Accordion.Content>
				</Accordion.Item>
			))}
		</Accordion.Root>
	);
}
