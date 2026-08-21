<script setup lang="ts">
import type { JobDescriptionDocument, ListItem } from '#shared/types/jd'
import { createEmptyDocument, rolePresets } from '#shared/types/jd'

const route = useRoute()
const toast = useToast()
const activeSection = ref('opportunitySummary')
const showPreview = ref(false)
const lastSavedAt = ref<Date | null>(null)
const document = ref<JobDescriptionDocument>(createEmptyDocument(String(route.query.preset ?? 'recruiter')))

const sections = [
  { id: 'opportunitySummary', label: 'Opportunity summary', icon: 'i-lucide-sparkles' },
  { id: 'roleOverview', label: 'Role overview', icon: 'i-lucide-briefcase-business' },
  { id: 'responsibilities', label: 'Responsibilities', icon: 'i-lucide-list-checks' },
  { id: 'mustHaveQualifications', label: 'Must-have qualifications', icon: 'i-lucide-shield-check' },
  { id: 'niceToHaveQualifications', label: 'Nice-to-have qualifications', icon: 'i-lucide-plus-circle' },
  { id: 'successMeasures', label: 'Success measures', icon: 'i-lucide-target' },
  { id: 'teamAndEnvironment', label: 'Team & environment', icon: 'i-lucide-users' },
  { id: 'compensationAndBenefits', label: 'Compensation & benefits', icon: 'i-lucide-banknote' },
]

const currentSection = computed(() => sections.find((item) => item.id === activeSection.value) ?? sections[0]!)
const completion = computed(() => {
  const values = [
    document.value.role.title,
    document.value.sections.opportunitySummary,
    document.value.sections.roleOverview,
    document.value.sections.responsibilities.length,
    document.value.sections.mustHaveQualifications.length,
    document.value.sections.niceToHaveQualifications.length,
    document.value.sections.successMeasures.length,
    document.value.sections.teamAndEnvironment,
    document.value.sections.compensationAndBenefits,
  ]
  return Math.round((values.filter(Boolean).length / values.length) * 100)
})
const findings = computed(() => {
  const result = []
  if (!document.value.sections.opportunitySummary.trim()) result.push({ severity: 'warning', message: 'Lead with the opportunity and business impact.', section: 'opportunitySummary' })
  if (!document.value.sections.roleOverview.trim()) result.push({ severity: 'warning', message: 'Describe what success looks like in this role.', section: 'roleOverview' })
  if (!document.value.sections.compensationAndBenefits.trim()) result.push({ severity: 'suggestion', message: 'Consider adding compensation transparency or a clear policy note.', section: 'compensationAndBenefits' })
  if (!document.value.sections.successMeasures.length) result.push({ severity: 'suggestion', message: 'Add measurable first 30/60/90-day success measures.', section: 'successMeasures' })
  return result
})

function saveDraft() {
  document.value.updatedAt = new Date().toISOString()
  localStorage.setItem(`hr-skills:jd:${document.value.documentId}`, JSON.stringify(document.value))
  lastSavedAt.value = new Date()
}

function addItem(section: 'responsibilities' | 'mustHaveQualifications' | 'niceToHaveQualifications') {
  const kind = section === 'responsibilities' ? 'responsibility' : section === 'mustHaveQualifications' ? 'must-have' : 'nice-to-have'
  document.value.sections[section].push({ id: `${section}-${Date.now()}`, text: '', kind } as ListItem)
}

function addMeasure() {
  document.value.sections.successMeasures.push('')
}

