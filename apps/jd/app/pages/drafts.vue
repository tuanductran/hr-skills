<script setup lang="ts">
import type { JdDraftEnvelope } from 'hr-jd'

useSeoMeta({
  title: 'My drafts — JD Studio',
  description: 'Find, resume and manage your job description drafts stored on this device.',
})

const persistence = useJdPersistence()
const search = ref('')
const status = ref<'all' | 'draft' | 'ready_for_review' | 'published'>('all')
const includeArchived = ref(false)
const drafts = ref<JdDraftEnvelope[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const importInput = ref<HTMLInputElement | null>(null)
const statusItems = [
  { label: 'All statuses', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Ready for review', value: 'ready_for_review' },
  { label: 'Published', value: 'published' },
]

const statusLabel = (value: JdDraftEnvelope['status']) =>
  value === 'ready_for_review' ? 'Ready for review' : value.charAt(0).toUpperCase() + value.slice(1)

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function downloadFile(content: string, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

async function loadDrafts() {
  loading.value = true
  error.value = null
  drafts.value = await persistence.list({ q: search.value, status: status.value, includeArchived: includeArchived.value })
  if (persistence.persistenceError.value) error.value = persistence.persistenceError.value
  loading.value = false
}

function exportAll() {
  downloadFile(JSON.stringify(drafts.value, null, 2), 'application/json', 'hr-skills-jd-backup.json')
}

function openImport() {
  importInput.value?.click()
}

async function importBackup(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const imported = await persistence.importDrafts(JSON.parse(await file.text()))
    if (!imported.length) throw new Error('No valid drafts found')
    await loadDrafts()
  } catch {
    error.value = 'The backup file is invalid or contains no supported drafts.'
  } finally {
    input.value = ''
  }
}

async function archiveDraft(draft: JdDraftEnvelope) {
  if (!window.confirm(`Archive “${draft.title}”?`)) return
  if (await persistence.archive(draft.id)) await loadDrafts()
}

async function restoreDraft(draft: JdDraftEnvelope) {
  if (await persistence.restore(draft.id)) await loadDrafts()
}

watch([search, status, includeArchived], loadDrafts)
onMounted(loadDrafts)
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-950">
    <header class="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">JD Studio</p>
          <h1 class="mt-1 text-xl font-semibold tracking-tight">My drafts</h1>
        </div>
        <div class="flex items-center gap-2">
          <NuxtLink to="/" class="text-sm font-medium text-slate-600 hover:text-blue-700">Open editor</NuxtLink>
          <UButton color="neutral" variant="soft" icon="i-lucide-upload" @click="openImport">Import backup</UButton>
          <UButton color="neutral" variant="soft" icon="i-lucide-download" :disabled="!drafts.length" @click="exportAll">Export backup</UButton>
          <UButton to="/" color="primary" icon="i-lucide-plus">New draft</UButton>
          <input ref="importInput" type="file" accept="application/json,.json" class="sr-only" @change="importBackup">
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
      <div class="mb-8 max-w-2xl">
        <p class="text-sm font-semibold text-blue-700">This device</p>
        <h2 class="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Resume the work that matters.</h2>
        <p class="mt-3 text-base leading-7 text-slate-600">Drafts are stored privately in this browser. Export a backup before moving to another device.</p>
      </div>

      <section class="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-label="Draft filters">
        <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-end">
          <UFormField label="Search by title">
            <UInput v-model="search" icon="i-lucide-search" placeholder="Search job descriptions" class="w-full" @keyup.enter="loadDrafts" />
          </UFormField>
          <UFormField label="Status">
            <USelect v-model="status" :items="statusItems" value-key="value" class="w-full" />
          </UFormField>
          <UCheckbox v-model="includeArchived" label="Include archived" />
        </div>
      </section>

      <UAlert v-if="error" color="error" variant="soft" :title="error" class="mb-6" />

      <div v-if="loading" class="grid gap-4 md:grid-cols-2">
        <USkeleton v-for="index in 4" :key="index" class="h-44 rounded-3xl" />
      </div>
      <div v-else-if="drafts.length === 0" class="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <UIcon name="i-lucide-file-plus-2" class="mx-auto size-8 text-blue-600" />
        <h3 class="mt-4 text-lg font-semibold">No drafts found</h3>
        <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Create your first structured job description and it will appear here automatically.</p>
        <UButton to="/" color="primary" class="mt-5">Create a draft</UButton>
      </div>
      <div v-else class="grid gap-4 md:grid-cols-2">
        <article v-for="draft in drafts" :key="draft.id" class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h3 class="truncate text-lg font-semibold text-slate-950">{{ draft.title || 'Untitled role' }}</h3>
              <p class="mt-1 text-sm text-slate-500">Updated {{ formatDate(draft.updatedAt) }}</p>
            </div>
            <UBadge :color="draft.archivedAt ? 'neutral' : 'primary'" variant="soft">{{ draft.archivedAt ? 'Archived' : statusLabel(draft.status) }}</UBadge>
          </div>
          <p class="mt-5 line-clamp-2 text-sm leading-6 text-slate-600">{{ draft.data.summary }}</p>
          <div class="mt-5 flex flex-wrap items-center gap-2">
            <UButton v-if="!draft.archivedAt" :to="{ path: '/', query: { id: draft.id } }" color="primary" variant="soft" size="sm">Open draft</UButton>
            <UButton v-if="!draft.archivedAt" color="neutral" variant="ghost" size="sm" @click="archiveDraft(draft)">Archive</UButton>
            <UButton v-else color="primary" variant="soft" size="sm" @click="restoreDraft(draft)">Restore</UButton>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>
