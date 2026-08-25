# Phạm vi cải tiến ứng dụng web

## Ràng buộc styling

`apps/web` sẽ dùng **chỉ utility classes của UnoCSS** trực tiếp trong JSX. Cấu hình UnoCSS chỉ giữ phần preset, font theme và content extraction; không giữ `preflights`, raw CSS selector hay `shortcuts` tự định nghĩa. Nội dung Markdown sẽ được render qua một renderer tạo HTML kèm utility classes tĩnh, thay cho phụ thuộc vào selector CSS `.prose-*`.

## Chức năng dựa trên API nội bộ

| Bề mặt | Nguồn chuẩn | Cải tiến thực hiện |
|---|---|---|
| Catalog | `searchSkills` từ `hr-skills-build/client` | Search fuzzy/exact có thứ hạng, filter domain, số kết quả động và nhãn giải thích trường khớp. |
| Production map | `searchSkills` cùng `DocumentationData` | Lọc inventory theo domain và truy vấn có tính điểm thay cho chuỗi `.includes()` tự viết. |
| Skill detail | `getRecommendations` từ `hr-skills-build/client` | Panel gợi ý có thứ hạng bảo toàn thứ tự `relatedSkills` canonical; prompt/example có thể mở để đọc từ snapshot. |

Không có HTTP API được triển khai trong phạm vi này. `hr-skills-build/server` chỉ được dùng ở script Bun sinh snapshot; React bundle chỉ import explicit `hr-skills-build/client`, theo package architecture của monorepo.[1]

## Quyết định UI

Catalog sẽ ưu tiên discovery bằng search kết hợp facet domain, hiển thị count động và cho phép bỏ filter ngay trong bối cảnh hiện tại. Production map vẫn bảo toàn people-work path nhưng inventory trở thành công cụ khám phá có phản hồi. Trang detail cung cấp navigation rõ ràng, supporting material có thể đọc, và recommendation có mô tả thay vì chỉ liệt kê ID. Các control tương tác sẽ là input, button và details native, có utility `focus-visible` dễ nhận biết.

Các quyết định này tuân theo nguyên tắc filter relevant, count thay đổi theo query/filter, và removal dễ dàng.[2] IA vẫn tách discovery bằng search khỏi wayfinding bằng catalog/domain navigation.[3] Mọi control bàn phím sẽ có focus indicator rõ ràng như yêu cầu WCAG 2.4.7.[4]

## Runtime verification

Catalog đã được kiểm tra trên một dev server sạch: UnoCSS utility stylesheet áp dụng ngay lần tải đầu. Truy vấn `onboard new hires` trả về 12 skills qua `searchSkills`, trong đó `hr-onboarding` hiển thị evidence `aliases: onboarding`; facet domain cập nhật count theo cùng truy vấn. Không còn file stylesheet source, raw UnoCSS preflight/shortcut, inline style prop, hoặc class alias cũ trong `apps/web`.

Trang `/skills/hr-onboarding` đã được kiểm tra trên cùng runtime. Markdown headings, list, code, table, link và blockquote nhận styling qua Uno utility classes do renderer tạo ra, không qua stylesheet selector. Prompt/example mở được bằng `details` native, và `getRecommendations()` trả về năm card có rank canonical cùng mô tả từ registry.

Production map cũng render đúng sau khi bỏ shortcuts và preflight; people-work path, inventory links, domain navigation và filter control đều hiện diện trên preview sạch. Filter inventory đã đổi implementation sang `searchSkills` từ `hr-skills-build/client`.

## Validation

`bun run typecheck` và `bun run build` đều pass sau refactor. Build tạo stylesheet UnoCSS 40.76 kB (5.07 kB gzip). Mọi import trong `src/` dùng đúng `hr-skills-build/client`; chỉ `scripts/generate-data.ts` dùng `hr-skills-build/server`. Audit cuối không tìm thấy raw stylesheet source, `preflights`, `shortcuts`, inline style prop, hoặc class alias cũ. Vite vẫn báo advisory không chặn về JavaScript chunk lớn hơn 500 kB.

## Workspace rebuild runtime

Sau khi tái thiết Workspace và mở preview sạch, browser DOM đã có 12,974 ký tự nội dung dưới `#root`, body có nền Slate 50 (`rgb(248, 250, 252)`) và hai stylesheet được gắn. Ảnh chụp browser đầu tiên trả nền trống dù markdown/DOM hiển thị đủ nội dung, nên visual screenshot pipeline sẽ được kiểm tra lại độc lập thay vì coi đó là lỗi ứng dụng.

