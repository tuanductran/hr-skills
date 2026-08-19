<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import {
  defaultJdDraft,
  employmentTypes,
  jdSchema,
  reviewFlags,
  seniorities,
  slugify,
  toMarkdown,
  workArrangements,
  type JdDocument,
  type JdDraft,
} from '~/utils/jd-schema'

useSeoMeta({
  title: 'JD Studio — HR Skills',
  description: 'Create clear, structured and reviewable job descriptions.',
})

const draft = reactive<JdDraft>(structuredClone(defaultJdDraft))
const activeSection = ref('role')
const savedAt = ref<Date | null>(null)
const submitted = ref(false)
const showJson = ref(false)
const persistence = useJdPersistence()
const route = useRoute()
const isSaving = computed(() => persistence.saving.value)
const persistenceError = computed(() => persistence.persistenceError.value)
const autosaveLabel = computed(() => isSaving.value ? 'Saving…' : savedAt.value ? `Saved ${savedAt.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Not saved yet')
let autosaveTimer: ReturnType<typeof setTimeout> | undefined
let editorReady = false

const sections = [
  { id: 'role', label: 'Role basics', eyebrow: '01', description: 'Give the role a clear point of view.' },
  { id: 'scope', label: 'Scope of work', eyebrow: '02', description: 'Describe ownership in observable terms.' },
  { id: 'signals', label: 'Success signals', eyebrow: '03', description: 'Make assessment and outcomes easier.' },
] as const

const flags = computed(() => reviewFlags(draft))
const progress = computed(() => {
  const checks = [draft.title, draft.department, draft.location, draft.summary, draft.responsibilities.length, draft.requiredSkills.length, draft.successMetrics.length]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
})

function addItem(key: 'responsibilities' | 'requiredSkills' | 'preferredSkills' | 'successMetrics') {
  draft[key].push('')
}

function removeItem(key: 'responsibilities' | 'requiredSkills' | 'preferredSkills' | 'successMetrics', index: number) {
  if (draft[key].length > 1 || key === 'preferredSkills') draft[key].splice(index, 1)
}

function moveItem(key: 'responsibilities' | 'requiredSkills' | 'preferredSkills' | 'successMetrics', index: number, direction: -1 | 1) {
  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= draft[key].length) return
  const [item] = draft[key].splice(index, 1)
  if (item === undefined) return
  draft[key].splice(nextIndex, 0, item)
}

async function saveDraft(status: 'draft' | 'ready_for_review' = 'draft') {
  const response = await persistence.save(draft, status)
  if (response) savedAt.value = new Date()
  return response
}

async function onSubmit(event: FormSubmitEvent<JdDocument>) {
  submitted.value = true
  await saveDraft('ready_for_review')
  console.info('JD document ready', event.data)
}

watch(draft, () => {
  if (!editorReady) return
  if (autosaveTimer) clearTimeout(autosaveTimer)
  autosaveTimer = setTimeout(() => saveDraft(), 900)
}, { deep: true })

onMounted(async () => {
  const targetId = typeof route.query.id === 'string' ? route.query.id : null
  const response = targetId ? await persistence.load(targetId) : await persistence.resume()
  if (response) {
    Object.assign(draft, structuredClone(response.data))
    submitted.value = response.status === 'ready_for_review' || response.status === 'published'
    savedAt.value = new Date(response.updatedAt)
  }
  editorReady = true
})

onBeforeUnmount(() => {
  if (autosaveTimer) clearTimeout(autosaveTimer)
})

function downloadFile(content: string, type: string, extension: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${slugify(draft.title)}.${extension}`
  anchor.click()
  URL.revokeObjectURL(url)
}

function downloadMarkdown() {
  const result = vSafeParse()
  if (result.success) downloadFile(toMarkdown(result.output), 'text/markdown', 'md')
}

function downloadJson() {
  const result = vSafeParse()
  if (result.success) downloadFile(JSON.stringify(result.output, null, 2), 'application/json', 'json')
}

