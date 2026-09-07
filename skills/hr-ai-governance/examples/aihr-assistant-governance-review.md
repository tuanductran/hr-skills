# Governance review for an HR assistant

## Scenario

An HR team wants to introduce an AI assistant that drafts answers to policy questions, summarizes employee-provided information, and suggests next steps to HR staff. The assistant must not make hiring, promotion, compensation, performance, or termination decisions.

## Step 1: Define the boundary

The owner writes a one-sentence purpose statement: “The assistant helps HR staff find and draft responses from approved policy sources.” The register marks the tool as administrative assistance and decision support, not automated decision-making. It lists prohibited inputs and outputs, including requests to rank employees, infer protected characteristics, diagnose health conditions, or recommend employment outcomes.

## Step 2: Map data and controls

The review maps prompts, uploaded documents, generated answers, logs, and vendor telemetry. The team configures approved sources, role-based access, retention limits, redaction for unnecessary identifiers, and a deletion route. The vendor contract and settings are reviewed for training reuse, subprocessors, cross-border transfer, and breach notification.

## Step 3: Design human review

Every answer that could influence an employee receives a named HR reviewer. The interface displays source links and uncertainty notes, and the reviewer must edit or reject unsupported claims. A sample of routine answers is audited weekly. Override reasons and incidents are recorded so that rubber-stamping, recurring misinformation, and policy gaps can be detected.

## Step 4: Pilot and communicate

The team pilots the assistant with synthetic and redacted cases, compares response quality with a documented baseline, and checks performance across languages and accessibility needs. Employees are told what the assistant does, what it does not do, what information should not be entered, and how to request human help or challenge an answer.

## Step 5: Decision record

The final record includes the purpose, prohibited uses, data map, vendor review, pilot results, known limitations, reviewer protocol, monitoring indicators, incident route, owner, approval date, and next review date. The assistant is paused if it begins producing unsupported policy claims, exposes restricted information, or is used as an undisclosed employment decision tool.

## Expected output

The deliverable is a short approved-use policy, a data-flow and vendor checklist, a human-review operating procedure, an employee notice, and a monitoring log. This workflow synthesizes AIHR’s public guidance on AI in HR and data privacy and ethics; it does not replace legal, works-council, security, or privacy review.
