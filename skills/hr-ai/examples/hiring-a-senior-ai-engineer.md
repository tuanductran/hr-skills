# Hiring a Senior AI Engineer

## Context

You are an HR Manager at a product company building an AI-powered customer support platform. The CTO wants to hire **1 Senior AI Engineer** to own the LLM integration layer, design a RAG system over the company's knowledge base, and lay the foundation for autonomous support agents. You have no technical background and need end-to-end support throughout the hiring process.

## Step 1 — Translating Technical Requirements from the CTO

**Sample prompt:**

> "Our CTO says we need a Senior AI Engineer who can build a RAG system, work with LLM APIs, and eventually build AI agents. I don't understand any of this. What do we actually need?"

**Expected skill response:**

- **LLM APIs** = the company will not build its own AI model — instead, it will connect to existing AI models (like OpenAI or Anthropic) via API. The engineer needs to know how to integrate these APIs into a real product reliably and efficiently
- **RAG (Retrieval-Augmented Generation)** = instead of the AI making things up, the system first searches your company's internal knowledge base for relevant information, then passes that context to the AI model to generate an accurate answer — think of it as giving the AI a cheat sheet before it responds
- **AI agents** = systems where the AI can not only answer questions but take actions — checking order status, escalating a ticket, triggering a refund — by calling tools and APIs autonomously based on the user's request
- The CTO is looking for someone who has built these systems in production, not just prototyped them in a demo or notebook
- This is an **AI Engineer** role, not a Data Scientist or ML Researcher — the focus is building product systems, not training models

## Step 2 — Writing the Job Description

**Sample prompt:**

> "Write a JD for a Senior AI Engineer at a product company building an AI customer support platform. Must have LLM API experience, RAG system design, and ideally agentic AI experience. 10-person team."

**Sample JD generated:**

```txt
Senior AI Engineer — AI Customer Support Platform

About us:
[Company] is building the next generation of AI-powered customer support
for e-commerce businesses. Our 10-person engineering team ships fast and
treats AI quality and reliability as a core product responsibility.

What you will do:
- Own the design and development of our RAG pipeline over the company
  knowledge base and product catalog
- Integrate and optimize LLM APIs (OpenAI, Anthropic) into production
  support workflows
- Build and iterate on AI agent capabilities — tool use, multi-step
  reasoning, and automated ticket resolution
- Design evaluation frameworks to measure AI response quality and safety
- Establish AI observability practices and monitor production model behavior
- Collaborate with product and backend teams to embed AI into user workflows

Requirements:
- 4+ years of engineering experience, with 2+ years building production
  AI or LLM-based systems
- Strong Python skills and backend engineering fundamentals
- Hands-on experience with LLM APIs and prompt engineering at system level
- Experience designing and deploying RAG pipelines
- Familiarity with vector databases (Pinecone, Weaviate, ChromaDB, or similar)
- Understanding of AI evaluation and observability practices

Nice to have:
- Experience building agentic AI systems with tool use and multi-step workflows
- Familiarity with orchestration frameworks (LangChain, LlamaIndex)
- Background in customer support, e-commerce, or conversational AI products
- Experience with Langfuse, Weights and Biases, or similar AI observability tools

Compensation: Competitive + equity

Not a fit if:
- Your AI experience is limited to chatbot demos or tutorial notebooks
- You have not shipped an AI feature to real end users in production
- You are looking for a pure research or model training role
```

**Skill note:**

> ⚠️ Do not combine AI Engineer + ML Researcher + Data Scientist + Data Engineer + Backend Engineer + DevOps into a single role. These are distinct career tracks. A JD that demands all of them simultaneously signals the company does not understand what it actually needs — and will be ignored by strong candidates.

## Step 3 — Building the Interview Question Set

**Sample prompt:**

> "Create an interview question set for a Senior AI Engineer covering both technical depth and behavioral signals. I need to understand what good answers sound like without a technical background."

**Generated question set:**

### Technical Questions (for the technical interviewer)

