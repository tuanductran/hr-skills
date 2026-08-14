import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

interface MarkdownContentProps {
	readonly content: string;
}

const ALLOWED_TAGS = [
	'a',
	'blockquote',
	'code',
	'del',
	'dd',
	'div',
	'dl',
	'dt',
	'em',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'hr',
	'li',
	'ol',
	'p',
	'pre',
	'span',
	'strong',
	'table',
	'tbody',
	'td',
	'th',
	'thead',
	'tr',
	'ul',
];

/** Renders repository Markdown after parsing and allowlist sanitization. */
export function MarkdownContent({ content }: MarkdownContentProps) {
	const html = sanitizeHtml(marked.parse(content, { async: false, gfm: true }), {
		allowedAttributes: {
			a: ['href', 'rel', 'target', 'title'],
			code: ['class'],
			span: ['class'],
		},
		allowedSchemes: ['http', 'https', 'mailto'],
		allowedTags: ALLOWED_TAGS,
		transformTags: {
			a: sanitizeHtml.simpleTransform('a', { rel: 'noreferrer', target: '_blank' }),
		},
	});

	return (
		<div
			className='markdown-content'
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Markdown is parsed and allowlist-sanitized immediately above.
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
