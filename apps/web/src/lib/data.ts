import { useQuery } from '@tanstack/react-query';
import type { HrSkill, HrSkillSummary, HrSkillsSnapshot } from './types';

const snapshotUrl = `${import.meta.env.BASE_URL}data/hr-skills.json`;

async function loadSnapshot({
	signal,
}: {
	signal?: AbortSignal;
} = {}): Promise<HrSkillsSnapshot> {
	const response = await fetch(snapshotUrl, { signal });
	if (!response.ok) throw new Error('Unable to load the HR Skills registry.');
	return response.json() as Promise<HrSkillsSnapshot>;
}

async function loadSkillDetail({
	skillId,
	signal,
}: {
	skillId: string;
	signal?: AbortSignal;
}): Promise<HrSkill> {
	const response = await fetch(
		`${import.meta.env.BASE_URL}data/skills/${encodeURIComponent(skillId)}.json`,
		{ signal },
	);
	if (!response.ok) throw new Error('Unable to load this canonical skill.');
	return response.json() as Promise<HrSkill>;
}

export function useHrSkills() {
	return useQuery({
		queryKey: ['hr-skills-registry'],
		queryFn: ({ signal }) => loadSnapshot({ signal }),
	});
}

export function useHrSkillDetail(skillId: string, enabled: boolean) {
	return useQuery({
		queryKey: ['hr-skill-detail', skillId],
		queryFn: ({ signal }) => loadSkillDetail({ skillId, signal }),
		enabled,
	});
}

export function resolveCanonicalSkillId(
	requestedId: string,
	skills: ReadonlyArray<Pick<HrSkillSummary, 'id'>>,
) {
	const normalized = requestedId.trim().toLowerCase();
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) return undefined;
	const canonicalId = normalized.startsWith('hr-') ? normalized : `hr-${normalized}`;
	return skills.some((skill) => skill.id === canonicalId) ? canonicalId : undefined;
}

export function humanize(value: string) {
	return value
		.replace(/^hr-/, '')
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}
