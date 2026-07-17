# Skills Intelligence

## Overview

Skills intelligence is the discipline of understanding what skills exist in your workforce, what skills the business will need, and where the gaps lie — at a level of specificity that is actually useful for decision-making.

Most organizations have an abstract sense that they need to "upskill" or that certain capabilities are lacking. Few have the data infrastructure to know exactly which skills are present, at what proficiency levels, in which roles and locations, and how that maps to business demand. Skills intelligence is the practice of building and maintaining that picture.

## Why Skills Data Is Usually Poor

Before building skills intelligence, it helps to understand why most organizations' skills data is unreliable.

### Self-reported skills are inflated

When employees self-report skills in a profile system, they systematically overstate proficiency. Someone who has attended one Python training course may list Python as a skill. Whether they can independently write production Python code is a different question.

### Skills taxonomies are unstable

The skills that matter change faster than most organizations update their taxonomies. A skills taxonomy built in 2021 may not have adequate granularity in generative AI, LLM integration, or modern data stack capabilities. Stale taxonomies produce data that looks complete but does not capture what the business actually needs.

### Skills data is not maintained

Employees' skills evolve continuously through on-the-job learning, but profile data is typically updated only when an employee is prompted to do so — usually at onboarding and never again. A two-year-old skills profile is usually wrong in multiple dimensions.

### There is no single source of truth

Skills data typically sits in multiple places that are never integrated: HRIS profiles, LMS completion records, performance reviews, ATS candidate data, and LinkedIn profiles maintained independently. Each captures a different and partial view.

## Building a Practical Skills Inventory

A usable skills inventory does not require perfect data. It requires data that is good enough to support the decisions it is meant to inform.

### Define the scope

Start with the skills that matter most for near-term business decisions. If the business is scaling an AI product, start with AI engineering skills. If a compliance obligation requires certain certified expertise, start there. Trying to inventory every skill across the full workforce simultaneously produces a large, unreliable dataset rather than a targeted, actionable one.

### Choose your signal sources

Rather than relying solely on self-reported profiles, triangulate from multiple sources:

- **LMS completion records** — what has been completed, not just what employees claim to know
- **Project and work output metadata** — what tools, technologies, or methods employees have actually applied
- **Performance review language** — qualitative evidence of demonstrated skills from manager assessments
- **Hiring and job requisition data** — what skills the organization has been willing to pay for, as a proxy for organizational priority
- **External benchmarking** — how your workforce skills compare to the external talent pool for critical roles

### Establish proficiency standards

A skill listed without a proficiency level is ambiguous. Define a simple scale:

- **Awareness** — understands the concept, can discuss it
- **Working** — can apply independently on standard tasks
- **Advanced** — can apply on complex, non-routine tasks and guide others
- **Expert** — recognized source of organizational expertise, can advance organizational capability

Simpler is better. A three or four level scale will be applied more consistently than a seven level scale.

## Skills Gap Analysis

A gap analysis compares current supply (what skills exist in the workforce at what proficiency) to future demand (what skills the business needs, when, and at what scale).

### Demand signal sources

- Business strategy and product roadmap (where is the business going that requires new capability?)
- Job requisition data (what are we trying to hire that we cannot find internally?)
- Manager assessments of team capability gaps
- External labor market data (what skills are growing in demand in your industry?)

### Prioritizing gaps

Not all gaps are equal. Prioritize gaps that are:

- Critical to a near-term business priority
- Difficult to hire externally (scarce in the labor market)
- Buildable in a realistic time frame through internal development

A gap that is easily addressed by external hiring at reasonable cost is a sourcing decision, not a development priority. A gap that requires 18 months to develop internally and is business-critical in 12 months is an urgent risk.

## Skills Intelligence Infrastructure

At scale, skills intelligence requires infrastructure beyond spreadsheets.

### Skills taxonomy management

A skills taxonomy is a structured, maintained list of skills organized by domain and level of specificity. It is the vocabulary your skills data is expressed in. It needs an owner and a regular review cycle — at minimum annually, in fast-moving technical domains quarterly.

The taxonomy should be specific enough to be useful (not just "data skills" but "SQL," "dbt," "Python for data analysis") and not so granular that maintaining it is impractical.

### Integration with HR systems

Skills data should connect to your HRIS, LMS, performance management system, and recruiting platform. Without integration, the skills inventory is a point-in-time snapshot that decays immediately.

### Skills decay modeling

Not all skills decay at the same rate. Compliance certifications expire. Technical skills in fast-moving domains become stale within 12-18 months without active application. A skills intelligence system should surface proficiency that has not been applied or updated recently rather than treating all claimed skills as current.
