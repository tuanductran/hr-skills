/**
 * Normalize an author name to Title Case.
 *
 * Each whitespace-separated word is capitalized; all other characters are
 * lower-cased. Leading and trailing whitespace is stripped.
 *
 * @param name - The raw author string to normalize.
 * @returns The normalized Title Case author name.
 *
 * @example
 * normalizeAuthorName('john DOE') // => 'John Doe'
 */
export function normalizeAuthorName(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}
