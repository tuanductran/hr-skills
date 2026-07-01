# Hiring AI Engineers through GitHub and LinkedIn

## Context

You are a Technical Recruiter at an AI-native startup hiring **1 AI Engineer** to build RAG pipelines and LLM-integrated features. You've been told to source specifically through GitHub, since strong AI engineers in this space are often more visible through open-source contributions and personal projects than through polished LinkedIn profiles. You don't have a coding background and need help evaluating what you find and connecting GitHub signals to LinkedIn outreach.

## Step 1 — Why GitHub Matters for This Role

**Sample prompt:**

> "Why would GitHub be a better sourcing channel than LinkedIn alone for an AI Engineer role?"

**Expected skill response:**

- GitHub shows *evidence* of skill — actual code, project structure, and decision-making — rather than self-reported skills on a resume or profile
- For AI engineering specifically, many strong candidates demonstrate depth through side projects, open-source contributions to AI tooling (LangChain, LlamaIndex, vector DB clients), or public experiments — often before that depth shows up clearly in a job title
- GitHub activity reveals things a resume can't: code quality, consistency of contribution over time, how someone documents their work, and whether they've actually shipped something versus just followed a tutorial
- The recommended approach is not "GitHub instead of LinkedIn" but **GitHub to find and validate signal, LinkedIn to reach out and hire** — the two channels work together

## Step 2 — Sourcing Strategies on GitHub

**Sample prompt:**

> "How do I actually search GitHub to find AI engineers with RAG and LLM integration experience?"

**Expected skill response:**

| Strategy | How to use it |
|---|---|
| Language + topic search | `language:python topic:rag` or `language:python topic:llm` in GitHub's search |
| Repository search for domain terms | Search repo descriptions/READMEs for "RAG," "vector database," "LLM agent," "retrieval augmented" |
| Contributor lists on relevant open-source projects | Check contributors to LangChain, LlamaIndex, or vector DB client libraries (Pinecone, Weaviate, ChromaDB) |
| Trending repositories in the AI tooling space | Periodically check GitHub Trending filtered to Python/AI to spot active builders early |
| Follower/following graphs | Once you find one strong profile, check who they follow/are followed by — often clusters around shared communities |

**Checklist:**

- [ ] Search both repository content and contributor activity, not just usernames/bios
- [ ] Note location filters if relevant to your hiring geography (GitHub location data is self-reported and often incomplete — treat as a soft signal only)
- [ ] Save promising profiles into a tracking sheet with the specific project/signal that caught your attention

## Step 3 — Evaluating a GitHub Profile Without a Technical Background

**Sample prompt:**

> "I found a GitHub profile with several AI projects. I don't code — how do I tell if this shows real depth?"

**Expected skill response — evaluation checklist:**

### ✅ Strong signals

- [ ] Projects show a full system, not just a single script (multiple files, clear folder structure, not just one `app.py`)
- [ ] README explains *why* something was built a certain way, not just what it does
- [ ] Commit history shows sustained activity over time (weeks/months), not a single burst then abandonment
- [ ] Evidence of testing, error handling, or evaluation — folders/files named things like `tests/`, `eval/`, or mentions of evaluation in the README
- [ ] Contributions to established open-source projects (not just personal repos) — this is validated by other maintainers, which is a stronger signal than self-directed work alone

### ⚠️ Worth asking about directly

- Projects look complete but have no commit history detail (e.g., one giant initial commit) — could indicate the code was copied/adapted rather than built incrementally
- README is polished and marketing-like but light on technical explanation
- All projects are near-identical "chatbot wrapper" patterns with no variation in approach

### ❌ Concerning signals

- No original repositories, only forks with no meaningful changes
- READMEs full of AI buzzwords with no working code behind them
- All activity is a single weekend burst with no return — may indicate a one-off tutorial follow-along rather than genuine ongoing interest

> **HR note:** You are not expected to read the code itself. You are pattern-matching for *signals of depth and consistency* — sustained activity, explained decisions, and real-world completeness — and flagging genuinely uncertain cases for your technical interviewer to assess directly.

## Step 4 — README Quality as a Signal

**Sample prompt:**

> "What does a genuinely good README actually look like versus a weak one?"

**Expected skill response — comparison:**

| Weak README | Strong README |
|---|---|
| "This is a RAG chatbot I built. Uses OpenAI API." | Explains the problem being solved, the architecture (retrieval → context injection → generation), and specific design choices and trade-offs made |
| No setup instructions | Clear setup, usage instructions, and example output |
| No mention of limitations | Honest section on known limitations or what they'd improve next |
| Copy-pasted tutorial boilerplate | Original voice, specific to their actual implementation choices |