Skill Workspace `/skills/hr-onboarding` đã render trực quan bình thường trong cùng runtime: sidebar workspace, source rail, React Markdown content, on-page outline, recommendations, raw-main link, pin action và Prepare for Claude đều xuất hiện. Điều này xác nhận ảnh trống ở catalog là artifact cô lập của lượt screenshot trước, không phải lỗi render hệ thống.

Claude handoff composer đã được kiểm tra ở `/skills/hr-onboarding`: dialog mở được, template mặc định tạo prompt `Read from https://raw.githubusercontent.com/tuanductran/hr-skills/main/skills/hr-onboarding/SKILL.md so I can ask questions about it.`, và CTA có deep link URL-encoded tương ứng. Browser storage chỉ chứa `hr-skills-worklist:v1`; không có prompt/composer key nào được persist.

## Final rebuild validation

`bun install`, `bun run typecheck`, và `bun run build` hoàn tất thành công sau tái thiết. Build hiện sinh 146 skills, stylesheet UnoCSS 49.16 kB (6.47 kB gzip), và JavaScript 879.33 kB (255.58 kB gzip). Source audit không tìm thấy file CSS/SCSS/SASS/LESS, `dangerouslySetInnerHTML`, `marked`, inline style, Uno preflight/shortcut custom, hoặc server-only import trong `src/`; chỉ `scripts/generate-data.ts` dùng `hr-skills-build/server`. Browser console không có output/error sau kiểm tra Explorer, Skill Workspace, Claude composer và People System Canvas. Vite chỉ còn advisory không chặn về chunk JavaScript vượt 500 kB.

## Performance audit baseline

Audit sau tái thiết xác định ba chi phí lớn có thể đo được: router eager-import cả Explorer, Canvas và Skill Workspace (kéo React Markdown/Remark/Rehype/Claude composer vào tải đầu); `hr-skills.json` chứa nội dung Markdown, prompt và example của toàn bộ 146 skills (3,126,714 bytes raw, 837,735 bytes gzip); và production JavaScript là một chunk 879.33 kB raw / 254,190 bytes gzip.

Trong runtime dev của Canvas, navigation hoàn tất trong khoảng 202 ms tại môi trường cục bộ, nhưng resource graph đã tải Page module của cả ba route và các dependency Markdown ngay tại `/map`. TanStack Query hiện đã phù hợp cho snapshot bất biến (`staleTime: Infinity`, không refetch khi focus, retry giới hạn); Worklist có payload rất nhỏ nhưng context một khối sẽ làm consumer cùng re-render khi `pinned` hoặc `recent` thay đổi. Các phép `toRegistry()`/Map skills cũng được tái tạo theo route dù snapshot không đổi.

Sau tối ưu, build đã tách `CatalogPage` (25.68 kB raw / 5.11 kB gzip), `MapPage` (22.52 kB / 5.12 kB) và `SkillPage` (232.87 kB / 64.66 kB) khỏi entry. Snapshot initial còn 371,182 bytes raw / 78,753 bytes gzip; nội dung Markdown, prompt và example được tải chỉ khi mở skill detail. Explorer tải sạch không nạp `MapPage`, `SkillPage`, `MarkdownContent` hay `react-markdown`; navigation timing dev giảm từ khoảng 202 ms xuống 132 ms tại cùng môi trường, và response index đo được là 371,182 bytes decoded.

Kiểm tra direct navigation `/skills/hr-onboarding` xác nhận SkillPage và Markdown dependency tải theo yêu cầu route, trong khi MapPage không tải. Đây là behavior mong muốn: route detail giữ đầy đủ Markdown/sanitization/Claude composer nhưng không làm chậm Explorer hoặc Canvas.

Explorer sau tối ưu vẫn trả 26 kết quả canonical cho truy vấn `workforce planning`; URL được đồng bộ thành `q=workforce+planning&view=all` sau debounce 180 ms. Điều này loại bỏ Router navigation/re-render ở mọi phím gõ, đồng thời giữ deep link và search kết quả không thay đổi.

Từ baseline đã đo, index initial giảm 88.1% raw và 90.5% gzip. Production entry giảm 32.5% gzip, từ 254,190 bytes xuống 171,380 bytes; phần route chỉ được tải theo nhu cầu là Catalog 5,110 bytes gzip, Canvas 5,120 bytes và Skill Workspace 64,660 bytes. Registry adapter hiện cache theo identity snapshot, lookup skill/domain dùng Map memoized, navigation shell chỉ subscribe `pinned`, và `recordRecent`/clear worklist bỏ qua update không đổi.

