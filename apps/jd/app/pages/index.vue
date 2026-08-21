<script setup lang="ts">
import { rolePresets } from '#shared/types/jd'

const selectedPreset = ref('recruiter')
const roleTitle = ref('Senior Recruiter')
const country = ref('US')
const language = ref('en-US')

const preset = computed(() => rolePresets.find((item) => item.id === selectedPreset.value) ?? rolePresets[0]!)

async function startDraft() {
  const params = new URLSearchParams({
    preset: selectedPreset.value,
    title: roleTitle.value,
    country: country.value,
    language: language.value,
  })
  await navigateTo(`/builder?${params.toString()}`)
}
</script>

<template>
  <main class="min-h-screen px-4 py-6 sm:px-8 lg:px-12">
    <div class="mx-auto flex max-w-7xl flex-col gap-16">
      <header class="flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3 text-sm font-semibold text-slate-950">
          <span class="grid size-9 place-items-center rounded-xl bg-blue-600 text-white shadow-sm">JD</span>
          <span>HR Skills <span class="text-slate-400">/</span> JD Builder</span>
        </NuxtLink>
        <div class="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
          <span class="size-2 rounded-full bg-emerald-500" />
          Drafts stay in your browser
        </div>
      </header>

      <section class="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div class="max-w-3xl pt-4 lg:pt-14">
          <UBadge color="primary" variant="soft" size="lg">Structured hiring, made clearer</UBadge>
          <h1 class="mt-6 text-5xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-7xl">
            Build a job description people can trust.
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Start with a role context, shape the work around outcomes, and review every requirement before you export.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span class="flex items-center gap-2"><span class="size-2 rounded-full bg-blue-600" />Role-aware templates</span>
            <span class="flex items-center gap-2"><span class="size-2 rounded-full bg-emerald-500" />Inclusive-language review</span>
            <span class="flex items-center gap-2"><span class="size-2 rounded-full bg-amber-500" />No silent legal claims</span>
          </div>
        </div>

        <UCard class="border-slate-200/80 bg-white/90 shadow-xl shadow-slate-200/50 ring-1 ring-slate-950/5">
          <template #header>
            <div>
              <p class="text-sm font-semibold text-blue-700">Step 1 of 3</p>
              <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Set the role context</h2>
              <p class="mt-2 text-sm leading-6 text-slate-500">We use this to choose useful section defaults. You can change everything later.</p>
            </div>
          </template>

          <div class="space-y-5">
            <UFormField label="Role preset" name="preset">
              <USelect v-model="selectedPreset" :items="rolePresets.map((item) => ({ label: item.label, value: item.id }))" class="w-full" />
            </UFormField>
            <UFormField label="Job title" name="title" required>
              <UInput v-model="roleTitle" placeholder="e.g. Senior Recruiter" class="w-full" />
            </UFormField>
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField label="Country" name="country">
                <USelect v-model="country" :items="[{ label: 'United States', value: 'US' }, { label: 'United Kingdom', value: 'GB' }, { label: 'Germany', value: 'DE' }, { label: 'Vietnam', value: 'VN' }]" class="w-full" />
              </UFormField>
              <UFormField label="Language" name="language">
                <USelect v-model="language" :items="[{ label: 'English (US)', value: 'en-US' }, { label: 'English (UK)', value: 'en-GB' }, { label: 'German', value: 'de-DE' }, { label: 'Vietnamese', value: 'vi-VN' }]" class="w-full" />
              </UFormField>
            </div>
          </div>

          <template #footer>
            <div class="flex items-center justify-between gap-4">
              <p class="hidden text-sm text-slate-500 sm:block">{{ preset.description }}</p>
              <UButton size="lg" trailing-icon="i-lucide-arrow-right" @click="startDraft">Start building</UButton>
            </div>
          </template>
        </UCard>
      </section>
    </div>
  </main>
</template>
