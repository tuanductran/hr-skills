/**
 * Build distribution artifacts for HR Skills.
 *
 * Flags
 * -----
 * default   Build dist/hr-skills.zip   (when no flag is given)
 * --skill   Build dist/hr-skills.skill
 *
 * Examples
 * --------
 * bun run build-skills                  # zip build
 * bun run build-skills -- --skill       # .skill build
 *
 * Formats
 * -------
 * hr-skills.zip
 *     Standard distribution zip for manual extraction and document-based tools.
 *     Includes root SKILL.md, LICENSE, docs/usage-guide.md, and the full
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

import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, stat, unlink } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { deflateRawSync } from 'node:zlib';

import { ROOT_DIR } from '../shared/constants.js';

// ---------------------------------------------------------------------------
// Minimal ZIP writer — no external deps, uses Node built-in zlib
// ---------------------------------------------------------------------------

interface ZipEntry {
	arcname: string;
	data: Buffer;
	mtime: Date;
}

/** CRC-32 table (polynomial 0xEDB88320, as required by the ZIP spec). */
let _crc32Table: Uint32Array | null = null;

function makeCrc32Table(): Uint32Array {
	if (_crc32Table) return _crc32Table;
	const table = new Uint32Array(256);
	for (let i = 0; i < 256; i++) {
		let c = i;
		for (let j = 0; j < 8; j++) {
			c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		}
		table[i] = c;
	}
	_crc32Table = table;
	return table;
}

function crc32(buf: Buffer): number {
	const table = makeCrc32Table();
	let crc = 0xffffffff;
	for (let i = 0; i < buf.length; i++) {
		crc = (crc >>> 8) ^ (table[(crc ^ (buf[i] ?? 0)) & 0xff] ?? 0);
	}
	return (crc ^ 0xffffffff) >>> 0;
}

function writeUInt16LE(buf: Buffer, value: number, offset: number): void {
	buf[offset] = value & 0xff;
	buf[offset + 1] = (value >>> 8) & 0xff;
}

function writeUInt32LE(buf: Buffer, value: number, offset: number): void {
	buf[offset] = value & 0xff;
	buf[offset + 1] = (value >>> 8) & 0xff;
	buf[offset + 2] = (value >>> 16) & 0xff;
	buf[offset + 3] = (value >>> 24) & 0xff;
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
function dateToDos(date: Date): { time: number; date: number } {
	const year = date.getFullYear();

	if (year < 1980 || year > 2107) {
		return { time: 0, date: 0x21 };
	}

	const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
	const dosTime =
		(date.getHours() << 11) |
		(date.getMinutes() << 5) |
		Math.floor(date.getSeconds() / 2);

	return { time: dosTime, date: dosDate };
}

/**
 * Assemble a ZIP archive from entries and return it as a Buffer.
 * Uses DEFLATE compression (method 8), matching Python's ZIP_DEFLATED.
 */
function buildZipBuffer(entries: ZipEntry[]): Buffer {
	const localParts: Buffer[] = [];
	const centralDir: Buffer[] = [];
	const offsets: number[] = [];
	let currentOffset = 0;

	for (const entry of entries) {
		const nameBytes = Buffer.from(entry.arcname, 'utf8');
		const raw = entry.data;
		const compressed = deflateRawSync(raw, { level: 6 });
		const checksum = crc32(raw);
		const { time: dosTime, date: dosDate } = dateToDos(entry.mtime);

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

		offsets.push(currentOffset);
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
		writeUInt32LE(central, offsets[offsets.length - 1] ?? 0, 42); // local header offset
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
	const path = join(repoRoot, '.distignore');
	if (!existsSync(path)) return [];
	const text = await readFile(path, 'utf8');
	return text
		.split('\n')
		.map((l) => l.trim())
		.filter((l) => l.length > 0 && !l.startsWith('#'));
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
 * Includes SKILL.md, LICENSE, docs/usage-guide.md, and the full skills/ tree.
 */
async function iterInputs(repoRoot: string): Promise<string[]> {
	const paths: string[] = [];

	for (const name of ['LICENSE', 'SKILL.md']) {
		const candidate = join(repoRoot, name);
		if (existsSync(candidate)) paths.push(candidate);
	}

	const usageGuide = join(repoRoot, 'docs', 'usage-guide.md');
	if (existsSync(usageGuide)) paths.push(usageGuide);

	const skillsDir = join(repoRoot, 'skills');
	if (existsSync(skillsDir)) {
		paths.push(...(await walkFiles(skillsDir)));
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
	if (!existsSync(base)) return [];
	const all = await walkFiles(base);
	return all.filter((p) => p.endsWith('.json')).sort();
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

	if (existsSync(outPath)) await unlink(outPath);

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

export async function buildZip(repoRoot: string): Promise<string> {
	return buildArchive(repoRoot, 'hr-skills.zip', 'zip', {
		includeClaudePlugin: false,
	});
}

export async function buildSkill(repoRoot: string): Promise<string> {
	return buildArchive(repoRoot, 'hr-skills.skill', 'skill', {
		includeClaudePlugin: true,
	});
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

if (import.meta.main) {
	const isSkill = process.argv.includes('--skill');
	console.log(`Building HR Skills distribution (${isSkill ? '.skill' : 'zip'})...`);

	if (isSkill) {
		await buildSkill(ROOT_DIR);
	} else {
		await buildZip(ROOT_DIR);
	}
}