| # | Question | What it tests | What a strong answer looks like |
|---|---------|---------------|---------------------------------|
| 1 | "Walk me through how you would design a RAG pipeline for a customer support product with 50,000 knowledge base articles." | System design depth for AI | Discusses chunking strategy, embedding model selection, retrieval tuning, re-ranking, and response quality evaluation — not just "store in a vector DB and query it" |
| 2 | "How do you evaluate whether an LLM-powered feature is working well in production?" | AI evaluation maturity | Mentions both automated metrics (RAGAS, LLM-as-judge) and human evaluation, discusses handling hallucinations, traces individual failures |
| 3 | "What are the trade-offs between fine-tuning a model versus using RAG for a domain-specific application?" | Architecture trade-off thinking | Explains fine-tuning cost, data requirements, and staleness vs RAG flexibility, latency, and updatability — chooses based on context |
| 4 | "How would you build an AI agent that can resolve a support ticket by calling external tools like order management APIs?" | Agentic AI design experience | Discusses tool definitions, reasoning loops, failure handling, guardrails, and how to avoid unintended actions |
| 5 | "How do you handle LLM output that is inconsistent or hallucinating in a production system?" | Production reliability thinking | Mentions structured outputs, fallback strategies, confidence thresholds, human-in-the-loop escalation, and observability logging |
| 6 | "What is your approach to managing LLM API costs at scale?" | Operational maturity | Discusses caching, prompt compression, model tier selection (not always using the most expensive model), batching strategies |

### Behavioral Questions (HR can ask directly)

| # | Question | What it tests |
|---|---------|--------------|
| 1 | "Tell me about an AI feature you shipped that did not work as expected in production. What happened and what did you change?" | Production ownership and learning from failure |
| 2 | "How do you explain AI system limitations or failure modes to a non-technical product manager?" | Communication and cross-functional collaboration |
| 3 | "Have you ever pushed back on a request to add an AI feature because the use case was not a good fit? How did you handle it?" | Technical judgment and stakeholder management |
| 4 | "How do you stay current in an AI landscape that changes every few weeks?" | Self-directed learning and signal vs noise filtering |

## Step 4 — Evaluating a Portfolio or GitHub Profile

**Sample prompt:**

> "A candidate shared their GitHub and a few demos of AI apps they built. How do I assess whether this shows real depth or just surface-level AI work?"

**Portfolio evaluation checklist generated by skill:**

### ✅ Strong signals

- [ ] Projects show end-to-end system design — not just a notebook or a simple API wrapper
- [ ] RAG pipeline or LLM integration includes retrieval, evaluation, and observability — not just generation
- [ ] README explains architecture decisions and trade-offs, not just what the app does
- [ ] Evidence of handling failure cases — error handling, fallbacks, guardrails
- [ ] Code shows prompt management as a system concern, not just hardcoded strings
- [ ] Has shipped or deployed something to real users, even at small scale
- [ ] Evaluation framework exists — even basic logging of input/output pairs shows maturity
- [ ] Uses vector databases or semantic search with intention — not just following a tutorial

### ⚠️ Worth asking about

- All projects are chatbot demos with no retrieval or tool use complexity
- README focuses on "what it does" but never explains "why it was designed this way"
- LLM integration is a thin wrapper with no error handling, cost management, or evaluation
- The project was built over a weekend for a hackathon with no iteration evidence

### ❌ Concerning signals

- Every project is a GPT wrapper with no meaningful system design
- No evidence of production deployment or real user feedback
- Overuse of AI buzzwords in README but no implementation depth behind them
- No understanding of evaluation — candidate cannot explain how they know the system works well

## Step 5 — Post-Interview Scorecard

**Sample prompt:**

> "Create a scorecard to evaluate a Senior AI Engineer after the full interview loop."

**Generated scorecard:**

```txt
SENIOR AI ENGINEER — INTERVIEW SCORECARD
Candidate: _____________________ | Date: _____________
Interviewer: ___________________|

SECTION 1: TECHNICAL SKILLS (40 points)
─────────────────────────────────────────
[ /10] LLM System Design
       1–3: Knows APIs but no system architecture thinking
       4–6: Designs functional LLM pipelines with retrieval and prompt management
       7–10: Production-grade design with evaluation, observability, cost management

[ /10] RAG and Retrieval Systems
       1–3: Aware of the concept, no hands-on depth
       4–6: Has built a RAG pipeline, understands chunking and retrieval tuning
       7–10: Deep understanding of retrieval quality, re-ranking, evaluation, scale

[ /10] AI Evaluation and Observability
       1–3: No structured approach to measuring AI quality
       4–6: Uses metrics or LLM-as-judge, tracks failure cases
       7–10: Owns evaluation framework, ties AI quality to product metrics

[ /10] Agentic AI and Orchestration
       1–3: No experience with tool use or multi-step reasoning
       4–6: Has built basic agentic flows with external tool calls
       7–10: Designs reliable, safe, production-grade agentic systems

SECTION 2: PRODUCTION AI EXPERIENCE (20 points)
──────────────────────────────────────────────────
[ /10] Real deployment to end users (not just demos or notebooks)
[ /5]  Handling AI failure modes and hallucination in production
[ /5]  LLM cost and latency management at scale

SECTION 3: SYSTEM AND PRODUCT THINKING (20 points)
───────────────────────────────────────────────────
[ /10] Ability to connect AI architecture to product outcomes
[ /5]  Trade-off reasoning (fine-tune vs RAG, model tiers, latency vs quality)
[ /5]  Responsible AI awareness (safety, bias, guardrails)

SECTION 4: COLLABORATION AND LEADERSHIP (20 points)
───────────────────────────────────────────────────
[ /10] Cross-functional communication with product and backend teams
[ /5]  Mentoring or knowledge-sharing on AI practices
[ /5]  Handling ambiguity and iterating under uncertainty

TOTAL: ____/100

HIRING THRESHOLDS:
 85–100:  Strong Hire
 70–84:   Hire (with a clear onboarding plan)
 55–69:   Needs discussion — flag specific gaps
 Below 55: No Hire

NOTES:
_________________________________________________
_________________________________________________
```