function exportDraft() {
  saveDraft()
  const blob = new Blob([JSON.stringify(document.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = window.document.createElement('a')
  anchor.href = url
  anchor.download = `${document.value.role.title.toLowerCase().replaceAll(' ', '-') || 'job-description'}.json`
  anchor.click()
  URL.revokeObjectURL(url)
  toast.add({ title: 'Draft exported', description: 'Your JSON-first document is ready to share.' })
}

onMounted(() => {
  const saved = localStorage.getItem(`hr-skills:jd:${document.value.documentId}`)
  if (saved) document.value = JSON.parse(saved) as JobDescriptionDocument
})

watch(document, saveDraft, { deep: true })
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <header class="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="flex min-w-0 items-center gap-3 text-sm font-semibold text-slate-950">
          <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-600 text-xs text-white">JD</span>
          <span class="truncate">{{ document.role.title || 'Untitled job description' }}</span>
        </NuxtLink>
        <div class="flex items-center gap-2">
          <span class="hidden text-xs text-slate-500 sm:inline">{{ lastSavedAt ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Not saved yet' }}</span>
          <UButton variant="ghost" color="neutral" icon="i-lucide-eye" aria-label="Preview document" @click="showPreview = true" />
          <UButton variant="soft" color="primary" icon="i-lucide-download" @click="exportDraft">Export</UButton>
        </div>
      </div>
    </header>

    <div class="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
      <div class="mb-5 flex items-center gap-3 text-xs font-medium text-slate-500">
        <span class="rounded-full bg-blue-100 px-3 py-1 text-blue-700">1 Setup ✓</span>
        <span class="rounded-full bg-blue-600 px-3 py-1 text-white">2 Compose</span>
        <span class="rounded-full bg-slate-200 px-3 py-1">3 Review</span>
      </div>

      <div class="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)_280px]">
        <aside class="hidden xl:block">
          <p class="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Sections</p>
          <nav class="space-y-1" aria-label="Document sections">
            <button v-for="section in sections" :key="section.id" type="button" class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-white" :class="activeSection === section.id ? 'bg-white font-semibold text-blue-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-600'" :aria-current="activeSection === section.id ? 'step' : undefined" @click="activeSection = section.id">
              <UIcon :name="section.icon" class="size-4 shrink-0" />
              <span>{{ section.label }}</span>
            </button>
          </nav>
        </aside>

        <section class="min-w-0">
          <UCard class="border-slate-200/80 bg-white shadow-sm">
            <template #header>
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-semibold text-blue-700">{{ currentSection.label }}</p>
                  <h1 class="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Shape the work, not an idealized person.</h1>
                </div>
                <div class="min-w-32 text-right">
                  <p class="text-xs font-medium text-slate-500">{{ completion }}% complete</p>
                  <UProgress v-model="completion" class="mt-2" aria-label="Draft completion" />
                </div>
              </div>
            </template>

            <div v-if="activeSection === 'opportunitySummary'" class="space-y-4">
              <UFormField label="Why does this role exist?" description="Lead with impact and the opportunity before listing requirements." required>
                <UTextarea v-model="document.sections.opportunitySummary" :rows="7" autoresize placeholder="Join our Talent Acquisition team to make every hiring decision clearer, more inclusive, and more connected to business outcomes." class="w-full" />
              </UFormField>
            </div>
            <div v-else-if="activeSection === 'roleOverview'" class="space-y-4">
              <UFormField label="Role overview" description="Describe what the person will accomplish during the first 90 days." required>
                <UTextarea v-model="document.sections.roleOverview" :rows="7" autoresize placeholder="You will partner with leaders to define hiring needs, build structured processes, and create a candidate experience people remember." class="w-full" />
              </UFormField>
            </div>
            <div v-else-if="['responsibilities', 'mustHaveQualifications', 'niceToHaveQualifications'].includes(activeSection)" class="space-y-4">
              <div class="space-y-3">
                <div v-for="item in document.sections[activeSection as 'responsibilities' | 'mustHaveQualifications' | 'niceToHaveQualifications']" :key="item.id" class="flex items-start gap-2">
                  <UIcon name="i-lucide-grip-vertical" class="mt-3 size-4 shrink-0 text-slate-300" />
                  <UTextarea v-model="item.text" :rows="2" autoresize :placeholder="activeSection === 'responsibilities' ? 'Describe an outcome-oriented responsibility...' : 'Add a realistic qualification...'" class="flex-1" />
                  <UButton color="neutral" variant="ghost" icon="i-lucide-trash-2" aria-label="Remove item" @click="document.sections[activeSection as 'responsibilities' | 'mustHaveQualifications' | 'niceToHaveQualifications'] = document.sections[activeSection as 'responsibilities' | 'mustHaveQualifications' | 'niceToHaveQualifications'].filter((entry) => entry.id !== item.id)" />
                </div>
              </div>
              <UButton variant="soft" color="neutral" icon="i-lucide-plus" @click="addItem(activeSection as 'responsibilities' | 'mustHaveQualifications' | 'niceToHaveQualifications')">Add item</UButton>
            </div>
            <div v-else-if="activeSection === 'successMeasures'" class="space-y-4">
              <UFormField label="How will success be visible?" description="Use measurable 30/60/90-day outcomes where practical.">
                <div class="space-y-3">
                  <div v-for="(_, index) in document.sections.successMeasures" :key="index" class="flex gap-2">
                    <UInput v-model="document.sections.successMeasures[index]!" :placeholder="`${index + 1}. Example: Build a qualified pipeline for priority roles`" class="flex-1" />
                    <UButton color="neutral" variant="ghost" icon="i-lucide-trash-2" aria-label="Remove success measure" @click="document.sections.successMeasures.splice(index, 1)" />
                  </div>
                  <UButton variant="soft" color="neutral" icon="i-lucide-plus" @click="addMeasure">Add success measure</UButton>
                </div>
              </UFormField>
            </div>
            <div v-else class="space-y-4">
              <UFormField :label="currentSection.label" description="Keep this section specific, transparent, and easy for candidates to scan.">
                <UTextarea v-model="document.sections[activeSection as 'teamAndEnvironment' | 'compensationAndBenefits']" :rows="8" autoresize :placeholder="activeSection === 'teamAndEnvironment' ? 'Describe the team, collaboration model, and working environment...' : 'Add salary range, benefits, flexibility, or a clear policy note...'" class="w-full" />
              </UFormField>
            </div>

            <template #footer>
              <div class="flex flex-wrap items-center justify-between gap-3">
                <UButton color="neutral" variant="ghost" icon="i-lucide-arrow-left" @click="activeSection = sections[Math.max(0, sections.findIndex((item) => item.id === activeSection) - 1)]!.id">Previous</UButton>
                <UButton icon="i-lucide-arrow-right" trailing @click="activeSection = sections[Math.min(sections.length - 1, sections.findIndex((item) => item.id === activeSection) + 1)]!.id">Save & continue</UButton>
              </div>
            </template>
          </UCard>
        </section>

        <aside class="space-y-4">
          <UCard class="border-slate-200/80 bg-white shadow-sm">
            <template #header><h2 class="font-semibold text-slate-950">Review signals</h2></template>
            <div class="space-y-3">
              <div v-for="finding in findings" :key="finding.message" class="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div class="flex items-start gap-2">
                  <UIcon :name="finding.severity === 'warning' ? 'i-lucide-triangle-alert' : 'i-lucide-lightbulb'" class="mt-0.5 size-4 text-amber-600" />
                  <p class="text-sm leading-5 text-slate-700">{{ finding.message }}</p>
                </div>
                <UButton size="xs" variant="link" class="mt-2 px-0" @click="activeSection = finding.section">Open section</UButton>
              </div>
              <p v-if="!findings.length" class="text-sm text-emerald-700">No review signals. This draft is ready to preview.</p>
            </div>
          </UCard>
          <UCard class="hidden border-slate-200/80 bg-slate-950 text-white shadow-sm xl:block">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">Role context</p>
            <h2 class="mt-3 text-xl font-semibold">{{ document.role.title }}</h2>
            <p class="mt-1 text-sm text-slate-300">{{ document.role.department }} · {{ document.role.workArrangement }}</p>
            <div class="mt-5 grid grid-cols-2 gap-3 text-xs text-slate-300">
              <span>{{ document.role.countryCode }}</span><span>{{ document.role.languageTag }}</span>
              <span>{{ document.role.employmentType }}</span><span>{{ document.role.seniority }}</span>
            </div>
          </UCard>
        </aside>
      </div>
    </div>

    <UModal v-model:open="showPreview" :ui="{ content: 'max-w-4xl' }" title="Candidate-facing preview" description="Preview the current structured job description.">
      <template #body>
        <article class="prose prose-slate max-w-none">
          <p class="text-sm font-semibold text-blue-700">{{ document.role.department }} · {{ document.role.workArrangement }}</p>
          <h1>{{ document.role.title }}</h1>
          <p>{{ document.sections.opportunitySummary || 'Your opportunity summary will appear here.' }}</p>
          <h2>Role overview</h2><p>{{ document.sections.roleOverview || 'Your role overview will appear here.' }}</p>
          <h2>Responsibilities</h2><ul><li v-for="item in document.sections.responsibilities" :key="item.id">{{ item.text || 'New responsibility' }}</li></ul>
          <h2>Qualifications</h2><ul><li v-for="item in [...document.sections.mustHaveQualifications, ...document.sections.niceToHaveQualifications]" :key="item.id">{{ item.text || 'New qualification' }}</li></ul>
        </article>
      </template>
    </UModal>
  </main>
</template>
