import { XML_ESCAPES } from '../constants.js';

/**
 * Check whether a value is a plain object.
 *
 * @param value - The value to test.
 * @returns `true` for object literals and null-prototype objects.
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
	if (value === null || typeof value !== 'object') return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}

/**
 * Convert a value to a trimmed non-empty string.
 *
 * @param value - The value to convert.
 * @returns A trimmed string or `undefined` for empty/nullish values.
 */
export function toStringOrUndefined(value: unknown): string | undefined {
	return value != null ? String(value).trim() || undefined : undefined;
}

/**
 * Escape XML special characters.
 *
 * @param value - The raw string.
 * @returns An XML-safe string.
 */
export function escapeXml(value: string): string {
	return value.replace(/[&<>"']/g, (char) => XML_ESCAPES.get(char) ?? char);
}

/**
 * Remove prototype-pollution keys recursively from parsed YAML values.
 *
 * @param value - Parsed YAML value.
 * @returns A sanitized copy of the input value.
 */
export function sanitizeYamlValue(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(sanitizeYamlValue);
	if (value && typeof value === 'object') {
		const output = Object.create(null) as Record<string, unknown>;
		for (const [key, child] of Object.entries(value)) {
			if (key === '__proto__' || key === 'constructor' || key === 'prototype')
				continue;
			output[key] = sanitizeYamlValue(child);
		}
		return output;
	}
	return value;
}
