export async function copyText(value: string) {
	if (!navigator.clipboard?.writeText) return false;

	try {
		await navigator.clipboard.writeText(value);
		return true;
	} catch {
		return false;
	}
}
