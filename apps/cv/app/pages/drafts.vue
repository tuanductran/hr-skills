<script setup lang="ts">
import type { CvDraftEnvelope } from 'hr-cv';
import { useCvPersistence } from '~/composables/useCvPersistence';

useSeoMeta({ title: 'My CVs — CV Studio', description: 'Manage private CV drafts stored on this device.' });
const persistence = useCvPersistence();
const drafts = ref<CvDraftEnvelope[]>([]);
const search = ref('');
const includeArchived = ref(false);
const loading = ref(true);
const importError = ref<string | null>(null);
const importSummary = ref<string | null>(null);
const pendingDelete = ref<CvDraftEnvelope | null>(null);
const deleteDialogOpen = computed({ get: () => Boolean(pendingDelete.value), set: (open) => { if (!open) pendingDelete.value = null; } });
const fileInput = ref<HTMLInputElement | null>(null);
function openImport() { fileInput.value?.click(); }
let unsubscribe: (() => void) | undefined;
let loadRequest = 0;

async function loadDrafts() {
  const request = ++loadRequest;
  loading.value = true;
  const result = await persistence.list({ q: search.value, includeArchived: includeArchived.value });
  if (request !== loadRequest) return;
  drafts.value = result;
  loading.value = false;
}
async function exportBackup() {
  const records = await persistence.exportAll();
  if (!records.length) return;
  const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), drafts: records }, null, 2)], { type: 'application/json' });
  const anchor = document.createElement('a'); anchor.href = URL.createObjectURL(blob); anchor.download = 'cv-studio-backup.json'; anchor.click(); URL.revokeObjectURL(anchor.href);
}
async function importBackup(event: Event) {
  importError.value = null; importSummary.value = null;
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const imported = await persistence.importDrafts(parsed.drafts ?? parsed);
    importSummary.value = imported.length ? `Imported ${imported.length} CV${imported.length === 1 ? '' : 's'} as new drafts.` : 'No valid CV drafts were found in this file.';
    await loadDrafts();
  } catch (error) {
    importError.value = persistence.persistenceError.value ?? (error instanceof SyntaxError ? 'The selected file is not valid JSON.' : 'The backup could not be imported.');
  }
  (event.target as HTMLInputElement).value = '';
}
async function archive(draft: CvDraftEnvelope) { await persistence.archive(draft.id); await loadDrafts(); }
async function restore(draft: CvDraftEnvelope) { await persistence.restore(draft.id); await loadDrafts(); }
async function duplicate(draft: CvDraftEnvelope) { await persistence.duplicate(draft.id); await loadDrafts(); }
async function deletePermanently() { if (pendingDelete.value) await persistence.remove(pendingDelete.value.id); pendingDelete.value = null; await loadDrafts(); }
async function refresh() { await loadDrafts(); }
watch([search, includeArchived], refresh);
onMounted(async () => { await loadDrafts(); unsubscribe = persistence.subscribe(refresh); });
onBeforeUnmount(() => unsubscribe?.());
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <header class="border-b border-default bg-default/95"><UContainer class="flex min-h-16 items-center justify-between gap-4"><NuxtLink to="/" class="flex items-center gap-3" aria-label="CV Studio home"><span class="grid size-9 place-items-center rounded-lg bg-primary font-semibold text-inverted">CV</span><span class="font-semibold">CV Studio</span></NuxtLink><div class="flex items-center gap-2"><input ref="fileInput" id="backup-file" class="sr-only" type="file" accept="application/json,.json" aria-label="Choose CV backup file" @change="importBackup"><UButton color="neutral" variant="outline" icon="i-lucide-upload" aria-label="Import CV backup" @click="openImport"><span class="hidden sm:inline">Import</span></UButton><UButton color="neutral" variant="outline" icon="i-lucide-download" aria-label="Export CV backup" :disabled="!drafts.length" @click="exportBackup"><span class="hidden sm:inline">Export backup</span></UButton><UButton to="/?new=1" color="primary" icon="i-lucide-plus">New CV</UButton></div></UContainer></header>
    <main><UContainer class="py-10"><div class="max-w-3xl"><UBadge color="primary" variant="subtle">This device</UBadge><h1 class="mt-4 text-3xl font-semibold tracking-tight text-highlighted sm:text-5xl">Keep every version of your story close.</h1><p class="mt-4 text-muted">CVs stay private in this browser. Export a backup before moving to another device.</p></div><UAlert v-if="importSummary" class="mt-6" color="success" variant="subtle" title="Workspace updated" :description="importSummary" /><UAlert v-if="importError" class="mt-6" color="error" variant="subtle" title="Import failed" :description="importError" /><div class="mt-8 flex flex-col gap-3 sm:flex-row"><UInput v-model="search" class="flex-1" icon="i-lucide-search" placeholder="Search by name or headline" aria-label="Search CVs" /><UCheckbox v-model="includeArchived" label="Include archived" /></div><div v-if="loading" class="mt-8 grid gap-4 sm:grid-cols-2"><USkeleton v-for="i in 4" :key="i" class="h-48 rounded-lg" /></div><div v-else-if="drafts.length" class="mt-8 grid gap-4 sm:grid-cols-2"><UCard v-for="draft in drafts" :key="draft.id" variant="subtle"><template #header><div class="flex items-start justify-between gap-3"><div><h2 class="font-semibold text-highlighted">{{ draft.title }}</h2><p class="mt-1 text-xs text-muted">Updated {{ new Date(draft.updatedAt).toLocaleDateString() }}</p></div><UBadge :color="draft.archivedAt ? 'neutral' : 'primary'" variant="subtle">{{ draft.archivedAt ? 'Archived' : draft.status === 'ready_for_review' ? 'Ready' : 'Draft' }}</UBadge></div></template><p class="line-clamp-3 text-sm text-muted">{{ draft.data.headline }}. {{ draft.data.summary }}</p><div class="mt-5 flex flex-wrap gap-2"><UButton :to="`/?id=${draft.id}`" size="sm">Open</UButton><UButton size="sm" color="neutral" variant="outline" @click="duplicate(draft)">Duplicate</UButton><UButton v-if="!draft.archivedAt" size="sm" color="neutral" variant="ghost" @click="archive(draft)">Archive</UButton><UButton v-else size="sm" color="neutral" variant="ghost" @click="restore(draft)">Restore</UButton><UButton size="sm" color="error" variant="ghost" @click="pendingDelete = draft">Delete</UButton></div></UCard></div><UCard v-else class="mt-8" variant="subtle"><div class="py-10 text-center"><UIcon name="i-lucide-file-user" class="mx-auto size-10 text-dimmed" /><h2 class="mt-4 text-xl font-semibold text-highlighted">No CVs found</h2><p class="mt-2 text-muted">Create your first CV and it will appear here automatically.</p><UButton to="/?new=1" class="mt-5">Create a CV</UButton></div></UCard></UContainer></main>
    <UModal v-model:open="deleteDialogOpen"><template #content><UCard><template #header><h2 class="text-lg font-semibold text-highlighted">Delete this CV permanently?</h2></template><p class="text-muted">This removes the local draft from IndexedDB and cannot be undone.</p><div class="mt-6 flex justify-end gap-2"><UButton color="neutral" variant="outline" @click="pendingDelete = null">Cancel</UButton><UButton color="error" @click="deletePermanently">Delete permanently</UButton></div></UCard></template></UModal>
  </div>
</template>
