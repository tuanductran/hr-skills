<script setup lang="ts">
import {
  defaultCvDraft,
  reviewFlags,
  sectionKeys,
  type CvDraft,
  type SectionKey,
  toMarkdown,
} from 'hr-cv';
import { useCvPersistence } from '~/composables/useCvPersistence';

useSeoMeta({
  title: 'CV Studio — Build a focused CV',
  description: 'Build a private, structured CV in your browser.',
});

const route = useRoute();
const persistence = useCvPersistence();
const draft = reactive<CvDraft>(structuredClone(defaultCvDraft));
const activeSection = ref<SectionKey>('summary');
const isHydrating = ref(true);
const isDirty = ref(false);
const savedAt = ref<Date | null>(null);
const showHelp = ref(false);
const status = ref<'draft' | 'ready_for_review'>('draft');
let editorReady = false;
let saveTimer: ReturnType<typeof setTimeout> | undefined;

const persistenceError = computed(() => persistence.persistenceError.value);
const isSaving = computed(() => persistence.saving.value);
const flags = computed(() => reviewFlags(draft));
const completeness = computed(() => {
  const checks = [draft.fullName, draft.headline, draft.summary, draft.experience.length, draft.education.length, draft.skills.length];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
});

function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

async function hydrate() {
  if (route.query.new === '1') {
    persistence.resetCurrent();
  } else {
    const existing = typeof route.query.id === 'string'
      ? await persistence.load(route.query.id)
      : await persistence.resume();
    if (existing) {
      Object.assign(draft, structuredClone(existing.data));
      status.value = existing.status === 'ready_for_review' ? 'ready_for_review' : 'draft';
      savedAt.value = new Date(existing.updatedAt);
    }
  }
  editorReady = true;
  isHydrating.value = false;
}

async function saveDraft() {
  if (!editorReady) return;
  const saved = await persistence.save(draft, status.value);
  if (saved) {
    savedAt.value = new Date(saved.updatedAt);
    isDirty.value = false;
  }
}

function scheduleSave() {
  isDirty.value = true;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => void saveDraft(), 700);
}

function downloadMarkdown() {
  const blob = new Blob([toMarkdown(draft)], { type: 'text/markdown;charset=utf-8' });
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = `${draft.fullName || 'curriculum-vitae'}.md`;
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}

function addExperience() {
  draft.experience.push({ id: newId('experience'), role: 'New role', company: 'Company', location: '', employmentType: 'Full-time', startDate: '', endDate: '', current: false, highlights: ['Describe a measurable contribution.'] });
  activeSection.value = 'experience';
  scheduleSave();
}
function addEducation() {
  draft.education.push({ id: newId('education'), degree: 'Degree or certification', institution: 'Institution', location: '', startDate: '', endDate: '', details: ['Add a relevant detail.'] });
  activeSection.value = 'education';
  scheduleSave();
}
function addProject() {
  draft.projects.push({ id: newId('project'), name: 'Project name', description: 'Describe the outcome and your contribution.', url: '', technologies: ['Technology'] });
  activeSection.value = 'projects';
  scheduleSave();
}
function addLanguage() {
  draft.languages.push({ id: newId('language'), name: 'Language', level: 'Working proficiency' });
  activeSection.value = 'languages';
  scheduleSave();
}
function removeExperience(index: number) { draft.experience.splice(index, 1); scheduleSave(); }
function removeEducation(index: number) { draft.education.splice(index, 1); scheduleSave(); }
function removeProject(index: number) { draft.projects.splice(index, 1); scheduleSave(); }
function removeLanguage(index: number) { draft.languages.splice(index, 1); scheduleSave(); }
function removeSkill(index: number) { draft.skills.splice(index, 1); scheduleSave(); }
function addSkill() { draft.skills.push('New skill'); scheduleSave(); }

watch(draft, scheduleSave, { deep: true });
onMounted(() => void hydrate());
onBeforeUnmount(() => { if (saveTimer) clearTimeout(saveTimer); });

