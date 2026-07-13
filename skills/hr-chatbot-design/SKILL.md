---
name: hr-chatbot-design
description: Help HR technology teams design HR service-delivery chatbots and conversational tools for platforms like Slack and Microsoft Teams. Use when asked to "design an HR chatbot", "build a Slack bot for HR questions", "plan a Teams HR assistant", "write conversation flows for an HR bot", or "decide what an HR bot should and shouldn't handle".
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# HR chatbot design

Design HR service-delivery chatbots and conversational tools for platforms like Slack and Microsoft Teams — scoping what the bot should handle, designing conversation flows, and setting escalation paths to a human.

## Supported tasks

- Scoping what an HR chatbot should and shouldn't handle
- Designing conversation flows for common HR self-service requests
- Writing bot response scripts for FAQs (policy questions, benefits, time off)
- Designing escalation paths from bot to a human HR rep
- Planning intent recognition categories for an HR chatbot
- Integrating chatbot responses with HRIS or knowledge-base data sources
- Designing onboarding flows delivered through a chatbot
- Handling sensitive topics (harassment, mental health, legal questions) with appropriate bot guardrails
- Measuring chatbot deflection rate and resolution quality
- Piloting a chatbot with a limited use case before broader rollout
- Localizing chatbot conversation flows for multi-language workforces
- Iterating on chatbot scripts based on real usage and unresolved queries

## Key prompts

### Scoping the bot

1. "Scope what an HR chatbot for [Slack/Teams] should handle in its first release — which request types are good fits and which aren't."
2. "What HR questions are safe for full bot automation vs. requiring a human in the loop?"
3. "Design intent categories for an HR chatbot covering the most common employee self-service requests."
4. "What tone and personality should the HR chatbot have to feel trustworthy without pretending to be human?"

### Designing conversation flows

1. "Design a conversation flow for an employee asking about [time-off balance / benefits enrollment / policy question] through the bot."
2. "Write bot response scripts for the top 10 most common HR FAQ questions at [company]."
3. "Design an onboarding flow delivered through the chatbot for a new hire's first week."
4. "Write a multi-turn conversation flow that handles follow-up questions without losing context from earlier in the chat."

### Escalation and guardrails

1. "Design escalation logic for when the bot should hand off to a human HR rep rather than attempt to answer."
2. "What guardrails should the bot have around sensitive topics like harassment complaints, mental health, or legal questions?"
3. "Draft a fallback response for when the bot doesn't understand or can't confidently answer a question."
4. "How should the bot handle a question that touches on a legal or compliance-sensitive topic it isn't authorized to answer?"

### Piloting and improving

1. "Design a pilot plan for testing the HR chatbot with [one team/use case] before wider rollout."
2. "What metrics should we track to measure whether the chatbot is actually deflecting HR tickets successfully?"
3. "Review this log of unresolved chatbot queries and recommend script or intent-recognition improvements."
4. "Design a rollout communication plan introducing the chatbot to employees who are skeptical of automated HR support."

## Tips

- Start narrow — a bot that reliably handles five FAQ categories builds more trust than one that vaguely attempts everything and gets things wrong.
- Design explicit escalation paths for anything sensitive (harassment, mental health, legal, pay disputes) — a bot mishandling these erodes trust fast and can create real risk.
- Keep responses grounded in an actual knowledge base or HRIS data, not free-form generation, for anything involving policy or personal data accuracy.
- Track deflection rate alongside resolution quality; a bot that "answers" quickly but incorrectly creates more work than it saves.
- Review real unresolved queries regularly — the gap between what employees actually ask and what the bot was scoped for is where the best improvements come from.