**HR note:** A candidate who documents limitations and trade-offs honestly is showing the same production-maturity mindset that matters in the actual job — this is a meaningfully positive signal, not a red flag.

## Step 5 — Connecting GitHub Signal to LinkedIn Outreach

**Sample prompt:**

> "I found a strong GitHub profile but no LinkedIn is linked. How do I find and reach out to this person?"

**Expected skill response:**

- Check the GitHub profile bio/website field — many developers link a personal site or LinkedIn there directly
- Search LinkedIn using the person's name plus a company/location detail found on GitHub (be cautious here — verify you have the right person before messaging, especially with common names)
- If no LinkedIn can be confidently identified, some GitHub profiles list a public email — a respectful, specific email outreach referencing their actual project is an acceptable alternative, but should meet the same personalization bar as any other channel
- Once found, connect the two data points directly in your outreach — referencing their actual project is far stronger than a generic message

**Sample outreach referencing a GitHub project:**

> *"Hi [Name] — came across your [project name] repo, particularly the retrieval re-ranking approach in [specific file/README detail]. We're building something similar in production at [Company] — a RAG system over [context]. Would love to connect and share more if you're open to it."*
> ⚠️ **Warning:** Never claim to have reviewed code in more depth than you actually did. If you're a non-technical recruiter referencing a GitHub project, keep the reference to what you can honestly describe (e.g., "I saw the project focuses on X") rather than fabricating technical detail — candidates in this space will notice and it damages credibility immediately.

## Step 6 — Validating Claimed Experience

**Sample prompt:**

> "A candidate's LinkedIn says '3 years of production LLM experience' but their GitHub shows mostly small personal projects. How do I reconcile this?"

**Expected skill response:**

- This is not automatically a red flag — production work at a company is very often private/closed-source and won't appear on a personal GitHub at all. Absence of public repos proving a claim isn't evidence against it
- Use GitHub as *supporting* signal, not the sole source of truth — a thin public GitHub with a credible work history and strong interview performance can still represent a strong candidate
- The right move is to ask directly and specifically in screening rather than to silently discount the candidate:
  - *"I noticed your public projects are mostly smaller personal work — can you walk me through what the production LLM systems at [current company] involved that wouldn't be visible publicly?"*
- Flag this as a specific technical-interview probe point rather than a screening disqualifier

## Step 7 — Avoiding False Signals

**Sample prompt:**

> "What are common ways GitHub activity can be misleading, and how do I avoid over- or under-valuing a candidate based on it?"

**Expected skill response:**

| False signal risk | Why it's misleading | How to avoid it |
|---|---|---|
| High commit count | Can be inflated by trivial commits (formatting, typo fixes) rather than real work | Look at commit *content* and file diffs' substance, not just count |
| Green contribution graph | Shows activity frequency, not quality — someone could commit daily to trivial changes | Weight actual project depth over graph density |
| Forked/starred popular repos | Doesn't indicate the person wrote or deeply understands that code | Focus on original repositories and actual authored contributions |
| No public activity | Doesn't mean no skill — many strong engineers only do private/work-related coding | Treat GitHub as one signal among several, not a gate |
| Trendy framework usage | Using LangChain/LlamaIndex doesn't by itself indicate deep understanding | Ask evaluation/architecture questions in interview regardless of tooling used |

## Full Workflow Summary

```text
Define sourcing brief (skills, domain, seniority)
                    ↓
Search GitHub via language/topic filters and open-source contributor lists
                    ↓
Evaluate profiles for depth signals (sustained activity, explained decisions, tests)
                    ↓
Cross-reference README quality as a proxy for engineering maturity
                    ↓
Connect GitHub identity to LinkedIn (or public email) for outreach
                    ↓
Reference specific project details in personalized outreach
                    ↓
Validate claimed experience directly in screening rather than assuming from public activity alone
                    ↓
Weigh GitHub as one signal among several — not a sole gate
```

### Common Mistakes When Sourcing AI Engineers via GitHub

| Mistake | Fix |
|---|---|
| Treating empty/private GitHub as a red flag | Ask directly in screening instead of discounting silently |
| Judging by commit count or green graph alone | Focus on actual project depth and explained decisions |
| Fabricating technical detail in outreach to sound credible | Reference only what you can honestly describe |
| Ignoring GitHub entirely and relying only on LinkedIn/resume | Use GitHub as validating evidence alongside other channels |
| Assuming trendy framework usage equals deep skill | Test architecture and evaluation thinking directly in interviews |