const sectionLabels: Record<SectionKey, string> = {
  summary: 'Profile', experience: 'Experience', education: 'Education', skills: 'Skills', projects: 'Projects', languages: 'Languages',
};
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <header class="no-print sticky top-0 z-20 border-b border-default bg-default/95 backdrop-blur">
      <UContainer class="flex min-h-16 items-center justify-between gap-4">
        <NuxtLink to="/" class="flex min-w-0 items-center gap-3" aria-label="CV Studio home">
          <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-inverted font-semibold">CV</span>
          <span class="hidden truncate text-sm font-semibold sm:block">CV Studio</span>
        </NuxtLink>
        <div class="flex items-center gap-2">
          <UBadge :color="isDirty ? 'warning' : 'success'" variant="subtle" class="inline-flex max-w-[9rem] truncate">
            {{ isDirty ? 'Unsaved changes' : savedAt ? `Saved ${savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Ready' }}
          </UBadge>
          <UButton color="neutral" variant="ghost" icon="i-lucide-circle-help" aria-label="Open help" @click="showHelp = !showHelp" />
          <UButton to="/drafts" color="neutral" variant="outline" icon="i-lucide-folder-open" aria-label="Open My CVs"><span class="hidden sm:inline">My CVs</span></UButton>
          <UButton to="/?new=1" color="primary" icon="i-lucide-plus" aria-label="Create a new CV"><span class="hidden sm:inline">New CV</span></UButton>
        </div>
      </UContainer>
    </header>

    <div v-if="isHydrating" class="py-16" aria-busy="true" aria-label="Loading CV editor"><UContainer class="space-y-6"><USkeleton class="h-10 w-2/3" /><USkeleton class="h-6 w-full max-w-2xl" /><USkeleton class="h-96 w-full rounded-lg" /></UContainer></div>

    <main v-else>
      <UContainer class="py-8 sm:py-10 lg:py-14">
        <div class="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div class="max-w-3xl">
            <UBadge color="primary" variant="subtle">Create / Curriculum vitae</UBadge>
            <h1 class="mt-4 text-3xl font-semibold tracking-tight text-highlighted sm:text-5xl">Make your work easy to understand.</h1>
            <p class="mt-4 max-w-2xl text-base leading-7 text-muted">Build a focused CV that gives your experience a clear point of view. Your content stays in this browser.</p>
          </div>
          <div class="flex items-center gap-3"><span class="text-sm text-muted">Completeness</span><UBadge color="primary" variant="soft">{{ completeness }}%</UBadge></div>
        </div>

        <UAlert v-if="persistenceError" color="error" variant="subtle" title="Browser storage issue" :description="persistenceError" class="mb-6" />
        <UAlert v-if="showHelp" color="info" variant="subtle" title="A private CV workspace" description="Drafts autosave to IndexedDB on this device. Use My CVs to duplicate, archive, delete or export a backup before changing browsers." class="mb-6" />

        <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
          <section aria-labelledby="editor-heading">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Guided editor</p><h2 id="editor-heading" class="mt-1 text-xl font-semibold text-highlighted">Build your story</h2></div><div class="flex gap-2"><UButton color="neutral" variant="outline" icon="i-lucide-file-down" @click="downloadMarkdown">Markdown</UButton><UButton color="primary" :loading="isSaving" @click="saveDraft">Save CV</UButton></div></div>
            <div class="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="CV sections">
              <UButton v-for="section in sectionKeys" :key="section" :active="activeSection === section" :color="activeSection === section ? 'primary' : 'neutral'" :variant="activeSection === section ? 'soft' : 'ghost'" role="tab" :aria-selected="activeSection === section" @click="activeSection = section">{{ sectionLabels[section] }}</UButton>
            </div>

            <UCard v-if="activeSection === 'summary'" variant="subtle"><template #header><h3 class="font-semibold text-highlighted">Profile and contact</h3></template><div class="grid gap-4 sm:grid-cols-2"><UFormField label="Full name" required><UInput v-model="draft.fullName" aria-label="Full name" /></UFormField><UFormField label="Headline" required><UInput v-model="draft.headline" aria-label="Headline" /></UFormField><UFormField label="Email"><UInput v-model="draft.email" type="email" aria-label="Email" /></UFormField><UFormField label="Phone"><UInput v-model="draft.phone" aria-label="Phone" /></UFormField><UFormField label="Location"><UInput v-model="draft.location" aria-label="Location" /></UFormField><UFormField label="Website"><UInput v-model="draft.website" aria-label="Website" /></UFormField><UFormField label="LinkedIn"><UInput v-model="draft.linkedin" aria-label="LinkedIn" /></UFormField><UFormField class="sm:col-span-2" label="Profile summary" description="Keep it specific, concise and outcome-oriented."><UTextarea v-model="draft.summary" :rows="6" aria-label="Profile summary" /></UFormField></div></UCard>

            <div v-else-if="activeSection === 'experience'" class="space-y-4"><div class="flex items-center justify-between"><h3 class="text-lg font-semibold text-highlighted">Experience</h3><UButton size="sm" icon="i-lucide-plus" @click="addExperience">Add role</UButton></div><UCard v-for="(item, index) in draft.experience" :key="item.id" variant="subtle"><template #header><div class="flex items-center justify-between gap-3"><span class="font-semibold text-highlighted">Role {{ index + 1 }}</span><UButton color="error" variant="ghost" icon="i-lucide-trash-2" aria-label="Remove role" @click="removeExperience(index)" /></div></template><div class="grid gap-4 sm:grid-cols-2"><UFormField label="Role"><UInput v-model="item.role" /></UFormField><UFormField label="Company"><UInput v-model="item.company" /></UFormField><UFormField label="Location"><UInput v-model="item.location" /></UFormField><UFormField label="Employment"><USelect v-model="item.employmentType" :items="['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']" /></UFormField><UFormField label="Start"><UInput v-model="item.startDate" /></UFormField><UFormField label="End"><UInput v-model="item.endDate" :disabled="item.current" /></UFormField><UCheckbox v-model="item.current" label="Current role" /><UFormField class="sm:col-span-2" label="Achievements"><div class="space-y-2"><div v-for="(_, highlightIndex) in item.highlights" :key="highlightIndex" class="flex gap-2"><UInput v-model="item.highlights[highlightIndex]" :aria-label="`Achievement ${highlightIndex + 1}`" class="flex-1" /><UButton color="neutral" variant="ghost" icon="i-lucide-x" :aria-label="`Remove achievement ${highlightIndex + 1}`" @click="item.highlights.splice(highlightIndex, 1); scheduleSave()" /></div><UButton size="xs" color="neutral" variant="outline" @click="item.highlights.push('New achievement'); scheduleSave()">Add achievement</UButton></div></UFormField></div></UCard><UCard v-if="!draft.experience.length" variant="subtle"><p class="text-muted">Add your most relevant role or project.</p></UCard></div>

            <div v-else-if="activeSection === 'education'" class="space-y-4"><div class="flex items-center justify-between"><h3 class="text-lg font-semibold text-highlighted">Education</h3><UButton size="sm" icon="i-lucide-plus" @click="addEducation">Add education</UButton></div><UCard v-for="(item, index) in draft.education" :key="item.id" variant="subtle"><template #header><div class="flex items-center justify-between"><span class="font-semibold text-highlighted">Education {{ index + 1 }}</span><UButton color="error" variant="ghost" icon="i-lucide-trash-2" aria-label="Remove education" @click="removeEducation(index)" /></div></template><div class="grid gap-4 sm:grid-cols-2"><UFormField label="Degree"><UInput v-model="item.degree" /></UFormField><UFormField label="Institution"><UInput v-model="item.institution" /></UFormField><UFormField label="Location"><UInput v-model="item.location" /></UFormField><UFormField label="Dates"><UInput v-model="item.startDate" placeholder="2015 – 2019" /></UFormField><UFormField class="sm:col-span-2" label="Details"><UInput v-model="item.details[0]" /></UFormField></div></UCard></div>

            <div v-else-if="activeSection === 'skills'" class="space-y-4"><div class="flex items-center justify-between"><h3 class="text-lg font-semibold text-highlighted">Skills</h3><UButton size="sm" icon="i-lucide-plus" @click="addSkill">Add skill</UButton></div><UCard variant="subtle"><div class="grid gap-3 sm:grid-cols-2"><div v-for="(_, index) in draft.skills" :key="index" class="flex gap-2"><UInput v-model="draft.skills[index]" :aria-label="`Skill ${index + 1}`" class="flex-1" /><UButton color="neutral" variant="ghost" icon="i-lucide-x" :aria-label="`Remove skill ${index + 1}`" @click="removeSkill(index)" /></div></div></UCard></div>

            <div v-else-if="activeSection === 'projects'" class="space-y-4"><div class="flex items-center justify-between"><h3 class="text-lg font-semibold text-highlighted">Projects</h3><UButton size="sm" icon="i-lucide-plus" @click="addProject">Add project</UButton></div><UCard v-for="(item, index) in draft.projects" :key="item.id" variant="subtle"><template #header><div class="flex items-center justify-between"><span class="font-semibold text-highlighted">Project {{ index + 1 }}</span><UButton color="error" variant="ghost" icon="i-lucide-trash-2" aria-label="Remove project" @click="removeProject(index)" /></div></template><div class="grid gap-4 sm:grid-cols-2"><UFormField label="Name"><UInput v-model="item.name" /></UFormField><UFormField label="URL"><UInput v-model="item.url" /></UFormField><UFormField class="sm:col-span-2" label="Description"><UTextarea v-model="item.description" :rows="3" /></UFormField><UFormField class="sm:col-span-2" label="Technologies"><UInput v-model="item.technologies[0]" placeholder="Vue, TypeScript, ..." /></UFormField></div></UCard></div>

            <div v-else class="space-y-4"><div class="flex items-center justify-between"><h3 class="text-lg font-semibold text-highlighted">Languages</h3><UButton size="sm" icon="i-lucide-plus" @click="addLanguage">Add language</UButton></div><UCard v-for="(item, index) in draft.languages" :key="item.id" variant="subtle"><div class="grid gap-4 sm:grid-cols-2"><UFormField label="Language"><UInput v-model="item.name" /></UFormField><UFormField label="Level"><UInput v-model="item.level" /></UFormField><UButton color="error" variant="ghost" icon="i-lucide-trash-2" aria-label="Remove language" @click="removeLanguage(index)" /></div></UCard></div>

            <div v-if="flags.length" class="mt-6 space-y-3"><UAlert v-for="flag in flags" :key="flag.code" :color="flag.tone === 'warning' ? 'warning' : 'info'" variant="subtle" :title="flag.title" :description="flag.detail" /></div>
          </section>

          <aside class="lg:sticky lg:top-24 lg:self-start" aria-label="CV preview"><UCard class="overflow-hidden"><template #header><div class="flex items-center justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Live preview</p><h2 class="mt-1 text-xl font-semibold text-highlighted">{{ draft.fullName || 'Your name' }}</h2></div><UButton color="neutral" variant="ghost" icon="i-lucide-printer" aria-label="Print CV" onclick="window.print()" /></div></template><article class="cv-paper space-y-6 text-sm leading-6"><div><h3 class="text-2xl font-bold text-highlighted">{{ draft.fullName || 'Your name' }}</h3><p class="font-medium text-primary">{{ draft.headline || 'Professional headline' }}</p><p class="mt-2 text-xs text-muted">{{ [draft.email, draft.phone, draft.location].filter(Boolean).join(' · ') }}</p></div><section v-if="draft.summary"><h4 class="border-b border-default pb-1 text-xs font-bold uppercase tracking-[0.16em] text-muted">Profile</h4><p class="mt-2">{{ draft.summary }}</p></section><section v-if="draft.experience.length"><h4 class="border-b border-default pb-1 text-xs font-bold uppercase tracking-[0.16em] text-muted">Experience</h4><div v-for="item in draft.experience" :key="item.id" class="mt-3"><div class="flex justify-between gap-3 font-semibold text-highlighted"><span>{{ item.role }} · {{ item.company }}</span><span class="text-xs text-muted">{{ item.startDate }} – {{ item.current ? 'Present' : item.endDate }}</span></div><ul class="mt-1 list-disc space-y-1 pl-5"><li v-for="highlight in item.highlights" :key="highlight">{{ highlight }}</li></ul></div></section><section v-if="draft.education.length"><h4 class="border-b border-default pb-1 text-xs font-bold uppercase tracking-[0.16em] text-muted">Education</h4><div v-for="item in draft.education" :key="item.id" class="mt-3"><p class="font-semibold text-highlighted">{{ item.degree }}</p><p>{{ item.institution }} · {{ item.startDate }} – {{ item.endDate }}</p></div></section><section v-if="draft.skills.length"><h4 class="border-b border-default pb-1 text-xs font-bold uppercase tracking-[0.16em] text-muted">Skills</h4><div class="mt-2 flex flex-wrap gap-2"><UBadge v-for="skill in draft.skills" :key="skill" color="neutral" variant="subtle">{{ skill }}</UBadge></div></section><section v-if="draft.projects.length"><h4 class="border-b border-default pb-1 text-xs font-bold uppercase tracking-[0.16em] text-muted">Projects</h4><div v-for="item in draft.projects" :key="item.id" class="mt-3"><p class="font-semibold text-highlighted">{{ item.name }}</p><p>{{ item.description }}</p></div></section><section v-if="draft.languages.length"><h4 class="border-b border-default pb-1 text-xs font-bold uppercase tracking-[0.16em] text-muted">Languages</h4><p class="mt-2">{{ draft.languages.map((item) => `${item.name} — ${item.level}`).join(' · ') }}</p></section></article></UCard></aside>
        </div>
      </UContainer>
    </main>
  </div>
</template>
