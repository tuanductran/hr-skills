import * as v from 'valibot';
import { SKILL_CATEGORIES } from '../shared/schema.js';
import type { SkillCategory } from '../shared/types.js';

export const SearchRequestSchema = v.pipe(
	v.object({
		text: v.optional(v.pipe(v.string(), v.trim())),
		query: v.optional(v.pipe(v.string(), v.trim())),
		domain: v.optional(v.pipe(v.string(), v.trim(), v.picklist(SKILL_CATEGORIES))),
		fields: v.optional(
			v.array(
				v.union([
					v.literal('aliases'),
					v.literal('capabilities'),
					v.literal('tags'),
					v.literal('triggerPhrases'),
					v.literal('domain'),
				]),
			),
		),
		limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
		maxResults: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
		fuzzy: v.optional(v.boolean()),
	}),
	v.transform(
		(
			input,
		): {
			text: string;
			domain?: SkillCategory;
			fields?: Array<
				'aliases' | 'capabilities' | 'tags' | 'triggerPhrases' | 'domain'
			>;
			fuzzy?: boolean;
			limit?: number;
		} => {
			const resolvedLimit = input.limit ?? input.maxResults;
			return {
				text: input.text ?? input.query ?? '',
				...(input.domain !== undefined && {
					domain: input.domain,
				}),
				...(input.fields !== undefined && { fields: input.fields }),
				...(input.fuzzy !== undefined && { fuzzy: input.fuzzy }),
				...(resolvedLimit !== undefined && { limit: resolvedLimit }),
			};
		},
	),
);

export const PlannerRequestSchema = v.object({
	intent: v.pipe(v.string(), v.trim(), v.minLength(1, 'Intent must not be empty')),
});

export type SearchRequestInput = v.InferOutput<typeof SearchRequestSchema>;
export type PlannerRequestInput = v.InferOutput<typeof PlannerRequestSchema>;
