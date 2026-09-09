/**
 * Build distribution artifacts for HR Skills.
 *
 * Flags
 * -----
 * default   Build both dist/hr-skills.zip and dist/hr-skills.skill
 * --zip     Build dist/hr-skills.zip only
 * --skill   Build dist/hr-skills.skill only
 *
 * Examples
 * --------
 * bun run build-skills
 * bun run build-skills -- --zip
 * bun run build-skills -- --skill
 *
 * Formats
 * -------
 * hr-skills.zip
 *     Standard distribution zip for manual extraction and document-based tools.
 *     Includes root SKILL.md, LICENSE, docs/product/USER.md, and the full
 *     skills/ tree. Excludes .claude-plugin/ (internal tooling, not shipped
 *     in the zip).
 *
 * hr-skills.skill
 *     Skill-oriented archive with the same core knowledge files as the zip.
 *     Also includes the .claude-plugin/ JSON manifests only (for example
 *     marketplace.json) — non-JSON files such as .claude-plugin/README.md
 *     are internal-repo documentation and are never packaged.
 *
 * Ported from soulmap-ai/src/soulmap/devtools/packaging/build_skill.py
 */

import { mkdir, readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { parseArgs } from 'node:util';
import { deflateRawSync } from 'node:zlib';

import { ROOT_DIR } from 'hr-skills-ref/server';

/**
 * File entry to include in the generated ZIP archive.
 */
interface ZipEntry {
	/** Archive-relative path using forward slashes. */
	arcname: string;
	/** Uncompressed file contents. */
	data: Buffer;
	/** Last modification time. */
	mtime: Date;
}

/**
 * MS-DOS timestamp fields stored in ZIP file headers.
 *
 * ZIP stores modification times as two 16-bit values:
 * - `time`: hours, minutes, and seconds (2-second resolution)
 * - `date`: year (relative to 1980), month, and day
 */
interface DosTimestamp {
	/** Packed MS-DOS time field. */
	time: number;
	/** Packed MS-DOS date field. */
	date: number;
}

/** CRC-32 lookup table (polynomial 0xEDB88320, per the ZIP specification). */
let crc32Table: Uint32Array | undefined;

function makeCrc32Table(): Uint32Array {
	if (crc32Table) {
		return crc32Table;
	}

	const table = new Uint32Array(256);

	for (let i = 0; i < 256; i++) {
		let crc = i;

		for (let j = 0; j < 8; j++) {
			crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
		}

		table[i] = crc;
	}

	crc32Table = table;

	return table;
}

/**
 * Compute the CRC-32 checksum of a buffer.
 */
function crc32(buffer: Buffer): number {
	const table = makeCrc32Table();

	let crc = 0xffffffff;

	for (let i = 0; i < buffer.length; i++) {
		crc = (crc >>> 8) ^ (table[(crc ^ (buffer[i] ?? 0)) & 0xff] ?? 0);
	}

	return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Write a 16-bit unsigned integer in little-endian byte order.
 */
function writeUInt16LE(buffer: Buffer, value: number, offset: number): void {
	buffer[offset] = value & 0xff;
	buffer[offset + 1] = (value >>> 8) & 0xff;
}

/**
 * Write a 32-bit unsigned integer in little-endian byte order.
 */
function writeUInt32LE(buffer: Buffer, value: number, offset: number): void {
	buffer[offset] = value & 0xff;
	buffer[offset + 1] = (value >>> 8) & 0xff;
	buffer[offset + 2] = (value >>> 16) & 0xff;
	buffer[offset + 3] = (value >>> 24) & 0xff;
}

/**
 * Pack a JS Date into ZIP's MS-DOS date/time fields (local time, matching
 * Python's zipfile module, which derives these from `time.localtime(mtime)`).
 *
 * date = (year-1980 << 9) | (month << 5) | day
 * time = (hour << 11) | (minute << 5) | (second / 2)
 *
 * DOS format cannot represent years before 1980 or after 2107, and only
 * stores even seconds — dates outside that range are clamped to the
 * earliest representable value (1980-01-01 00:00:00) instead of wrapping
 * into another invalid bit pattern.
 */
function dateToDos(date: Date): DosTimestamp {
	const year = date.getFullYear();

	if (year < 1980 || year > 2107) {
		return {
			time: 0,
			date: 0x21,
		};
	}

	const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();

	const dosTime =
		(date.getHours() << 11) |
		(date.getMinutes() << 5) |
		Math.floor(date.getSeconds() / 2);

	return {
		time: dosTime,
		date: dosDate,
	};
}

/**
 * Assemble a ZIP archive from entries and return it as a Buffer.
 * Uses DEFLATE compression (method 8), matching Python's ZIP_DEFLATED.
 */
export function buildZipBuffer(entries: ZipEntry[]): Buffer {
	const localParts: Buffer[] = [];
	const centralDir: Buffer[] = [];
	// Running byte offset into the concatenated local-header section. Every
	// central-directory entry stores the offset of its own local header here,
	// and the EOCD stores the offset where the central directory itself begins,
	// so this must advance by each entry's on-disk size as we go.
	let currentOffset = 0;

	for (const entry of entries) {
		const nameBytes = Buffer.from(entry.arcname, 'utf8');
		const raw = entry.data;
		const compressed = deflateRawSync(raw, { level: 6 });
		const checksum = crc32(raw);
		const { time: dosTime, date: dosDate } = dateToDos(entry.mtime);
		const localHeaderOffset = currentOffset;

		// Local file header: 30 bytes + filename
		const local = Buffer.alloc(30 + nameBytes.length);
		writeUInt32LE(local, 0x04034b50, 0); // signature
		writeUInt16LE(local, 20, 4); // version needed (2.0)
		writeUInt16LE(local, 0, 6); // general purpose flags
		writeUInt16LE(local, 8, 8); // compression: deflate
		writeUInt16LE(local, dosTime, 10); // last mod time
		writeUInt16LE(local, dosDate, 12); // last mod date
		writeUInt32LE(local, checksum, 14); // CRC-32
		writeUInt32LE(local, compressed.length, 18); // compressed size
		writeUInt32LE(local, raw.length, 22); // uncompressed size
		writeUInt16LE(local, nameBytes.length, 26); // filename length
		writeUInt16LE(local, 0, 28); // extra field length
		nameBytes.copy(local, 30);

		localParts.push(local, compressed);
		currentOffset += local.length + compressed.length;

		// Central directory file header: 46 bytes + filename
		const central = Buffer.alloc(46 + nameBytes.length);
		writeUInt32LE(central, 0x02014b50, 0); // signature
		writeUInt16LE(central, 20, 4); // version made by
		writeUInt16LE(central, 20, 6); // version needed
		writeUInt16LE(central, 0, 8); // general purpose flags
		writeUInt16LE(central, 8, 10); // compression: deflate
		writeUInt16LE(central, dosTime, 12); // last mod time
		writeUInt16LE(central, dosDate, 14); // last mod date
		writeUInt32LE(central, checksum, 16); // CRC-32
		writeUInt32LE(central, compressed.length, 20); // compressed size
		writeUInt32LE(central, raw.length, 24); // uncompressed size
		writeUInt16LE(central, nameBytes.length, 28); // filename length
		writeUInt16LE(central, 0, 30); // extra field length
		writeUInt16LE(central, 0, 32); // file comment length
		writeUInt16LE(central, 0, 34); // disk number start
		writeUInt16LE(central, 0, 36); // internal attributes
		writeUInt32LE(central, 0, 38); // external attributes
		writeUInt32LE(central, localHeaderOffset, 42); // local header offset
		nameBytes.copy(central, 46);

		centralDir.push(central);
	}

	const centralBuf = Buffer.concat(centralDir);

	// End of central directory record: 22 bytes
	const eocd = Buffer.alloc(22);
	writeUInt32LE(eocd, 0x06054b50, 0); // signature
	writeUInt16LE(eocd, 0, 4); // disk number
	writeUInt16LE(eocd, 0, 6); // disk with central dir
	writeUInt16LE(eocd, entries.length, 8); // entries on this disk
	writeUInt16LE(eocd, entries.length, 10); // total entries
	writeUInt32LE(eocd, centralBuf.length, 12); // central dir size
	writeUInt32LE(eocd, currentOffset, 16); // central dir offset
	writeUInt16LE(eocd, 0, 20); // comment length

	return Buffer.concat([...localParts, centralBuf, eocd]);
}

// ---------------------------------------------------------------------------
// File collection helpers (mirrors Python build_skill.py)
// ---------------------------------------------------------------------------

async function loadDistignore(repoRoot: string): Promise<string[]> {
	const file = Bun.file(join(repoRoot, '.distignore'));

	if (!(await file.exists())) {
		return [];
	}

	const text = await file.text();

	return text
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.length > 0 && !line.startsWith('#'));
}

function isIgnored(rel: string, patterns: string[]): boolean {
	return patterns.some((pattern) => {
		const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
		return new RegExp(`^${escaped}$`).test(rel);
	});
}

async function walkFiles(dir: string): Promise<string[]> {
	const results: string[] = [];
	const entries = await readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...(await walkFiles(full)));
		} else if (entry.isFile()) {
			results.push(full);
		}
	}
	return results;
}

