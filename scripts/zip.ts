import { readdir, rm, stat } from 'node:fs/promises';
import { basename, join } from 'node:path';

const SKILLS_DIR = join(import.meta.dir, '../skills');
const DOS_EPOCH_DATE = 0x0021;
const DOS_EPOCH_TIME = 0;

const CRC32_TABLE = new Uint32Array(256);

for (let index = 0; index < CRC32_TABLE.length; index += 1) {
	let crc = index;

	for (let bit = 0; bit < 8; bit += 1) {
		crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
	}

	CRC32_TABLE[index] = crc >>> 0;
}

interface ZipEntry {
	path: string;
	data: Uint8Array;
	crc32: number;
	localHeaderOffset: number;
}

function crc32(data: Uint8Array): number {
	let crc = 0xffffffff;

	for (const byte of data) {
		crc = CRC32_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
	}

	return (crc ^ 0xffffffff) >>> 0;
}

function writeUint16(buffer: Uint8Array, offset: number, value: number): void {
	buffer[offset] = value & 0xff;
	buffer[offset + 1] = (value >>> 8) & 0xff;
}

function writeUint32(buffer: Uint8Array, offset: number, value: number): void {
	buffer[offset] = value & 0xff;
	buffer[offset + 1] = (value >>> 8) & 0xff;
	buffer[offset + 2] = (value >>> 16) & 0xff;
	buffer[offset + 3] = (value >>> 24) & 0xff;
}

function concat(chunks: Uint8Array[]): Uint8Array {
	const size = chunks.reduce((total, chunk) => total + chunk.length, 0);
	const output = new Uint8Array(size);
	let offset = 0;

	for (const chunk of chunks) {
		output.set(chunk, offset);
		offset += chunk.length;
	}

	return output;
}

function createLocalHeader(entry: ZipEntry): Uint8Array {
	const pathBytes = new TextEncoder().encode(entry.path);
	const header = new Uint8Array(30 + pathBytes.length);

	writeUint32(header, 0, 0x04034b50);
	writeUint16(header, 4, 20);
	writeUint16(header, 6, 0x0800);
	writeUint16(header, 8, 0);
	writeUint16(header, 10, DOS_EPOCH_TIME);
	writeUint16(header, 12, DOS_EPOCH_DATE);
	writeUint32(header, 14, entry.crc32);
	writeUint32(header, 18, entry.data.length);
	writeUint32(header, 22, entry.data.length);
	writeUint16(header, 26, pathBytes.length);
	writeUint16(header, 28, 0);
	header.set(pathBytes, 30);

	return header;
}

function createCentralDirectoryHeader(entry: ZipEntry): Uint8Array {
	const pathBytes = new TextEncoder().encode(entry.path);
	const header = new Uint8Array(46 + pathBytes.length);

	writeUint32(header, 0, 0x02014b50);
	writeUint16(header, 4, 20);
	writeUint16(header, 6, 20);
	writeUint16(header, 8, 0x0800);
	writeUint16(header, 10, 0);
	writeUint16(header, 12, DOS_EPOCH_TIME);
	writeUint16(header, 14, DOS_EPOCH_DATE);
	writeUint32(header, 16, entry.crc32);
	writeUint32(header, 20, entry.data.length);
	writeUint32(header, 24, entry.data.length);
	writeUint16(header, 28, pathBytes.length);
	writeUint16(header, 30, 0);
	writeUint16(header, 32, 0);
	writeUint16(header, 34, 0);
	writeUint16(header, 36, 0);
	writeUint32(header, 38, 0);
	writeUint32(header, 42, entry.localHeaderOffset);
	header.set(pathBytes, 46);

	return header;
}

function createEndOfCentralDirectory(
	entryCount: number,
	centralDirectorySize: number,
	centralDirectoryOffset: number,
): Uint8Array {
	const header = new Uint8Array(22);

	writeUint32(header, 0, 0x06054b50);
	writeUint16(header, 4, 0);
	writeUint16(header, 6, 0);
	writeUint16(header, 8, entryCount);
	writeUint16(header, 10, entryCount);
	writeUint32(header, 12, centralDirectorySize);
	writeUint32(header, 16, centralDirectoryOffset);
	writeUint16(header, 20, 0);

	return header;
}

async function removeExistingZipFiles(): Promise<void> {
	const entries = await readdir(SKILLS_DIR);

	await Promise.all(
		entries
			.filter((entry) => entry.endsWith('.zip'))
			.map((entry) => rm(join(SKILLS_DIR, entry), { force: true })),
	);
}

async function getSkillDirectories(): Promise<string[]> {
	const entries = await readdir(SKILLS_DIR);
	const directories: string[] = [];

	for (const entry of entries) {
		const fullPath = join(SKILLS_DIR, entry);
		const entryStat = await stat(fullPath);

		if (entryStat.isDirectory()) {
			directories.push(entry);
		}
	}

	return directories.sort();
}

async function createZipArchive(skillName: string): Promise<Uint8Array> {
	const skillPath = join(SKILLS_DIR, skillName, 'SKILL.md');
	const content = await Bun.file(skillPath).bytes();
	const entries: ZipEntry[] = [
		{
			path: `${skillName}/SKILL.md`,
			data: content,
			crc32: crc32(content),
			localHeaderOffset: 0,
		},
	];
	const localChunks: Uint8Array[] = [];
	let offset = 0;

	for (const entry of entries) {
		entry.localHeaderOffset = offset;
		const header = createLocalHeader(entry);
		localChunks.push(header, entry.data);
		offset += header.length + entry.data.length;
	}

	const centralDirectoryOffset = offset;
	const centralChunks = entries.map(createCentralDirectoryHeader);
	const centralDirectory = concat(centralChunks);
	const endOfCentralDirectory = createEndOfCentralDirectory(
		entries.length,
		centralDirectory.length,
		centralDirectoryOffset,
	);

	return concat([...localChunks, centralDirectory, endOfCentralDirectory]);
}

async function zipSkillDirectory(skillName: string): Promise<void> {
	const zipFileName = `${skillName}.zip`;
	const archive = await createZipArchive(skillName);

	await Bun.write(join(SKILLS_DIR, zipFileName), archive);

	console.log(`Created ${zipFileName}`);
}

async function main(): Promise<void> {
	console.log('Generating skill zip packages...');

	await removeExistingZipFiles();

	const skills = await getSkillDirectories();

	for (const skill of skills) {
		await zipSkillDirectory(basename(skill));
	}

	console.log(`Generated ${skills.length} zip packages`);
}

await main();
