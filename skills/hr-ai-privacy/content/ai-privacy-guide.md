# AI and Employee Data Privacy

## Overview

AI tools in HR process significantly more employee data than traditional HR systems — and in more opaque ways. Predictive models, sentiment analysis tools, monitoring platforms, and generative AI assistants all raise privacy questions that traditional HR data governance frameworks were not designed to address.

HR leaders are increasingly responsible for ensuring that AI deployment in their organizations respects employee privacy rights, meets legal obligations, and maintains the employee trust that is foundational to engagement and retention.

## Privacy Risks Specific to HR AI

### Invisible inference

AI models can infer sensitive information that employees have not disclosed — health conditions from absence patterns, pregnancy from behavior changes, political views from communication metadata, mental health status from productivity data. These inferences may be wrong (and therefore harmful) or right (and therefore a privacy violation).

The privacy risk is not limited to what the organization knows about employees — it extends to what it can infer.

### Data repurposing

Data collected for one purpose is increasingly used for another. Engagement survey responses collected to improve the workplace can be input to an attrition prediction model. Performance data collected for development can feed AI-assisted termination decisions. Employees provided consent (explicit or implicit) for the original purpose, not the secondary use.

### Third-party data exposure

When HR uses external AI vendors, employee data is processed by third parties with their own data handling practices, security postures, and retention policies. Vendor data processing is an extension of the employer's privacy obligations — the organization cannot contract away its legal responsibilities.

### Algorithmic transparency gap

Employees affected by AI-influenced decisions (hiring, promotion, performance, termination) often do not know that AI was used, what data was input, how the model weighted different factors, or how to challenge the outcome. This transparency gap is increasingly a legal issue as well as an ethical one.

## Privacy Impact Assessment for HR AI

Before deploying any AI tool that processes employee data, conduct a Privacy Impact Assessment (PIA) — also called a Data Protection Impact Assessment (DPIA) under GDPR.

### PIA components

**Data inventory:** What employee data will the AI system collect, process, or generate? Include direct input data and any data inferred by the model.

**Purpose specification:** What specific business purpose justifies this data processing? Is AI processing necessary to achieve the purpose, or could a less privacy-intrusive approach work?

**Legal basis:** What is the legal basis for processing this data? In Vietnam (Decree 13/2023), the EU, and other jurisdictions, processing employee data requires a defined legal basis — typically consent or legitimate interest.

**Third-party data flows:** Who else will process this data? What data processing agreements are in place?

**Risk assessment:** What are the privacy risks to employees? What is the likelihood and severity of harm if those risks materialize?

**Mitigation measures:** What technical and organizational controls reduce the identified risks?

**Employee disclosure:** What will employees be told about this AI system and the data it processes?

Conduct PIAs before deployment, not after. A PIA that arrives after a system is live is a documentation exercise, not a risk management tool.

## Employee Consent and Transparency

### What employees have a right to know

At minimum, employees should know:
- That AI tools are used in HR processes that affect them
- What data those tools process
- What decisions or recommendations the AI influences
- Whether and how they can opt out or request human review
- Who to contact with questions or concerns

This is both an ethical standard and, increasingly, a legal requirement. The EU AI Act explicitly requires transparency for AI used in employment contexts. Emerging regulations in other jurisdictions follow similar logic.

### Consent limitations in employment relationships

True informed consent from employees is often constrained by the employment relationship — employees who fear retaliation for declining data processing may consent to avoid the appearance of non-cooperation. HR AI programs that rely entirely on employee consent as the legal basis for sensitive processing should be reviewed by legal counsel.

In many jurisdictions, legitimate interest (the employer's genuine business need) is a more defensible legal basis for operational AI use, subject to a balancing test against employee interests.

## Data Minimization in HR AI

The principle of data minimization — collecting and processing only the data necessary for the specified purpose — is a foundational privacy principle that AI systems frequently violate by design.

### Applying data minimization to HR AI

- **Feature selection discipline:** When building or configuring AI models, evaluate each data input: is this variable genuinely predictive for the specified purpose? Can the purpose be achieved with less sensitive data?
- **Retention limits:** Define how long AI model outputs, training data, and audit logs are retained. Data retained indefinitely is data that can cause harm indefinitely.
- **Access controls:** Who in the organization can see AI model outputs? Attrition risk scores, for example, should not be broadly accessible — they create potential for discriminatory treatment if high-risk employees are identified and deprioritized for development.

## Regulatory Compliance

### Vietnam: Personal Data Protection Decree (Decree 13/2023)

Vietnam's Decree 13/2023 on Personal Data Protection establishes data subject rights and data controller obligations. Key provisions relevant to HR AI:
- Employees (as data subjects) have rights to access, correction, and deletion of their personal data
- Processing sensitive personal data (health, biometrics, beliefs) requires explicit consent
- Data processing agreements with third parties (AI vendors) are required
- Cross-border data transfer restrictions apply to data processed by overseas AI systems

### GDPR (for EU employees or global organizations)

GDPR establishes specific obligations for automated decision-making: where AI makes decisions that significantly affect employees without meaningful human review, employees have the right to explanation and human review. HR AI systems used in hiring, performance, or termination contexts are high-risk under GDPR.

### Practical compliance approach

Build compliance requirements into vendor procurement: require vendors to provide data processing agreements, disclose subprocessors, answer PIA questions, and demonstrate compliance with relevant regulations. Do not assume vendor compliance without documentation.
