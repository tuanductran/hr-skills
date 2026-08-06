---
"hr-skills": patch
---

Fixed a polynomial-time regular expression denial-of-service (ReDoS) vulnerability in `analyzeIntent` delimiter parsing (CodeQL alert `js/polynomial-redos`, CWE-1333/400/730). The affected regex is reachable from user-controlled CLI input (`plan`/`execute` intent argv).