/**
 * Core knowledge files shared by both archive formats.
 * Includes SKILL.md, LICENSE, docs/product/USER.md, and the full skills/ tree.
 */
async function iterInputs(repoRoot: string): Promise<string[]> {
	const paths: string[] = [];

	for (const name of ['LICENSE', 'SKILL.md']) {
		const candidate = join(repoRoot, name);

		if (await Bun.file(candidate).exists()) {
			paths.push(candidate);
		}
	}

	const usageGuide = join(repoRoot, 'docs', 'product', 'USER.md');

	if (await Bun.file(usageGuide).exists()) {
		paths.push(usageGuide);
	}

	const skillsDir = join(repoRoot, 'skills');

	try {
		if ((await stat(skillsDir)).isDirectory()) {
			paths.push(...(await walkFiles(skillsDir)));
		}
	} catch {
		// skills/ does not exist
	}

	return [...new Set(paths)].sort();
}

/**
 * .claude-plugin files — included only in the .skill archive.
 * Only .json manifests (e.g. marketplace.json) are shipped; documentation
 * files such as README.md are internal-repo-only and excluded here.
 */
async function iterClaudePluginInputs(repoRoot: string): Promise<string[]> {
	const base = join(repoRoot, '.claude-plugin');

	try {
		if (!(await stat(base)).isDirectory()) {
			return [];
		}
	} catch {
		return [];
	}

	const all = await walkFiles(base);

	return all.filter((path) => path.endsWith('.json')).sort();
}