## Internal operating rules applied

Audit tiếp theo áp dụng `AGENTS.md`, `.agents/AGENTS.md` và `.claude/rules/package-architecture.md`: không phát triển trên `main`; browser source chỉ import surface explicit `hr-skills-build/client` hoặc `hr-skills-ref/client`; script build-only mới dùng `/server`; generated registry/docs không được sửa tay. Content graph review coi `skills/hr-*/SKILL.md` là source of truth và chỉ đề xuất sửa cấu trúc/navigational khi có bằng chứng. Internet Skill Finder đã thử real-time discovery qua GitHub Connector nhưng fallback cache không trả kết quả; không có skill ngoài nào được đưa vào dự án từ lần thử này.

## Responsive audit — mobile baseline

Chromium headless ở 375 × 812 sau 5 giây render xác nhận shell mobile hoạt động nhưng có hai vấn đề UX thực tế. Explorer hiển thị toàn bộ practice-area filter trước search và result list, tạo màn hình đầu quá dài cho nhiệm vụ tìm kiếm chính. People System Canvas giữ các stage controls trong thứ tự hợp lý nhưng title/copy hero sát cạnh phải ở viewport hẹp, làm chữ bị clip nhẹ thay vì wrap với measure an toàn. Hai điểm này được ghi nhận làm đầu vào cho điều chỉnh responsive, không phải giả định từ class name.

Direct Skill Workspace mobile ban đầu trả HTML fallback thay vì JSON detail vì dev server được khởi động trước khi thư mục `public/data/skills` được tạo. Restart dev server khiến route `/data/skills/hr-onboarding.json` trả `application/json` 26,728 bytes và Skill Workspace render lại bình thường. Tablet Explorer tại 768 × 1024 cũng tái hiện full facet stack trước search/results, xác nhận đây là cấu trúc responsive cần thay đổi (không chỉ lỗi viewport 375px).

Canvas và Skill Workspace tablet đều giữ information hierarchy nhưng screenshot 768 × 1024 cho thấy text hero/prose sát hoặc cắt ở cạnh phải. Đây là tín hiệu horizontal overflow cần đo bằng `scrollWidth`/bounding boxes trước khi chỉnh CSS. Skill tablet cũng cho thấy action rail chiếm toàn chiều ngang trước prose, vốn chấp nhận được trên mobile nhưng cần giữ compact hơn ở medium viewport.

Sau refactor responsive, Explorer mobile đặt một disclosure “Filters and worklist” trước search; result list xuất hiện trong vùng đầu trang thay vì sau 12 facet controls. Canvas mobile hiển thị một disclosure “Decision stage” và đưa active-stage hero ngay sau đó. Việc chỉ bật `scrollbar-gutter` từ `lg` cũng loại bỏ phần gutter hai bên gây cảm giác/cắt ngang ở viewport nhỏ. Hai disclosure dùng native button semantics, `aria-expanded` và `aria-controls` theo W3C APG.

## Responsive and modularization final validation

Refactor đã tách `ResponsiveDisclosure`, `SupportingFiles`, `StageNavigator` và static `PEOPLE_SYSTEM_STAGES` thành module riêng; Catalog, Canvas và Skill Workspace giữ ownership route/state rõ ràng hơn. Typecheck và production build pass; dev runtime phục vụ cả registry index và detail JSON với `application/json`; Canvas browser console không có output/error sau refactor. Vite vẫn chỉ có advisory không chặn cho chunk entry dùng chung lớn hơn 500 kB.

## Claude handoff UI audit

Trên `/skills/hr-onboarding`, nút “Prepare for Claude” mở dialog có 5 template, textarea editable, reset template, copy prompt/source, raw GitHub main-only source preview và CTA Open Claude. Template mặc định tạo prompt dùng `https://raw.githubusercontent.com/tuanductran/hr-skills/main/skills/hr-onboarding/SKILL.md`; UI hiển thị guardrail không nhập dữ liệu personal/confidential/employee và nêu rõ prompt không được lưu bởi app.

Custom prompt UI đã được thay bằng `Read from …/main/skills/hr-onboarding/SKILL.md and draft an onboarding readiness checklist for a remote product team. Do not include employee data.` Console xác nhận deep link `claude.ai/new?q=` round-trip đúng với textarea, vẫn dùng raw GitHub `main`, và localStorage chỉ có `hr-skills-worklist:v1`. Chọn template Team summary thay prompt custom đúng cách và CTA cập nhật theo prompt template. Escape đóng dialog; lần mở tiếp theo khởi tạo lại template Read the source mặc định, vì vậy prompt custom chỉ tồn tại trong phiên dialog đang mở.