async function downloadDocx() {
  const result = vSafeParse()
  if (!result.success) return
  const { Document, HeadingLevel, Packer, Paragraph, TextRun } = await import('docx')
  const paragraphs = [
    new Paragraph({ text: result.output.title, heading: HeadingLevel.TITLE }),
    new Paragraph({ children: [new TextRun({ text: `${result.output.department} · ${result.output.location} · ${result.output.workArrangement} · ${result.output.employmentType}`, bold: true })] }),
    new Paragraph({ text: 'Summary', heading: HeadingLevel.HEADING_1 }),
    new Paragraph(result.output.summary),
    new Paragraph({ text: 'Responsibilities', heading: HeadingLevel.HEADING_1 }),
    ...result.output.responsibilities.map((item) => new Paragraph({ text: item, bullet: { level: 0 } })),
    new Paragraph({ text: 'Required skills', heading: HeadingLevel.HEADING_1 }),
    ...result.output.requiredSkills.map((item) => new Paragraph({ text: item, bullet: { level: 0 } })),
    new Paragraph({ text: 'Preferred skills', heading: HeadingLevel.HEADING_1 }),
    ...(result.output.preferredSkills.length ? result.output.preferredSkills : ['None specified']).map((item) => new Paragraph({ text: item, bullet: { level: 0 } })),
    new Paragraph({ text: 'Success signals', heading: HeadingLevel.HEADING_1 }),
    ...result.output.successMetrics.map((item) => new Paragraph({ text: item, bullet: { level: 0 } })),
  ]
  const blob = await Packer.toBlob(new Document({ sections: [{ properties: {}, children: paragraphs }] }))
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${slugify(draft.title)}.docx`
  anchor.click()
  URL.revokeObjectURL(url)
}

function vSafeParse() {
  return vSafeParseSchema(jdSchema, draft)
}

function vSafeParseSchema(schema: typeof jdSchema, value: JdDraft) {
  return v.safeParse(schema, value)
}

</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-950">
    <header class="no-print border-b border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8">
        <div class="flex items-center gap-3">
          <div class="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">JD</div>
          <div>
            <p class="text-sm font-semibold tracking-tight text-slate-950">JD Studio</p>
            <p class="text-xs text-slate-500">HR Skills workspace</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="hidden text-xs text-slate-500 sm:inline">{{ autosaveLabel }}</span>
          <UButton color="neutral" variant="ghost" icon="i-lucide-circle-help" aria-label="Help" />
          <span class="hidden text-xs text-slate-500 sm:inline">Saved on this device</span>
          <NuxtLink to="/drafts" class="hidden text-sm font-medium text-slate-600 hover:text-blue-700 sm:inline">My drafts</NuxtLink>
          <UButton color="neutral" variant="soft" icon="i-lucide-file-text" @click="downloadMarkdown">Markdown</UButton>
          <UButton color="neutral" variant="soft" icon="i-lucide-file-down" @click="downloadDocx">DOCX</UButton>
          <UButton color="primary" variant="soft" icon="i-lucide-download" @click="downloadJson">JSON</UButton>
        </div>
      </div>
    </header>

    <main class="jd-grid min-h-[calc(100vh-73px)]">
      <div class="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:py-12">
        <div class="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div class="max-w-3xl">
            <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Create / Job description</p>
            <h1 class="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Make the role clear before you make it public.</h1>
            <p class="mt-4 max-w-2xl text-base leading-7 text-slate-600">Shape a structured job description that helps candidates understand the work, the expectations and the signals of success.</p>
          </div>
          <div class="w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Draft readiness</span><span class="text-slate-900">{{ progress }}%</span>
            </div>
            <UProgress :model-value="progress" color="primary" />
            <p class="mt-2 text-xs leading-5 text-slate-500">Complete the essentials, then review the language before sharing.</p>
          </div>
        </div>

        <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_460px]">
          <section class="jd-panel rounded-3xl p-5 sm:p-8">
            <div class="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Guided editor</p>
                <h2 class="mt-1 text-xl font-semibold text-slate-950">Build the role profile</h2>
              </div>
              <UButton color="neutral" variant="outline" icon="i-lucide-save" :loading="isSaving" @click="saveDraft()">Save draft</UButton>
            </div>

            <div class="mb-8 grid gap-2 sm:grid-cols-3">
              <button v-for="section in sections" :key="section.id" type="button" class="rounded-2xl border p-4 text-left transition" :class="activeSection === section.id ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'" @click="activeSection = section.id">
                <span class="text-xs font-semibold text-blue-700">{{ section.eyebrow }}</span>
                <span class="mt-2 block text-sm font-semibold text-slate-950">{{ section.label }}</span>
                <span class="mt-1 block text-xs leading-5" :class="activeSection === section.id ? 'text-slate-600' : 'text-slate-500'">{{ section.description }}</span>
              </button>
            </div>

            <UForm :schema="jdSchema" :state="draft" class="space-y-8" @submit="onSubmit">
              <div v-show="activeSection === 'role'" class="space-y-6">
                <div class="grid gap-5 sm:grid-cols-2">
                  <UFormField label="Job title" name="title" required>
                    <UInput v-model="draft.title" size="lg" class="w-full" placeholder="e.g. Senior People Operations Partner" />
                  </UFormField>
                  <UFormField label="Department" name="department" required>
                    <UInput v-model="draft.department" size="lg" class="w-full" placeholder="e.g. People & Culture" />
                  </UFormField>
                  <UFormField label="Location" name="location" required>
                    <UInput v-model="draft.location" class="w-full" placeholder="e.g. Ho Chi Minh City" />
                  </UFormField>
                  <UFormField label="Seniority" name="seniority" required>
                    <USelect v-model="draft.seniority" :items="[...seniorities]" class="w-full" />
                  </UFormField>
                  <UFormField label="Employment type" name="employmentType" required>
                    <USelect v-model="draft.employmentType" :items="[...employmentTypes]" class="w-full" />
                  </UFormField>
                  <UFormField label="Work arrangement" name="workArrangement" required>
                    <USelect v-model="draft.workArrangement" :items="[...workArrangements]" class="w-full" />
                  </UFormField>
                </div>
                <UFormField label="Role summary" name="summary" description="Write for the person who may join, not only the internal org chart." required>
                  <UTextarea v-model="draft.summary" :rows="5" autoresize class="w-full" placeholder="What will this person own and why does it matter?" />
                </UFormField>
              </div>

              <div v-show="activeSection === 'scope'" class="space-y-7">
                <div v-for="key in (['responsibilities', 'requiredSkills', 'preferredSkills'] as const)" :key="key" class="space-y-3">
                  <div class="flex items-end justify-between gap-4">
                    <div>
                      <h3 class="text-base font-semibold text-slate-950">{{ key === 'responsibilities' ? 'Responsibilities' : key === 'requiredSkills' ? 'Required skills' : 'Preferred skills' }}</h3>
                      <p class="mt-1 text-sm text-slate-500">{{ key === 'responsibilities' ? 'Describe outcomes and ownership with clear verbs.' : 'Keep this list specific, observable and assessable.' }}</p>
                    </div>
                    <UButton size="sm" color="primary" variant="soft" icon="i-lucide-plus" @click="addItem(key)">Add</UButton>
                  </div>
                  <div class="space-y-2">
                    <div v-for="(_, index) in draft[key]" :key="`${key}-${index}`" class="flex items-center gap-2">
                      <div class="flex min-w-0 flex-1 gap-2">
                        <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-grip-vertical" aria-label="Reorder item" class="cursor-grab" />
                        <UInput v-model="draft[key][index]" class="w-full" :placeholder="key === 'responsibilities' ? 'Own...' : 'e.g. Stakeholder communication'" />
                      </div>
                      <div class="flex shrink-0">
                        <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-chevron-up" aria-label="Move item up" :disabled="index === 0" @click="moveItem(key, index, -1)" />
                        <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-chevron-down" aria-label="Move item down" :disabled="index === draft[key].length - 1" @click="moveItem(key, index, 1)" />
                        <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-x" aria-label="Remove item" :disabled="draft[key].length === 1 && key !== 'preferredSkills'" @click="removeItem(key, index)" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-show="activeSection === 'signals'" class="space-y-7">
                <div>
                  <h3 class="text-base font-semibold text-slate-950">Success signals</h3>
                  <p class="mt-1 text-sm text-slate-500">What should be measurably different after this person succeeds?</p>
                </div>
                <div class="space-y-2">
                  <div v-for="(_, index) in draft.successMetrics" :key="`metric-${index}`" class="flex items-center gap-2">
                    <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-grip-vertical" aria-label="Reorder metric" class="cursor-grab" />
                    <UInput v-model="draft.successMetrics[index]" class="w-full" placeholder="e.g. 90% program adoption in the first two quarters" />
                    <div class="flex shrink-0">
                      <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-chevron-up" aria-label="Move metric up" :disabled="index === 0" @click="moveItem('successMetrics', index, -1)" />
                      <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-chevron-down" aria-label="Move metric down" :disabled="index === draft.successMetrics.length - 1" @click="moveItem('successMetrics', index, 1)" />
                      <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-x" aria-label="Remove success metric" :disabled="draft.successMetrics.length === 1" @click="removeItem('successMetrics', index)" />
                    </div>
                  </div>
                </div>
                <UButton color="primary" variant="soft" icon="i-lucide-plus" @click="addItem('successMetrics')">Add success metric</UButton>

                <div class="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <div class="flex gap-3">
                    <UIcon name="i-lucide-scan-search" class="mt-0.5 size-5 text-blue-700" />
                    <div>
                      <p class="font-semibold text-blue-950">Review before publishing</p>
                      <p class="mt-1 text-sm leading-6 text-blue-900/70">A good JD makes the evaluation criteria visible. Keep requirements focused and connect them to the work.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-xs text-slate-500">{{ submitted ? 'Ready for review. You can still keep editing.' : 'Your draft stays in this workspace until you are ready.' }}</p>
                <div class="flex gap-2">
                  <UButton v-if="activeSection !== 'role'" color="neutral" variant="ghost" @click="activeSection = activeSection === 'signals' ? 'scope' : 'role'">Back</UButton>
                  <UButton v-if="activeSection !== 'signals'" color="primary" variant="soft" @click="activeSection = activeSection === 'role' ? 'scope' : 'signals'">Continue</UButton>
                  <UButton v-else type="submit" color="primary" icon="i-lucide-check" :loading="isSaving">Mark ready for review</UButton>
                </div>
              </div>
            </UForm>
          </section>

          <aside class="space-y-6">
            <section class="jd-panel print-page rounded-3xl p-6 sm:p-8">
              <div class="mb-7 flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Live preview</p>
                  <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{{ draft.title || 'Untitled role' }}</h2>
                  <p class="mt-2 text-sm text-slate-500">{{ draft.department || 'Department' }} · {{ draft.location || 'Location' }}</p>
                </div>
                <UBadge color="primary" variant="soft">{{ draft.seniority }}</UBadge>
              </div>

              <div class="space-y-7 jd-prose">
                <div>
                  <p class="text-sm">{{ draft.summary || 'Your role summary will appear here.' }}</p>
                </div>
                <div>
                  <h3 class="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">At a glance</h3>
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="rounded-xl bg-slate-50 p-3"><span class="block text-slate-500">Type</span><span class="mt-1 block font-medium text-slate-800">{{ draft.employmentType }}</span></div>
                    <div class="rounded-xl bg-slate-50 p-3"><span class="block text-slate-500">Arrangement</span><span class="mt-1 block font-medium text-slate-800">{{ draft.workArrangement }}</span></div>
                  </div>
                </div>
                <div>
                  <h3 class="mb-3 text-sm font-semibold text-slate-950">What you will own</h3>
                  <ul class="space-y-2 text-sm text-slate-600"><li v-for="item in draft.responsibilities" :key="item" class="flex gap-2"><span class="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" />{{ item || 'Responsibility' }}</li></ul>
                </div>
                <div>
                  <h3 class="mb-3 text-sm font-semibold text-slate-950">What you bring</h3>
                  <div class="flex flex-wrap gap-2"><UBadge v-for="skill in [...draft.requiredSkills, ...draft.preferredSkills]" :key="skill" color="neutral" variant="outline">{{ skill || 'Skill' }}</UBadge></div>
                </div>
                <div>
                  <h3 class="mb-3 text-sm font-semibold text-slate-950">Success looks like</h3>
                  <ul class="space-y-2 text-sm text-slate-600"><li v-for="metric in draft.successMetrics" :key="metric" class="flex gap-2"><UIcon name="i-lucide-arrow-up-right" class="mt-0.5 size-4 text-blue-600" />{{ metric || 'Success metric' }}</li></ul>
                </div>
              </div>
            </section>

            <section class="no-print rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/10">
              <div class="flex items-center justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">Language review</p><h2 class="mt-2 text-lg font-semibold">Make the signal stronger.</h2></div><UIcon name="i-lucide-sparkles" class="size-5 text-blue-300" /></div>
              <div v-if="persistenceError" class="mb-4 rounded-2xl border border-blue-300/20 bg-blue-400/10 p-4 text-sm leading-6 text-blue-100">{{ persistenceError }}</div>
              <div class="mt-5 space-y-3">
                <div v-if="flags.length === 0" class="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">No review flags yet. Keep the language specific and grounded in the work.</div>
                <div v-for="flag in flags" :key="flag.title" class="rounded-2xl border border-white/10 bg-white/5 p-4"><p class="text-sm font-semibold text-white">{{ flag.title }}</p><p class="mt-1 text-xs leading-5 text-slate-300">{{ flag.detail }}</p></div>
              </div>
            </section>

            <section class="no-print rounded-3xl border border-slate-200 bg-white p-6">
              <div class="flex items-center justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Developer view</p><h2 class="mt-1 text-base font-semibold text-slate-950">Structured output</h2></div><UButton size="xs" color="neutral" variant="ghost" @click="showJson = !showJson">{{ showJson ? 'Hide' : 'Show' }}</UButton></div>
              <pre v-if="showJson" class="mt-4 max-h-72 overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-5 text-blue-100">{{ JSON.stringify(draft, null, 2) }}</pre>
              <p v-else class="mt-3 text-sm leading-6 text-slate-500">The editor is JSON-first, so this document can later power preview, API, scoring and export without parsing rendered text.</p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  </div>
</template>
