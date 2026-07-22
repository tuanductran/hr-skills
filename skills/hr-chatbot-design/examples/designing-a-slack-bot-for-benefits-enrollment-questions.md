# Designing a Slack Bot for Benefits Enrollment Questions

## Context

An HR team is launching a Slack bot to reduce the volume of repetitive benefits questions during a two-week open enrollment window, without giving employees inaccurate plan information.

## Step 1: Scope the intent list

Sample prompt: "Design the intent-recognition category list for a benefits-enrollment chatbot handling questions during open enrollment."

Expected response: A list covering plan comparison questions, enrollment deadline reminders, dependent-eligibility questions, and "how do I change my current elections" — with a note that plan cost calculations and life-event special enrollment questions are excluded from the first release because they require case-specific review.

## Step 2: Build the conversation flow

Sample prompt: "Write the bot's fallback and clarification script for when it recognizes an intent but is missing information it needs from the employee."

Expected response: A script where the bot asks a clarifying follow-up (for example, which plan the employee is comparing) before answering, and a fallback message that says plainly it can't answer and offers a direct link to schedule time with a benefits specialist rather than guessing.

## Step 3: Set escalation rules and plan the audit

Sample prompt: "Write escalation criteria distinguishing a routine PTO-balance question from one that should route straight to a human HR rep" (adapted to benefits) and "Design a script auditing process to review 50 real chatbot transcripts and flag where the bot gave a wrong or incomplete answer."

Expected response: Escalation rules routing any question involving a life event, dependent eligibility dispute, or a dollar-amount claim straight to a human, plus a weekly review of a transcript sample during the enrollment window to catch and fix any confidently wrong answers before they spread.

## Workflow summary

The bot launches with a narrow, well-defined intent scope, clear fallback behavior instead of guessing, and a short weekly audit loop that catches mistakes early during the high-stakes enrollment window.