## Bun test coverage

`apps/web` có script `bun run test` và 6 test Bun/37 assertions qua ba file. Test Claude khóa raw-main URL, encoding/trim round-trip của custom prompt và safety anchor cho mọi template. Test People System khóa thứ tự/unique ID/actionability của 6 stages. Test registry adapter khóa index không mang content payload và cache theo snapshot identity. `@types/bun` + `bun-types` được khai báo theo Bun catalog, còn tsconfig nạp `bun-types` tường minh để TypeScript resolve `bun:test`.

## Playwright cross-browser responsive audit

Đã thêm Playwright `test:e2e` theo Bun catalog với 18 scenario: Explorer, Canvas và Skill Workspace qua Chromium desktop mô phỏng Windows, Firefox Linux, WebKit desktop mô phỏng macOS, Chromium Pixel 7 Android, WebKit iPhone 14 và WebKit iPad Pro 11. Mỗi scenario kiểm tra render của main route, các disclosure mobile/tablet, dialog Claude đóng bằng Escape và trả focus về trigger, lỗi console/page error, cùng khả năng cuộn ngang thật.

Audit đầu phát hiện overflow ngang thật ở WebKit: 16 px trên iPhone 14 và 24 px trên iPad Pro 11. Nguyên nhân là outer container của cả ba route dùng `w-full` cộng padding trong bối cảnh không có global CSS border-box reset. Mỗi container hiện dùng utility `box-border`; audit hồi quy pass 18/18. Unit tests (6 tests/37 assertions), `bun run typecheck` và `bun run build` cũng pass. Các ảnh chụp audit và report HTML nằm ngoài repo ở `/home/ubuntu/hr-skills-responsive-audit/`.

## Touch and orientation regression

Playwright bổ sung ba kịch bản chỉ chạy trên Pixel 7 Chromium, iPhone 14 WebKit và iPad Pro 11 WebKit: tap mở overlay navigation rồi chuyển Canvas; tap mở/đóng Decision stage disclosure; tap mở/đóng Claude composer; và đổi viewport portrait → landscape → portrait trên Skill Workspace. Kết quả full suite là 27 pass, 9 skip có chủ đích cho ba desktop project không thuộc touch device matrix. Route, ARIA expanded state, dialog dismiss, visibility và không có horizontal scroll đều được giữ qua các thao tác. Không phát hiện lỗi ứng dụng cần sửa thêm; `bun run typecheck` và `bun run test` (6 pass/37 assertions) tiếp tục pass.

## Radix Dialog integration

Sau khi đối chiếu tài liệu chính thức, app dùng `@radix-ui/react-dialog` 1.1.23 trong hai luồng trọng yếu: Claude custom-prompt handoff và mobile workspace navigation. Primitive Dialog thay thế `<dialog>` thủ công cùng overlay navigation tùy biến, mang lại focus trap, Escape/outside dismiss, focus return về trigger, `Dialog.Title`/`Dialog.Description` cho screen reader và state attributes rõ ràng.[5] [6]

Motion vẫn là UnoCSS utility-only: `uno.config.ts` định nghĩa sáu animation state-driven (dialog, overlay, sheet) theo thời lượng 120–200ms; component chỉ sử dụng `data-[state=...]` classes và `motion-reduce:animate-none`. Radix giữ mount trong lúc CSS exit animation chạy, nên animation open/closed không đòi hỏi JS motion library.[5] UnoCSS theme hỗ trợ deep-merge motion token, còn arbitrary variants được preset mini/Wind3 xử lý.[7] [8]

Playwright hồi quy sau refactor pass 27 scenario với 9 desktop-only touch test được skip có chủ đích. Kịch bản touch còn assert explicit accessible name cho `Workspace navigation` và `Prepare a Claude prompt` dialogs. `bun run typecheck`, `bun run test` (6 pass/37 expectations) và production build pass.

## References

[1]: ../docs/engineering/package-architecture.md
[2]: https://www.algolia.com/blog/ux/search-filter-ux-best-practices
[3]: https://www.nngroup.com/articles/ia-study-guide/
[4]: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
[5]: https://www.radix-ui.com/primitives/docs/components/dialog
[6]: https://www.radix-ui.com/primitives/docs/guides/animation
[7]: https://unocss.dev/config/theme
[8]: https://unocss.dev/extractors/arbitrary-variants