// ---------------------------------------------------------------------------
// Archive builder
// ---------------------------------------------------------------------------

async function buildArchive(
	repoRoot: string,
	outputName: string,
	label: string,
	opts: { includeClaudePlugin: boolean },
): Promise<string> {
	const outDir = join(repoRoot, 'dist');
	await mkdir(outDir, { recursive: true });
	const outPath = join(outDir, outputName);

	const patterns = await loadDistignore(repoRoot);
	let inputs = await iterInputs(repoRoot);

	if (opts.includeClaudePlugin) {
		const pluginFiles = await iterClaudePluginInputs(repoRoot);
		inputs = [...new Set([...inputs, ...pluginFiles])].sort();
	}

	try {
		await Bun.file(outPath).delete();
	} catch {
		// Output file does not exist.
	}

	const entries: ZipEntry[] = [];
	for (const absPath of inputs) {
		const rel = relative(repoRoot, absPath).replace(/\\/g, '/');
		if (isIgnored(rel, patterns)) continue;
		const data = await readFile(absPath);
		const { mtime } = await stat(absPath);
		entries.push({ arcname: rel, data, mtime });
	}

	const buf = buildZipBuffer(entries);
	await Bun.write(outPath, buf);

	const { size } = await stat(outPath);
	const sizeKb = Math.floor(size / 1024);
	console.log(`OK (${label}): ${outPath}  (~${sizeKb}KB, ${entries.length} files)`);
	return outPath;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Packages the repo's distributable skill files into `dist/hr-skills.zip`
 * (respects `.distignore`, excludes the Claude plugin manifest).
 *
 * @param repoRoot - Absolute path to the repository root.
 * @returns Absolute path to the written zip archive.
 */
export async function buildZip(repoRoot: string): Promise<string> {
	return buildArchive(repoRoot, 'hr-skills.zip', 'zip', {
		includeClaudePlugin: false,
	});
}

/**
 * Packages the repo into `dist/hr-skills.skill`, a Claude Code plugin bundle
 * that additionally includes the Claude plugin manifest and command files.
 *
 * @param repoRoot - Absolute path to the repository root.
 * @returns Absolute path to the written `.skill` archive.
 */
export async function buildSkill(repoRoot: string): Promise<string> {
	return buildArchive(repoRoot, 'hr-skills.skill', 'skill', {
		includeClaudePlugin: true,
	});
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

if (import.meta.main) {
	// Kept inside the `import.meta.main` guard: `strict: true` over `Bun.argv`
	// means running this at module scope makes a plain `import` of this file
	// parse the *host* process's flags and throw on any it doesn't know.
	const {
		values: { zip, skill },
	} = parseArgs({
		args: Bun.argv,
		options: {
			zip: {
				type: 'boolean',
			},
			skill: {
				type: 'boolean',
			},
		},
		strict: true,
		allowPositionals: true,
	});

	if (zip && skill) {
		throw new Error('Cannot specify both --zip and --skill.');
	}

	if (zip) {
		console.log('Building HR Skills distribution (.zip)...');
		await buildZip(ROOT_DIR);
	} else if (skill) {
		console.log('Building HR Skills distribution (.skill)...');
		await buildSkill(ROOT_DIR);
	} else {
		console.log('Building HR Skills distribution (.zip + .skill)...');

		await Promise.all([buildZip(ROOT_DIR), buildSkill(ROOT_DIR)]);
	}
}
