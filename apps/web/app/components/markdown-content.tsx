import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

interface MarkdownContentProps {
	readonly content: string;
}

/** Renders repository Markdown through a server-side unified AST pipeline. */
export async function MarkdownContent({ content }: MarkdownContentProps) {
	const result = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeSanitize)
		.use(rehypeStringify)
		.process(content);

	return (
		<div
			className='prose prose-slate max-w-none text-pretty prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-brand prose-a:no-underline prose-a:underline-offset-4 hover:prose-a:underline prose-pre:overflow-x-auto prose-pre:rounded-2xl prose-pre:bg-ink prose-pre:text-surface prose-code:rounded prose-code:bg-brand-soft prose-code:px-1 prose-code:py-0.5 prose-code:text-brand-strong prose-code:before:content-none prose-code:after:content-none'
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Markdown is parsed and sanitized by unified immediately above.
			dangerouslySetInnerHTML={{ __html: String(result) }}
		/>
	);
}
