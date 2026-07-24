# Building an HR operations calendar

## Context

A People Ops team of four at a 400-person SaaS company manages all HR coordination across recruiting, onboarding, performance reviews, benefits enrollment, and compliance — with no shared tracking system. Each coordinator maintains their own spreadsheet, deadlines are missed, and the HR director has no visibility into what is open or at risk. The team needs a unified quarterly HR operations calendar and coordination system.

## Step 1: Map all recurring HR activities and their owners

Sample prompt: "Build a quarterly HR operations calendar for a 400-person company that aligns recruiting cycles, performance review windows, benefits open enrollment, compliance deadlines, and manager training into a single shared view."

Expected response:

| Month | Activity | Owner | Deadline |
|---|---|---|---|
| January | Q1 performance review launch | HRBP | Jan 10 |
| February | Manager calibration sessions | HRBP | Feb 15 |
| March | Q1 compliance training completion | HR Coordinator | Mar 31 |
| April | Benefits broker renewal kickoff | HR Coordinator | Apr 1 |
| July | Mid-year check-in reminder campaign | HR Coordinator | Jul 15 |
| October | Open enrollment communications | HR Coordinator | Oct 1 |
| November | Open enrollment closes | Benefits Admin | Nov 15 |
| December | Year-end compliance audit prep | HR Coordinator | Dec 1 |

Recurring weekly: new hire onboarding sessions, interview scheduling, offboarding processing.

## Step 2: Build the process documentation standard

Sample prompt: "Build a template for documenting any HR process so a coordinator can follow it without institutional knowledge — including trigger, steps, owner, tools used, and escalation path."

Expected response: A process documentation template containing:

- **Process name and trigger**: what event or date starts this process
- **Step-by-step instructions**: numbered, specific, and tool-referenced (for example, "Log into Workday > navigate to New Hire > complete fields A, B, C")
- **Owner per step**: which role or person is responsible
- **Estimated time per step**: so coordinators can plan capacity
- **Escalation path**: who to contact if a step is blocked or unclear
- **Completion confirmation**: how the coordinator confirms the process is done and how it is recorded

## Step 3: Design the weekly status reporting cadence

Sample prompt: "Write a weekly HR operations status report template that surfaces open items, upcoming deadlines, blockers, and completed tasks for the HR director in under five minutes of reading."

Expected response: A one-page weekly status template with four sections: (1) Completed this week — bullet list of closed items; (2) In progress — open tasks with owner and expected completion; (3) Upcoming deadlines in the next 14 days — sorted by date; (4) Blockers requiring HR director input or escalation — named specifically with the ask.

## Step 4: Coordinate a cross-functional program rollout

Sample prompt: "How do we coordinate a company-wide program rollout across multiple locations with different time zones and HR contacts?"

Expected response: Assign a single HR coordinator as the program owner with authority to follow up across all locations. Build a rollout tracker (owner, location, status, deadline) visible to all HR team members. Send location-specific kickoff communications with local deadlines adjusted for time zone. Set a standing weekly check-in during the rollout window to surface blockers before they compound into missed deadlines.

## Workflow summary

Use `hr-coordination` to build the process infrastructure, calendar visibility, and cross-team coordination discipline that prevents HR operations from depending on institutional knowledge held by any single person.
