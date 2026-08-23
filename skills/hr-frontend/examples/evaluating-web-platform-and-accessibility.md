# Example: evaluating web-platform and accessibility fundamentals

## Hiring context

A product team is hiring a frontend engineer to maintain a component library used across customer-facing workflows.

## Exercise

Give the candidate a modal dialog requirement with keyboard navigation, loading and error states, responsive behavior, and a slow-network scenario. Ask for the semantic structure, focus behavior, state model, test strategy, and performance considerations.

## Strong evidence

A strong answer starts with native semantics where possible, identifies the accessible name and focus return behavior, and explains how keyboard and assistive-technology users reach every action. The candidate accounts for responsive layout, progressive loading, error recovery, and browser behavior instead of relying on a framework abstraction alone.

The candidate should explain how they would test the behavior with keyboard interaction, browser automation, and representative viewport/network conditions. React or Next.js implementation details may be discussed, but the evaluation should remain grounded in browser and accessibility fundamentals.

## Evaluation prompts

Ask: “What receives focus when the dialog opens and closes?” “Which behavior should be native HTML?” “How do you expose loading and error states?” “What would you test without JavaScript?” “How would you detect a performance regression?”

## Source basis

This exercise synthesizes MDN Web platform guidance and WAI-ARIA Authoring Practices into an original frontend hiring scenario.[1] [2]

## References

[1]: https://developer.mozilla.org/en-US/docs/Web "MDN Web technology for developers"
[2]: https://www.w3.org/WAI/ARIA/apg/ "WAI-ARIA Authoring Practices Guide"
