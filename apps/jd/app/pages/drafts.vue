<script setup lang="ts">
import type { JdDraftEnvelope } from "hr-jd";

useSeoMeta({
	title: "My drafts — JD Studio",
	description:
		"Find, resume and manage your job description drafts stored on this device.",
});

const persistence = useJdPersistence();
const search = ref("");
const status = ref<
	"all" | "draft" | "ready_for_review" | "approved" | "published"
>("all");
const includeArchived = ref(false);
const drafts = ref<JdDraftEnvelope[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const importInput = ref<HTMLInputElement | null>(null);
const showDeleteDialog = ref(false);
const pendingDelete = ref<JdDraftEnvelope | null>(null);
const importSummary = ref<string | null>(null);
const statusItems = [
	{ label: "All statuses", value: "all" },
	{ label: "Draft", value: "draft" },
	{ label: "Ready for review", value: "ready_for_review" },
	{ label: "Approved", value: "approved" },
	{ label: "Published locally", value: "published" },
];

const statusLabel = (value: JdDraftEnvelope["status"]) =>
value === "ready_for_review"
			? "Ready for review"
			: value === "published"
				? "Published locally"
				: value.charAt(0).toUpperCase() + value.slice(1);

function formatDate(value: string) {
	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(value));
}

function downloadFile(content: string, type: string, filename: string) {
	const url = URL.createObjectURL(new Blob([content], { type }));
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

async function loadDrafts() {
	loading.value = true;
	error.value = null;
	drafts.value = await persistence.list({
		q: search.value,
		status: status.value,
		includeArchived: includeArchived.value,
	});
	if (persistence.persistenceError.value)
		error.value = persistence.persistenceError.value;
	loading.value = false;
}

async function exportAll() {
	const allDrafts = await persistence.exportAll();
	if (!allDrafts.length) return;
	downloadFile(
		JSON.stringify(allDrafts, null, 2),
		"application/json",
		"hr-skills-jd-backup.json",
	);
}

function openImport() {
	importInput.value?.click();
}

async function importBackup(event: Event) {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];
	if (!file) return;
	error.value = null;
	try {
		const imported = await persistence.importDrafts(
			JSON.parse(await file.text()),
		);
		if (!imported.length) throw new Error("No valid drafts found");
		importSummary.value = `${imported.length} draft${imported.length === 1 ? "" : "s"} imported as new local ${imported.length === 1 ? "copy" : "copies"}.`;
		await loadDrafts();
	} catch {
		error.value =
			persistence.persistenceError.value ??
			"The backup file is invalid or contains no supported drafts.";
	} finally {
		input.value = "";
	}
}

async function archiveDraft(draft: JdDraftEnvelope) {
	if (await persistence.archive(draft.id)) await loadDrafts();
}

async function restoreDraft(draft: JdDraftEnvelope) {
	if (await persistence.restore(draft.id)) await loadDrafts();
}

async function duplicateDraft(draft: JdDraftEnvelope) {
	const duplicate = await persistence.duplicate(draft.id);
	if (duplicate) {
		importSummary.value = "A local copy was created.";
		await loadDrafts();
	}
}

function requestDelete(draft: JdDraftEnvelope) {
	pendingDelete.value = draft;
	showDeleteDialog.value = true;
}

async function confirmDelete() {
	if (!pendingDelete.value) return;
	const deleted = await persistence.remove(pendingDelete.value.id);
	showDeleteDialog.value = false;
	if (deleted) {
		importSummary.value = "Draft permanently deleted from this browser.";
		await loadDrafts();
	}
	pendingDelete.value = null;
}

