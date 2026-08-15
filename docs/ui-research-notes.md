# HR Skills UI/UX Research Notes

## Product direction

HR Skills nên được thiết kế như một **skills knowledge product**: vừa là thư viện tra cứu, vừa là công cụ discovery và planning cho HR/TA. Trải nghiệm cần hỗ trợ hai mode song song: tìm chính xác bằng search/natural language và browse có cấu trúc theo domain, role, proficiency và related skills.

## Findings from research

### HR knowledge base

Applaud HR nhấn mạnh knowledge base là single source of truth cho chính sách, quy trình và institutional knowledge. UX hiện đại cần dynamic discovery bằng natural-language search nhưng không được bỏ browsing có cấu trúc; content nên có heading rõ, đoạn ngắn, bullet/numbered steps, FAQ và metadata để dễ scan cho cả người dùng lẫn AI. Nguồn: <https://www.applaudhr.com/blog/hr-systems/how-to-build-an-hr-knowledge-base-your-employees-will-love>

### E-learning and skills journeys

Justinmind đề xuất user-centered design, mobile-first, information architecture rõ, progress tracking và accessibility. Các màn hình quan trọng nên giúp người dùng biết mình đang ở đâu, bước kế tiếp là gì và có thể resume journey. Với HR Skills, điều này chuyển thành clear catalog filters, skill detail metadata, related skills, planner steps và visible state/progress. Nguồn: <https://www.justinmind.com/ui-design/how-to-design-e-learning-platform>

### Dashboard and enterprise data UX

Pencil & Paper phân biệt product home, exploration/discovery, functional và monitoring dashboard. Mỗi surface cần một mục tiêu rõ, page title/description rõ, grouped modules, actionable information ở lớp đầu tiên và drill-down ở lớp sau. Nguồn: <https://www.pencilandpaper.io/articles/ux-pattern-analysis-data-dashboards>

### Skills library

Upland mô tả skills library nên có taxonomy/categories, proficiency levels, role matching, searchable/filterable inventory và lifecycle maintenance. Với HR Skills, catalog nên expose domain/tier/version/related/dependency signals và skill detail nên làm rõ dùng skill này khi nào, liên quan gì và bước tiếp theo là gì. Nguồn: <https://uplandsoftware.com/psa/resources/blog/how-to-create-a-skills-library/>

## Design implications

1. Dùng một **workspace shell** nhất quán: header, page intro, contextual actions và surface container không thay đổi giữa routes.
2. Homepage nên là orientation layer, không chỉ là hero: đưa search/planner vào focus chính, sau đó là domain browse và selected skills.
3. Catalog cần discovery-first layout: search lớn, filter chips, result count, sort, empty state và card anatomy ổn định.
4. Skill detail cần đọc như knowledge article: sticky context rail trên desktop, table of contents/section hierarchy, metadata và related skills.
5. Graph, runtime, evaluation và changelog cần dùng chung dashboard primitives: page header, metric cards, controls, list/table rows, details panels và status colors.
6. Không để CSS legacy ngoài Tailwind layer hoặc undefined custom properties; mọi token phải nằm trong `@theme` và mọi semantic class phải có component rule duy nhất.
7. Mobile cần ưu tiên single-column, controls dễ chạm, không sticky element che summary/details, và không tạo horizontal overflow.

## Current audit findings

- `globals.css` đang trộn Tailwind `@layer components` với hơn 100 dòng CSS legacy bên ngoài layer.
- Các rules legacy dùng `var(--line)`, `var(--surface)`, `var(--shadow)`, `var(--muted)`, `var(--brand)` và nhiều biến không được khai báo trong `@theme`, gây nguy cơ style không áp dụng hoặc khác nhau giữa surfaces.
- Có duplicate selectors cho `.hero`, `.site-nav`, `.domain-grid`, `.catalog-filters`, `.skill-card__action` và media queries, tạo cascade khó đoán.
- Product surfaces dùng primitive cũ và không có unified visual language với catalog/skill detail.
- Header vẫn dùng native details menu nhưng thiếu active route state và mobile navigation strategy rõ ràng.
- Metric cards, graph cards, trace entries, evaluation cards và release cards có spacing/radius/shadow khác nhau.
- `apps/web` có nhiều route nhưng chưa có shared page header/contextual action primitive.

## Visual audit snapshot

### Homepage

The homepage has a strong editorial headline and clear primary CTAs, but the header is visually too small relative to the oversized hero, and the navigation has too many equal-weight links. The right-side starting-point panel is useful but visually detached from the hero copy. The page uses a large amount of empty space before the practice-area section, while the lower skill cards are dense and repetitive. The homepage should become a clearer orientation dashboard with a search/planner entry point, compact proof metrics, domain browse and a curated skill shelf.

### Catalog

The catalog currently has a good search-first structure and clear three-field filtering, but the control panel is visually heavier than the result area. Cards repeat long descriptions with little differentiation beyond domain/tier, and result scanning is slowed by equal visual weight. A redesigned catalog should add stronger result hierarchy, compact metadata, filter chips/active state, a consistent card footer, and better mobile control grouping. The current screenshot also confirms that header/navigation remains visually disconnected from the page content.

### Skill detail

The skill detail screen has a clear hero and two-column article/metadata layout, but it feels like a generic card stack rather than a deliberate reading experience. The metadata rail is visually too detached, related skills are under-emphasized, and the top header consumes the same visual treatment as the article. A better design should use a reading column with a compact contextual rail, stronger section navigation, an explicit "use this skill when" summary and a more intentional related-skill cluster.

### Planner

The planner has a strong headline and a useful example-chip concept, but the default-filled textarea makes the first interaction ambiguous: users may think the example is already submitted. Capability feedback is visually low-priority and the result state is not visible until after a long form block. The redesigned flow should present an explicit empty state or selected example state, make examples feel like selectable presets, and give the generated plan a stronger stepper/progress treatment.

The browser screenshots also show the existing UI is not fully cohesive: the header/nav is small and utilitarian while page titles are very large; surface cards use different visual systems; and the product surfaces need a unified shell.
