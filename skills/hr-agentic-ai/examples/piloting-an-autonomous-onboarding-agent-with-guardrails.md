# Piloting an Autonomous Onboarding Agent With Guardrails

## Context

An HR operations team wants to pilot an AI agent that handles new-hire pre-boarding: sending document requests, scheduling IT setup, and answering common first-week questions, without a recruiter manually triggering every step.

## Step 1: Define autonomy boundaries

Sample prompt: "Define the exact boundary of what an onboarding agent may do autonomously (send reminders, schedule tasks) versus what always requires a human HR touch."

Expected response: A boundary list allowing the agent to autonomously send document checklists, calendar invites, and FAQ answers, while requiring human handling for anything involving compensation questions, visa or work-authorization issues, or a new hire expressing hesitation about starting.

## Step 2: Design staged rollout and rollback

Sample prompt: "Design a staged autonomy plan moving a recruiting-screening agent from human-approves-every-action to human-reviews-weekly-samples" (adapted to onboarding) and "Draft a rollback plan for an HR inquiry-resolution agent that starts sending incorrect policy answers."

Expected response: A three-stage plan starting with an HR coordinator approving every agent message for two weeks, moving to spot-checking a daily sample, and finally weekly sampling once error rates stay below an agreed threshold — plus a rollback plan that pauses the agent and reverts to manual outreach if it sends incorrect information twice in a week.

## Step 3: Set transparency and escalation

Sample prompt: "Write an employee disclosure notice explaining that an AI agent may contact them during onboarding" and "List the specific agent actions in an offboarding workflow that must never happen without a named human approver" (adapted to flag when the agent must hand off to a human).

Expected response: A short notice sent with the offer letter explaining that pre-boarding messages come from an AI assistant with a named HR contact for anything the agent can't resolve, plus a hard rule that any message mentioning hesitation, a delayed start date, or a compensation question routes immediately to a human.

## Workflow summary

The team pilots the agent with clear autonomy limits, a staged trust-building rollout with a defined rollback trigger, and upfront transparency so new hires always know how to reach a human.
