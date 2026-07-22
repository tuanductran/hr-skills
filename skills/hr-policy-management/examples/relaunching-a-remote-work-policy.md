# Reviewing and relaunching a remote work policy

## Context

A 400-person professional services company introduced a temporary remote work policy during a period of disruption. Two years later, the policy hasn't been formally reviewed, contains contradictory language, doesn't reflect the current hybrid model, and hasn't been acknowledged by 35% of employees. HR needs to review, rewrite, and relaunch the policy before a planned return-to-office initiative.

## Step 1: Audit the existing policy

Sample prompt: "Review this remote work policy for gaps, outdated language, and inconsistency — flag every issue and recommend updates."

Expected response: A structured audit noting:

- Outdated sections: references to "temporary" arrangements that are now permanent
- Gaps: no guidance on home office equipment, data security requirements for remote work, or performance accountability in a remote context
- Contradictions: section 3.1 says "employees may work remotely with manager approval" while section 7.2 says "all employees are expected in the office 3 days per week"
- Missing content: no clear policy on international remote work requests, no process for exceptions, no link to the disciplinary policy for non-compliance

## Step 2: Rewrite the policy

Sample prompt: "Write a hybrid work policy for a 400-person professional services firm covering eligibility, in-office expectations, equipment, data security, and performance accountability."

Expected response: A structured policy with:

- Eligibility: all permanent employees in roles that can be performed remotely; exceptions for client-facing or operational roles specified in the policy appendix
- In-office expectation: minimum 3 days per week at the designated office; team-specific schedules set by department heads within this minimum
- Equipment: company provides laptop and standard peripherals; home internet is the employee's responsibility; expense process for ergonomic equipment
- Data security: work-related data must be accessed via company VPN; personal device use for work requires MDM enrollment
- Performance: remote work is a privilege, not a right; sustained performance issues may result in in-office requirement regardless of general policy

## Step 3: Communicate the update

Sample prompt: "Write manager talking points for explaining the updated hybrid work policy to their teams, including common questions."

Expected response: A one-page briefing for managers covering:

- Key changes from the old policy
- How to handle team members who ask to work fully remote
- What to do when someone can't meet the in-office minimum
- How to escalate exceptions or edge cases
- Common objections and how to respond: "I was told I could work fully remote when I joined," "My commute is three hours," "My team is all remote anyway"

## Step 4: Track acknowledgment

Sample prompt: "Develop a policy acknowledgment workflow for digital signature and tracking — including follow-up for employees who haven't acknowledged."

Expected response:

- All employees receive policy via HRIS or e-signature platform with a 10-business-day deadline
- Automated reminders at day 5 and day 8 for non-responders
- HR reports non-acknowledgment list to HRBPs at day 10
- HRBPs escalate to direct managers; managers are responsible for ensuring completion
- Any employee without acknowledgment after day 20 receives a formal notice from HR

## Workflow summary

Use `hr-policy-management` to audit existing policies for gaps and contradictions before rewriting, create clear and usable policy language, equip managers to communicate changes confidently, and track acknowledgment systematically to close the compliance loop.
