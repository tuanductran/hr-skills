# Web platform and accessibility signals for frontend hiring

Frontend hiring should assess how a candidate reasons about the browser platform, not only how quickly they can assemble a component. A useful review connects semantic HTML, CSS layout, JavaScript behavior, HTTP/resource loading, performance, and accessibility into one user-facing system.

## What to assess

| Signal | Evidence to look for |
| --- | --- |
| Platform fundamentals | The candidate can explain browser events, DOM behavior, HTTP requests, caching, and progressive enhancement. |
| Semantic implementation | The candidate chooses native elements and meaningful structure before adding custom interaction code. |
| Responsive behavior | The candidate accounts for viewport changes, input modes, loading states, and degraded network conditions. |
| Accessibility | The candidate explains keyboard operation, focus management, accessible names, labels, states, and announcements. |
| Quality practice | The candidate describes browser testing, performance measurement, error handling, and maintainable component boundaries. |

MDN is the best general reference for platform behavior because it covers HTML, CSS, JavaScript, Web APIs, HTTP, WebDriver, accessibility, performance, privacy, and security. WAI-ARIA guidance is a complement for cases where native HTML cannot express the required widget behavior; it should not be treated as a reason to replace semantic native controls.[1] [2]

## HR interpretation

For junior roles, look for semantic markup, basic responsive layout, and an understanding of browser behavior. For mid-level roles, expect reusable component boundaries, loading/error states, testing, and accessibility implementation. For senior roles, assess system-level decisions involving performance budgets, design-system constraints, browser compatibility, observability, and mentoring.

React or Next.js knowledge can be evaluated as a technology-specific extension, but framework familiarity should not replace platform fundamentals. A framework-specific skill child is justified only when the role repeatedly requires its own lifecycle, rendering, routing, performance, and testing rubric.

## References

[1]: https://developer.mozilla.org/en-US/docs/Web "MDN Web technology for developers"
[2]: https://www.w3.org/WAI/ARIA/apg/ "WAI-ARIA Authoring Practices Guide"
