import { describe, expect, it } from 'bun:test';
import { inflateRawSync } from 'node:zlib';

import { buildZipBuffer } from '../../src/build/build-skills.js';

const LOCAL_HEADER_SIG = 0x04034b50;
const CENTRAL_HEADER_SIG = 0x02014b50;
const EOCD_SIG = 0x06054b50;
const EOCD_SIZE = 22;

function entry(arcname: string, body: string) {
	return {
		arcname,
		data: Buffer.from(body, 'utf8'),
		mtime: new Date('2026-01-02T03:04:05Z'),
	};
}

describe('buildZipBuffer()', () => {
	// Regression guard: `currentOffset` used to be `const currentOffset = 0`, so
	// every central-directory entry and the EOCD recorded offset 0. `namelist()`
	// still worked (readers self-heal the central-directory offset), which is why
	// this shipped unnoticed — but any entry past the first failed to extract
	// with "Bad magic number for file header".
	it('points every central-directory entry at its own local header', () => {
		const files = [
			entry('LICENSE', 'MIT'.repeat(40)),
			entry('SKILL.md', '# heading\n'.repeat(40)),
			entry('skills/hr-onboarding/SKILL.md', 'onboarding'.repeat(40)),
		];
		const buf = buildZipBuffer(files);

		// No archive comment is ever written, so the EOCD is the final 22 bytes.
		const eocd = buf.length - EOCD_SIZE;
		expect(buf.readUInt32LE(eocd)).toBe(EOCD_SIG);

		const totalEntries = buf.readUInt16LE(eocd + 10);
		const centralSize = buf.readUInt32LE(eocd + 12);
		const centralStart = buf.readUInt32LE(eocd + 16);

		expect(totalEntries).toBe(files.length);
		// The central directory has to begin where the EOCD claims it does.
		expect(centralStart).toBe(eocd - centralSize);
		expect(buf.readUInt32LE(centralStart)).toBe(CENTRAL_HEADER_SIG);

		const localOffsets: number[] = [];
		let cursor = centralStart;

		for (const expected of files) {
			expect(buf.readUInt32LE(cursor)).toBe(CENTRAL_HEADER_SIG);

			const nameLength = buf.readUInt16LE(cursor + 28);
			const name = buf.toString('utf8', cursor + 46, cursor + 46 + nameLength);
			const localOffset = buf.readUInt32LE(cursor + 42);

			expect(name).toBe(expected.arcname);

			// The stored offset must land on this entry's local header...
			expect(buf.readUInt32LE(localOffset)).toBe(LOCAL_HEADER_SIG);
			const localNameLength = buf.readUInt16LE(localOffset + 26);
			expect(
				buf.toString(
					'utf8',
					localOffset + 30,
					localOffset + 30 + localNameLength,
				),
			).toBe(expected.arcname);

			// ...and the bytes there must inflate back to the original content.
			const compressedSize = buf.readUInt32LE(localOffset + 18);
			const dataStart = localOffset + 30 + localNameLength;
			const inflated = inflateRawSync(
				buf.subarray(dataStart, dataStart + compressedSize),
			);
			expect(inflated.toString('utf8')).toBe(expected.data.toString('utf8'));

			localOffsets.push(localOffset);
			cursor += 46 + nameLength;
		}

		// Strictly increasing: the all-zero offsets of the original bug fail here.
		expect(localOffsets[0]).toBe(0);
		for (let i = 1; i < localOffsets.length; i++) {
			expect(localOffsets[i]).toBeGreaterThan(localOffsets[i - 1] as number);
		}
	});
});