watch([search, status, includeArchived], loadDrafts);
let unsubscribe: (() => void) | undefined;
onMounted(() => {
	loadDrafts();
	unsubscribe = persistence.subscribe(loadDrafts);
});
onBeforeUnmount(() => unsubscribe?.());
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <header class="border-b border-default bg-default/95 backdrop-blur">
      <UContainer class="flex min-h-16 items-center py-3">
        <NuxtLink to="/" class="rounded-md focus-visible:outline-2 focus-visible:outline-primary" aria-label="JD Studio home">
          <UBadge color="primary" variant="solid" size="lg">JD</UBadge>
        </NuxtLink>
      </UContainer>
    </header>

    <main>
      <UContainer class="py-8 sm:py-10 lg:py-14">
        <div class="mb-8 max-w-2xl">
          <UBadge color="primary" variant="subtle">This device</UBadge>
          <h1 class="mt-4 text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl">Resume the work that matters.</h1>
          <p class="mt-3 text-base leading-7 text-muted">Drafts are stored privately in this browser. Export a backup before moving to another device.</p>
          <UCard class="mt-6 no-print" :ui="{ body: 'p-3 sm:p-4' }">
            <div class="flex flex-wrap items-center gap-2">
              <UButton to="/" color="neutral" variant="soft" icon="i-lucide-arrow-left">Open editor</UButton>
              <UButton color="neutral" variant="soft" icon="i-lucide-upload" @click="openImport">Import backup</UButton>
              <UButton color="neutral" variant="soft" icon="i-lucide-download" :disabled="!drafts.length" @click="exportAll">Export backup</UButton>
              <UButton to="/?new=1" color="primary" icon="i-lucide-plus" @click="persistence.resetCurrent">New draft</UButton>
              <input ref="importInput" type="file" accept="application/json,.json" aria-label="Choose backup file" class="sr-only" @change="importBackup">
            </div>
          </UCard>
        </div>

        <UCard class="mb-6" :ui="{ body: 'p-4 sm:p-5' }">
          <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_14rem_auto] md:items-end">
            <UFormField label="Search by title"><UInput v-model="search" icon="i-lucide-search" placeholder="Search job descriptions" class="w-full" @keyup.enter="loadDrafts" /></UFormField>
            <UFormField label="Status"><USelect v-model="status" :items="statusItems" value-key="value" class="w-full" /></UFormField>
            <UCheckbox v-model="includeArchived" label="Include archived" />
          </div>
        </UCard>

        <UAlert v-if="importSummary" color="primary" variant="outline" icon="i-lucide-check-circle-2" title="Workspace updated" class="mb-6" :close="true" @close="importSummary = null">{{ importSummary }}</UAlert>
        <UAlert v-if="error" color="error" variant="subtle" icon="i-lucide-circle-alert" :title="error" class="mb-6" />

        <div v-if="loading" class="grid gap-4 md:grid-cols-2" aria-label="Loading drafts">
          <USkeleton v-for="index in 4" :key="index" class="h-44 rounded-lg" />
        </div>
        <UCard v-else-if="drafts.length === 0" class="border-dashed text-center">
          <div class="flex flex-col items-center p-8 sm:p-12">
            <UIcon name="i-lucide-file-plus-2" class="size-8 text-primary" />
            <h2 class="mt-4 text-lg font-semibold text-highlighted">No drafts found</h2>
            <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">Create your first structured job description and it will appear here automatically.</p>
            <UButton to="/?new=1" color="primary" class="mt-5" @click="persistence.resetCurrent()">Create a draft</UButton>
          </div>
        </UCard>
        <div v-else class="grid gap-4 md:grid-cols-2">
          <UCard v-for="draft in drafts" :key="draft.id">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0"><h2 class="truncate text-lg font-semibold text-highlighted">{{ draft.title || 'Untitled role' }}</h2><p class="mt-1 text-sm text-muted">Updated {{ formatDate(draft.updatedAt) }}</p></div>
              <UBadge :color="draft.archivedAt ? 'neutral' : 'primary'" variant="soft" class="shrink-0">{{ draft.archivedAt ? 'Archived' : statusLabel(draft.status) }}</UBadge>
            </div>
            <p class="mt-5 line-clamp-2 text-sm leading-6 text-toned">{{ draft.data.summary }}</p>
            <p v-if="draft.status === 'published'" class="mt-3 text-xs leading-5 text-muted">Published locally in this browser; no public URL or network publishing is created.</p>
            <div class="mt-5 flex flex-wrap items-center gap-2">
              <UButton v-if="!draft.archivedAt" :to="{ path: '/', query: { id: draft.id } }" color="primary" variant="soft" size="sm">Open draft</UButton>
              <UButton v-if="!draft.archivedAt" color="neutral" variant="ghost" size="sm" icon="i-lucide-copy" @click="duplicateDraft(draft)">Duplicate</UButton>
              <UButton v-if="!draft.archivedAt" color="neutral" variant="ghost" size="sm" @click="archiveDraft(draft)">Archive</UButton>
              <UButton v-if="draft.archivedAt" color="primary" variant="soft" size="sm" @click="restoreDraft(draft)">Restore</UButton>
              <UButton color="error" variant="ghost" size="sm" icon="i-lucide-trash-2" @click="requestDelete(draft)">Delete</UButton>
            </div>
          </UCard>
        </div>
      </UContainer>
    </main>

    <UModal v-model:open="showDeleteDialog" title="Delete this draft?" description="This removes the draft permanently from this browser. Export a backup first if you may need it later.">
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="showDeleteDialog = false">Cancel</UButton>
          <UButton color="error" @click="confirmDelete">Delete permanently</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
