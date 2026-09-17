/**
 * Return the first element of a non-empty readonly array.
 *
 * Internal-only — only consumed by `test/validation/validate.test.ts` for
 * asserting on the first collected validation issue. Never re-exported from
 * the package's public entrypoints.
 *
 * @param items - A readonly array that must contain at least one element.
 * @returns The first element of `items`.
 * @throws {Error} If `items` is empty.
 */
export function first<T>(items: readonly T[]): T {
	const value = items.at(0);

	if (value === undefined)
		throw new Error('Expected array to contain at least one element.');

	return value;
}
