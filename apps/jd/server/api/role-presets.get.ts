import { rolePresets } from '#shared/types/jd';

export default defineEventHandler(() => ({
	data: rolePresets,
	meta: { count: rolePresets.length, schemaVersion: '1.0' },
}));
