<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";
import {
	defaultJdDraft,
	employmentTypes,
	type JdDocument,
	type JdDraft,
	jdSchema,
	reviewFlags,
	seniorities,
	slugify,
	toMarkdown,
	workArrangements,
} from "~/utils/jd-schema";

useSeoMeta({
	title: "JD Studio — HR Skills",
	description: "Create clear, structured and reviewable job descriptions.",
});

const draft = reactive<JdDraft>(structuredClone(defaultJdDraft));
const activeSection = ref("role");
const savedAt = ref<Date | null>(null);
const submitted = ref(false);
const showJson = ref(false);
const persistence = useJdPersistence();
const route = useRoute();
const isSaving = computed(() => persistence.saving.value);
const persistenceError = computed(() => persistence.persistenceError.value);
const draftStatus = ref<
	"draft" | "ready_for_review" | "approved" | "published"
>("draft");
const autosaveLabel = computed(() =>
	isSaving.value
		? "Saving…"
		: savedAt.value
			? `Saved ${savedAt.value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
			: "Ready to save",
);
let autosaveTimer: ReturnType<typeof setTimeout> | undefined;
let editorReady = false;

const sections = [
	{
		id: "role",
		label: "Role basics",
		eyebrow: "01",
		description: "Give the role a clear point of view.",
	},
	{
		id: "scope",
		label: "Scope of work",
		eyebrow: "02",
		description: "Describe ownership in observable terms.",
	},
	{
		id: "signals",
		label: "Success signals",
		eyebrow: "03",
		description: "Make assessment and outcomes easier.",
	},
] as const;

const flags = computed(() => reviewFlags(draft));
const progress = computed(() => {
	const checks = [
		draft.title,
		draft.department,
		draft.location,
		draft.summary,
		draft.responsibilities.length,
		draft.requiredSkills.length,
		draft.successMetrics.length,
	];
	return Math.round((checks.filter(Boolean).length / checks.length) * 100);
});

function addItem(
	key:
		| "responsibilities"
		| "requiredSkills"
		| "preferredSkills"
		| "successMetrics",
) {
	draft[key].push("");
}

function removeItem(
	key:
		| "responsibilities"
		| "requiredSkills"
		| "preferredSkills"
		| "successMetrics",
	index: number,
) {
	if (draft[key].length > 1 || key === "preferredSkills")
		draft[key].splice(index, 1);
}

function moveItem(
	key:
		| "responsibilities"
		| "requiredSkills"
		| "preferredSkills"
		| "successMetrics",
	index: number,
	direction: -1 | 1,
) {
	const nextIndex = index + direction;
	if (nextIndex < 0 || nextIndex >= draft[key].length) return;
	const [item] = draft[key].splice(index, 1);
	if (item === undefined) return;
	draft[key].splice(nextIndex, 0, item);
}

async function saveDraft(
	status: "draft" | "ready_for_review" | "approved" | "published" = "draft",
) {
	const response = await persistence.save(draft, status);
	if (response) savedAt.value = new Date();
	return response;
}

async function onSubmit(event: FormSubmitEvent<JdDocument>) {
	submitted.value = true;
	draftStatus.value = "ready_for_review";
	await saveDraft("ready_for_review");
	console.info("JD document ready", event.data);
}

async function transitionStatus(
	status: "approved" | "published",
) {
	if (status === "approved" && draftStatus.value !== "ready_for_review") return;
	if (status === "published" && draftStatus.value !== "approved") return;
	draftStatus.value = status;
	submitted.value = true;
	await saveDraft(status);
}

function statusLabel(status: typeof draftStatus.value) {
	return {
		draft: "Draft",
		ready_for_review: "Ready for review",
		approved: "Approved",
		published: "Published locally",
	}[status];
}

watch(
	draft,
	() => {
		if (!editorReady) return;
		if (autosaveTimer) clearTimeout(autosaveTimer);
		autosaveTimer = setTimeout(() => saveDraft(), 900);
	},
	{ deep: true },
);

onMounted(async () => {
	const targetId = typeof route.query.id === "string" ? route.query.id : null;
	const response = targetId
		? await persistence.load(targetId)
		: await persistence.resume();
	if (response) {
		Object.assign(draft, structuredClone(response.data));
		submitted.value =
			response.status !== "draft";
		draftStatus.value = response.status;
		savedAt.value = new Date(response.updatedAt);
	}
	editorReady = true;
});

watch(
	() => route.query.new,
	(value) => {
		if (value === "1" && editorReady) {
			persistence.resetCurrent();
			Object.assign(draft, structuredClone(defaultJdDraft));
			draftStatus.value = "draft";
			submitted.value = false;
			savedAt.value = null;
			activeSection.value = "role";
		}
	},
);

onBeforeUnmount(() => {
	if (autosaveTimer) clearTimeout(autosaveTimer);
});

function downloadFile(content: string, type: string, extension: string) {
	const blob = new Blob([content], { type });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = `${slugify(draft.title)}.${extension}`;
	anchor.click();
	URL.revokeObjectURL(url);
}

function downloadMarkdown() {
	const result = vSafeParse();
	if (result.success)
		downloadFile(toMarkdown(result.output), "text/markdown", "md");
}

function downloadJson() {
	const result = vSafeParse();
	if (result.success)
		downloadFile(
			JSON.stringify(result.output, null, 2),
			"application/json",
			"json",
		);
}

async function downloadDocx() {
	const result = vSafeParse();
	if (!result.success) return;
	const { Document, HeadingLevel, Packer, Paragraph, TextRun } = await import(
		"docx"
	);
	const paragraphs = [
		new Paragraph({ text: result.output.title, heading: HeadingLevel.TITLE }),
		new Paragraph({
			children: [
				new TextRun({
					text: `${result.output.department} · ${result.output.location} · ${result.output.workArrangement} · ${result.output.employmentType}`,
					bold: true,
				}),
			],
		}),
		new Paragraph({ text: "Summary", heading: HeadingLevel.HEADING_1 }),
		new Paragraph(result.output.summary),
		new Paragraph({
			text: "Responsibilities",
			heading: HeadingLevel.HEADING_1,
		}),
		...result.output.responsibilities.map(
			(item) => new Paragraph({ text: item, bullet: { level: 0 } }),
		),
		new Paragraph({ text: "Required skills", heading: HeadingLevel.HEADING_1 }),
		...result.output.requiredSkills.map(
			(item) => new Paragraph({ text: item, bullet: { level: 0 } }),
		),
		new Paragraph({
			text: "Preferred skills",
			heading: HeadingLevel.HEADING_1,
		}),
		...(result.output.preferredSkills.length
			? result.output.preferredSkills
			: ["None specified"]
		).map((item) => new Paragraph({ text: item, bullet: { level: 0 } })),
		new Paragraph({ text: "Success signals", heading: HeadingLevel.HEADING_1 }),
		...result.output.successMetrics.map(
			(item) => new Paragraph({ text: item, bullet: { level: 0 } }),
		),
	];
	const blob = await Packer.toBlob(
		new Document({ sections: [{ properties: {}, children: paragraphs }] }),
	);
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = `${slugify(draft.title)}.docx`;
	anchor.click();
	URL.revokeObjectURL(url);
}

function vSafeParse() {
	return v.safeParse(jdSchema, draft);
}
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <header class="no-print sticky top-0 z-20 border-b border-default bg-default/95 backdrop-blur">
      <UContainer class="flex min-h-16 items-center justify-between gap-3 py-3">
        <NuxtLink to="/" class="rounded-md focus-visible:outline-2 focus-visible:outline-primary" aria-label="JD Studio home">
          <UBadge color="primary" variant="solid" size="lg" class="shrink-0">JD</UBadge>
        </NuxtLink>
      </UContainer>
    </header>

    <main>
      <UContainer class="py-8 sm:py-10 lg:py-14">
        <div class="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div class="max-w-3xl">
            <UBadge color="primary" variant="subtle">Create / Job description</UBadge>
            <h1 class="mt-4 text-3xl font-semibold tracking-tight text-highlighted sm:text-5xl">Make the role clear before you share it.</h1>
            <p class="mt-4 max-w-2xl text-base leading-7 text-muted">Shape a structured job description that helps candidates understand the work, the expectations and the signals of success.</p>
          <UCard class="mt-6 no-print" :ui="{ body: 'p-3 sm:p-4' }">
            <div class="flex flex-wrap items-center gap-2">
              <UButton to="/drafts" color="neutral" variant="soft" icon="i-lucide-folder-open">My drafts</UButton>
              <UButton color="neutral" variant="soft" icon="i-lucide-file-text" @click="downloadMarkdown">Markdown</UButton>
              <UButton color="neutral" variant="soft" icon="i-lucide-file-down" @click="downloadDocx">DOCX</UButton>
              <UButton color="primary" variant="soft" icon="i-lucide-download" @click="downloadJson">JSON</UButton>
            </div>
          </UCard>
          </div>
          <UCard class="w-full lg:max-w-xs">
            <div class="flex items-center justify-between text-sm font-medium text-muted">
              <span>Draft readiness</span>
              <span class="text-highlighted">{{ progress }}%</span>
            </div>
            <UProgress :model-value="progress" color="primary" class="mt-3" />
            <p class="mt-3 text-xs leading-5 text-muted">Complete the essentials, then review the language before sharing.</p>
          </UCard>
        </div>

        <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_28rem]">
          <UCard class="min-w-0" :ui="{ body: 'p-4 sm:p-6 lg:p-8' }">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-muted">Guided editor</p>
                <div class="mt-1 flex flex-wrap items-center gap-2"><h2 class="text-xl font-semibold text-highlighted">Build the role profile</h2><UBadge color="neutral" variant="soft">{{ statusLabel(draftStatus) }}</UBadge></div>
              </div>
              <div class="flex flex-wrap items-center gap-3">
                <span class="text-xs text-muted" aria-live="polite">{{ autosaveLabel }}</span>
                <UButton color="neutral" variant="outline" icon="i-lucide-save" :loading="isSaving" @click="saveDraft()">Save draft</UButton>
              </div>
            </div>
            <USeparator class="my-6" />

            <div class="mb-8 grid gap-2 sm:grid-cols-3" role="tablist" aria-label="Job description sections">
              <UButton v-for="section in sections" :key="section.id" :color="activeSection === section.id ? 'primary' : 'neutral'" :variant="activeSection === section.id ? 'soft' : 'ghost'" class="h-auto justify-start whitespace-normal text-left" role="tab" :aria-selected="activeSection === section.id" @click="activeSection = section.id">
                <span class="min-w-0">
                  <span class="block text-xs font-semibold">{{ section.eyebrow }}</span>
                  <span class="mt-1 block text-sm font-semibold">{{ section.label }}</span>
                  <span class="mt-1 block text-xs font-normal leading-5 text-toned">{{ section.description }}</span>
                </span>
              </UButton>
            </div>

            <UForm :schema="jdSchema" :state="draft" class="space-y-8" @submit="onSubmit">
              <div v-show="activeSection === 'role'" class="space-y-6">
                <div class="grid gap-5 sm:grid-cols-2">
                  <UFormField label="Job title" name="title" required><UInput v-model="draft.title" size="lg" class="w-full" placeholder="e.g. Senior People Operations Partner" /></UFormField>
                  <UFormField label="Department" name="department" required><UInput v-model="draft.department" size="lg" class="w-full" placeholder="e.g. People & Culture" /></UFormField>
                  <UFormField label="Location" name="location" required><UInput v-model="draft.location" class="w-full" placeholder="e.g. Ho Chi Minh City" /></UFormField>
                  <UFormField label="Seniority" name="seniority" required><USelect v-model="draft.seniority" :items="[...seniorities]" class="w-full" /></UFormField>
                  <UFormField label="Employment type" name="employmentType" required><USelect v-model="draft.employmentType" :items="[...employmentTypes]" class="w-full" /></UFormField>
                  <UFormField label="Work arrangement" name="workArrangement" required><USelect v-model="draft.workArrangement" :items="[...workArrangements]" class="w-full" /></UFormField>
                </div>
                <UFormField label="Role summary" name="summary" description="Write for the person who may join, not only the internal org chart." required><UTextarea v-model="draft.summary" :rows="5" autoresize class="w-full" placeholder="What will this person own and why does it matter?" /></UFormField>
              </div>

              <div v-show="activeSection === 'scope'" class="space-y-7">
                <div v-for="key in (['responsibilities', 'requiredSkills', 'preferredSkills'] as const)" :key="key" class="space-y-3">
                  <div class="flex items-end justify-between gap-4">
                    <div><h3 class="text-base font-semibold text-highlighted">{{ key === 'responsibilities' ? 'Responsibilities' : key === 'requiredSkills' ? 'Required skills' : 'Preferred skills' }}</h3><p class="mt-1 text-sm text-muted">{{ key === 'responsibilities' ? 'Describe outcomes and ownership with clear verbs.' : 'Keep this list specific, observable and assessable.' }}</p></div>
                    <UButton size="sm" color="primary" variant="soft" icon="i-lucide-plus" @click="addItem(key)">Add</UButton>
                  </div>
                  <div class="space-y-2">
                    <div v-for="(_, index) in draft[key]" :key="`${key}-${index}`" class="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-1.5">
                      <UInput v-model="draft[key][index]" class="min-w-0 flex-1" :placeholder="key === 'responsibilities' ? 'Own...' : 'e.g. Stakeholder communication'" />
                      <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-chevron-up" aria-label="Move item up" :disabled="index === 0" @click="moveItem(key, index, -1)" />
                      <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-chevron-down" aria-label="Move item down" :disabled="index === draft[key].length - 1" @click="moveItem(key, index, 1)" />
                      <UButton size="xs" color="error" variant="ghost" icon="i-lucide-x" aria-label="Remove item" :disabled="draft[key].length === 1 && key !== 'preferredSkills'" @click="removeItem(key, index)" />
                    </div>
                  </div>
                </div>
              </div>

              <div v-show="activeSection === 'signals'" class="space-y-7">
                <div><h3 class="text-base font-semibold text-highlighted">Success signals</h3><p class="mt-1 text-sm text-muted">What should be measurably different after this person succeeds?</p></div>
                <div class="space-y-2">
                  <div v-for="(_, index) in draft.successMetrics" :key="`metric-${index}`" class="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-1.5">
                    <UInput v-model="draft.successMetrics[index]" class="min-w-0 flex-1" placeholder="e.g. 90% program adoption in the first two quarters" />
                    <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-chevron-up" aria-label="Move metric up" :disabled="index === 0" @click="moveItem('successMetrics', index, -1)" />
                    <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-chevron-down" aria-label="Move metric down" :disabled="index === draft.successMetrics.length - 1" @click="moveItem('successMetrics', index, 1)" />
                    <UButton size="xs" color="error" variant="ghost" icon="i-lucide-x" aria-label="Remove success metric" :disabled="draft.successMetrics.length === 1" @click="removeItem('successMetrics', index)" />
                  </div>
                </div>
                <UButton color="primary" variant="soft" icon="i-lucide-plus" @click="addItem('successMetrics')">Add success metric</UButton>
                <UAlert color="neutral" variant="outline" icon="i-lucide-scan-search" title="Review before sharing">A good JD makes the evaluation criteria visible. Keep requirements focused and connect them to the work.</UAlert>
              </div>

              <div class="flex flex-col-reverse gap-3 border-t border-default pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-xs text-muted" aria-live="polite">{{ submitted ? 'Ready for review. You can still keep editing.' : 'Your draft stays in this workspace until you are ready.' }}</p>
                <div class="flex flex-wrap justify-end gap-2">
                  <UButton v-if="activeSection !== 'role'" color="neutral" variant="ghost" @click="activeSection = activeSection === 'signals' ? 'scope' : 'role'">Back</UButton>
                  <UButton v-if="activeSection !== 'signals'" color="primary" variant="soft" @click="activeSection = activeSection === 'role' ? 'scope' : 'signals'">Continue</UButton>
                  <UButton v-if="draftStatus === 'draft'" type="submit" color="primary" icon="i-lucide-check" :loading="isSaving">Mark ready for review</UButton>
                  <UButton v-if="draftStatus === 'ready_for_review'" type="submit" color="primary" variant="soft" icon="i-lucide-save" :loading="isSaving">Save review state</UButton>
                  <UButton v-if="activeSection === 'signals' && draftStatus === 'ready_for_review'" type="button" color="success" variant="soft" icon="i-lucide-badge-check" :loading="isSaving" @click="transitionStatus('approved')">Approve locally</UButton>
                  <UButton v-if="activeSection === 'signals' && draftStatus === 'approved'" type="button" color="primary" icon="i-lucide-send" :loading="isSaving" @click="transitionStatus('published')">Mark published locally</UButton>
                </div>
              </div>
            </UForm>
          </UCard>

          <aside class="min-w-0 space-y-6">
            <UCard class="print-page" :ui="{ body: 'p-5 sm:p-6 lg:p-8' }">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0"><p class="text-xs font-semibold uppercase tracking-wide text-primary">Live preview</p><h2 class="mt-2 break-words text-2xl font-semibold tracking-tight text-highlighted">{{ draft.title || 'Untitled role' }}</h2><p class="mt-2 text-sm text-muted">{{ draft.department || 'Department' }} · {{ draft.location || 'Location' }}</p></div>
                <UBadge color="primary" variant="soft" class="shrink-0">{{ draft.seniority }}</UBadge>
              </div>
              <USeparator class="my-6" />
              <div class="space-y-7">
                <p class="text-sm leading-7 text-toned">{{ draft.summary || 'Your role summary will appear here.' }}</p>
                <div><h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">At a glance</h3><div class="grid grid-cols-2 gap-2"><UCard :ui="{ body: 'p-3' }"><span class="block text-xs text-muted">Type</span><span class="mt-1 block text-sm font-medium text-highlighted">{{ draft.employmentType }}</span></UCard><UCard :ui="{ body: 'p-3' }"><span class="block text-xs text-muted">Arrangement</span><span class="mt-1 block text-sm font-medium text-highlighted">{{ draft.workArrangement }}</span></UCard></div></div>
                <div><h3 class="mb-3 text-sm font-semibold text-highlighted">What you will own</h3><ul class="space-y-2 text-sm text-toned"><li v-for="item in draft.responsibilities" :key="item" class="flex gap-2"><UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-primary" />{{ item || 'Responsibility' }}</li></ul></div>
                <div><h3 class="mb-3 text-sm font-semibold text-highlighted">What you bring</h3><div class="flex flex-wrap gap-2"><UBadge v-for="skill in [...draft.requiredSkills, ...draft.preferredSkills]" :key="skill" color="neutral" variant="outline">{{ skill || 'Skill' }}</UBadge></div></div>
                <div><h3 class="mb-3 text-sm font-semibold text-highlighted">Success looks like</h3><ul class="space-y-2 text-sm text-toned"><li v-for="metric in draft.successMetrics" :key="metric" class="flex gap-2"><UIcon name="i-lucide-arrow-up-right" class="mt-0.5 size-4 shrink-0 text-primary" />{{ metric || 'Success metric' }}</li></ul></div>
              </div>
            </UCard>

            <UAlert class="no-print" color="primary" variant="outline" icon="i-lucide-sparkles" title="Editorial checks">
              <template #description>
                <div class="space-y-3">
                  <p class="text-sm leading-6 text-muted">These lightweight checks help you make the role clearer and more candidate-focused. They do not publish or score the JD.</p>
                  <UAlert v-if="persistenceError" color="error" variant="subtle" :title="persistenceError" />
                  <UAlert v-if="flags.length === 0" color="primary" variant="outline" title="No review flags yet.">Keep the language specific and grounded in the work.</UAlert>
                  <UAlert v-for="flag in flags" :key="flag.title" color="neutral" variant="outline" :title="flag.title">{{ flag.detail }}</UAlert>
                </div>
              </template>
            </UAlert>

            <UCard class="no-print">
              <div class="flex items-center justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-wide text-muted">Developer view</p><h2 class="mt-1 text-base font-semibold text-highlighted">Structured output</h2></div><UButton size="xs" color="neutral" variant="ghost" :aria-expanded="showJson" @click="showJson = !showJson">{{ showJson ? 'Hide' : 'Show' }}</UButton></div>
              <pre v-if="showJson" class="mt-4 max-h-72 overflow-auto rounded-md bg-inverted p-4 text-xs leading-5 text-inverted">{{ JSON.stringify(draft, null, 2) }}</pre>
              <p v-else class="mt-3 text-sm leading-6 text-muted">The editor is JSON-first, so this document can later power preview, scoring and export without parsing rendered text.</p>
            </UCard>
          </aside>
        </div>
      </UContainer>
    </main>
  </div>
</template>
