# HR Chatbot Design

## Overview

An HR chatbot handles routine employee and manager inquiries through conversational interfaces — answering policy questions, guiding employees through processes, checking leave balances, and routing complex requests to the right HR resource. Done well, it reduces HR response time from hours to seconds for routine questions and frees HR staff for complex work. Done poorly, it frustrates employees with unhelpful responses and damages trust in HR technology broadly.

## Scoping the Bot

Start narrowly. A chatbot attempting to cover all HR topics is worse at all of them than one focused on a specific, high-volume domain.

The most successful first HR chatbots are scoped to:
- **Leave and time-off inquiries:** Balance checks, policy questions, how to submit requests
- **Benefits FAQ:** Enrollment deadlines, coverage questions, how to add dependents
- **Onboarding guidance:** New hire checklist status, process navigation, contact routing
- **IT and access requests:** How to request new software, report an issue, reset a password (through integration)

Each scope requires specific content, integration, and testing. Expand scope only after the initial scope is working well.

## Conversation Flow Design

### Intent mapping

Map the questions employees actually ask — not the topics HR thinks they ask about. Pull from email and ticket logs, front-desk query logs, and HRBPs' recollections of common questions.

For each intent (question type), define:
- The trigger phrases employees use to express this need
- The ideal response (content)
- The conditions that create variation in the response (e.g., leave balance varies by employee)
- The escalation condition — when does this intent require a human?

### Response design

Chatbot responses should be:
- **Short:** 3-5 sentences maximum for most answers. Mobile-first design.
- **Actionable:** Where action is available (link to portal, button to submit request), surface it in the response
- **Honest about limitations:** "I can't answer that specific question, but here is who can" is better than a generic response that doesn't help

### Escalation design — the most critical element

Every chatbot conversation path must have a clear, easy escalation to a human. The conditions requiring escalation:
- Sensitive topics (harassment, mental health, disciplinary situations)
- Complex cases the bot cannot resolve
- Employee explicitly requests a human
- Any response where the bot's confidence falls below a defined threshold

The escalation should be immediate and warm — routing to a named HR contact with context about the conversation, not dropping the employee into a generic queue and starting over.

## Testing Before Launch

### Coverage testing

For each mapped intent, test with 20-30 variations of how employees might phrase the question. Identify intents with poor recognition rates and improve them before launch.

### Edge case testing

Test the conditions the bot will get wrong — questions from multiple categories in one message, questions that span policy variations, questions about sensitive topics, and deliberately adversarial inputs.

### User acceptance testing

Have a sample of employees from the target population test the bot before launch. Their natural language patterns will reveal gaps that internal testing misses. Pay attention to where testers express frustration — these are the failure points that will produce negative word of mouth at launch.

## Post-Launch Improvement

Review chat logs weekly in the first month after launch. The most important signal: unresolved conversations where the employee gave up or explicitly expressed frustration. These reveal the gaps that need immediate content or flow improvement.

Track resolution rate (conversations resolved without human escalation) and satisfaction rating (post-conversation rating where implemented). Both should improve over the first 90 days as content gaps are closed.