## Step 6 — Understanding Technical Answers Without Coding Knowledge

**Sample prompt:**

> "A candidate said: 'I built a multi-agent system using LangGraph where each agent handles a different support intent, with a router agent that classifies and dispatches the task, and all outputs go through an evaluation layer before being shown to the user.' Is this a strong answer?"

**Skill explanation:**

- **Multi-agent system** = instead of one AI doing everything, multiple specialized AI agents each handle a specific type of task (for example, one for billing questions, one for shipping, one for returns) — more maintainable and easier to improve independently
- **Router agent** = an AI that reads the user's message first and decides which specialist agent should handle it — this is a sign of thoughtful system design, not just a single prompt doing all the work
- **LangGraph** = a framework for building structured, controllable AI agent workflows — using a named tool rather than building everything from scratch shows awareness of the ecosystem
- **Evaluation layer before showing output** = the candidate does not blindly show whatever the AI generates — they added a quality check step, which shows production maturity and responsibility
- **Assessment: Strong signal** — this answer demonstrates systems thinking, production awareness, and responsible AI practices. It is significantly above the level of someone who has only built demo chatbots.

## Step 7 — Distinguishing AI Role Types

**Sample prompt:**

> "Our CTO mentioned we might need either an 'AI Engineer' or an 'ML Engineer.' What is the difference and how does it change who I look for?"

**Skill explanation:**

| Dimension | AI Engineer | ML Engineer |
|-----------|------------|-------------|
| Primary focus | Building products and systems using AI APIs and LLMs | Training, optimizing, and deploying machine learning models |
| Day-to-day | RAG pipelines, LLM integration, agent workflows, evaluation | Model training, feature engineering, ML pipelines, inference optimization |
| Output | AI-powered product features | Trained models and ML systems |
| Screening signal | System design, LLM API depth, evaluation practices | ML fundamentals, model optimization, data pipeline experience |
| JD keywords | LangChain, RAG, vector databases, LLM APIs, agents | PyTorch, model training, MLflow, feature stores, inference |
| When to hire | You are building AI-powered product features using existing models | You need custom models trained on your own data |

> If your product uses OpenAI or Anthropic APIs and needs smart workflows built around them — hire an **AI Engineer**. If your product needs proprietary models trained on your own data — hire an **ML Engineer**. Most product companies building AI features with existing models need the former, not the latter.

## Full Hiring Workflow Summary

```txt
Define AI role type clearly (AI Eng vs ML Eng vs Applied AI)
                    ↓
Write a focused JD with realistic scope
                    ↓
CV screening: look for production AI systems, not just demos
                    ↓
Phone screen: behavioral questions + one system design scenario
                    ↓
Technical interview (AI system design + evaluation thinking)
                    ↓
Take-home or live coding: build or extend a small RAG or agent task
                    ↓
HR debrief using scorecard
                    ↓
Offer / No Offer decision
```

### Common HR Mistakes When Hiring AI Engineers

| Mistake | How to avoid it |
|---------|----------------|
| Treating impressive demos as production experience | Always ask: "Has this been used by real users in production?" |
| Confusing Data Scientist with AI Engineer | Use the role comparison table — these are different tracks with different skill sets |
| Listing "ChatGPT experience" as a hiring requirement | This is end-user knowledge, not engineering skill — it is not a meaningful signal |
| Expecting one engineer to do ML research, AI engineering, data engineering, and DevOps | Each of these is a separate career track — scope the role to one primary focus |
| Dismissing candidates without ML degrees | Many strong AI engineers are self-taught or came from software engineering backgrounds |
| Not testing evaluation thinking | An AI engineer who cannot explain how they measure quality is a significant risk in production |
| Over-indexing on trending framework names | LangChain, LlamaIndex, and similar tools change rapidly — prioritize system thinking over specific tooling |
