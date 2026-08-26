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

`apps/web` có script `bun run test` và hiện chạy 7 test Bun/43 assertions qua bốn file. Test Claude khóa raw-main URL, encoding/trim round-trip của custom prompt và safety anchor cho mọi template. Test People System khóa thứ tự/unique ID/actionability của 6 stages. Test registry adapter khóa index không mang content payload và cache theo snapshot identity. Test slug khóa canonicalization/alias hợp lệ. `tsconfig` nạp `types: ["vite/client", "bun"]` qua `@types/bun` theo hướng dẫn Bun; `bun-types` đã được gỡ khỏi manifest và chỉ còn trong lockfile như dependency transitive của `@types/bun`.

## Playwright cross-browser responsive audit

Đã thêm Playwright `test:e2e` theo Bun catalog với 18 scenario: Explorer, Canvas và Skill Workspace qua Chromium desktop mô phỏng Windows, Firefox Linux, WebKit desktop mô phỏng macOS, Chromium Pixel 7 Android, WebKit iPhone 14 và WebKit iPad Pro 11. Mỗi scenario kiểm tra render của main route, các disclosure mobile/tablet, dialog Claude đóng bằng Escape và trả focus về trigger, lỗi console/page error, cùng khả năng cuộn ngang thật.

Audit đầu phát hiện overflow ngang thật ở WebKit: 16 px trên iPhone 14 và 24 px trên iPad Pro 11. Nguyên nhân là outer container của cả ba route dùng `w-full` cộng padding trong bối cảnh không có global CSS border-box reset. Mỗi container hiện dùng utility `box-border`; audit hồi quy pass 18/18. Unit tests (6 tests/37 assertions), `bun run typecheck` và `bun run build` cũng pass. Các ảnh chụp audit và report HTML nằm ngoài repo ở `/home/ubuntu/hr-skills-responsive-audit/`.

## Touch and orientation regression

Playwright bổ sung ba kịch bản chỉ chạy trên Pixel 7 Chromium, iPhone 14 WebKit và iPad Pro 11 WebKit: tap mở overlay navigation rồi chuyển Canvas; tap mở/đóng Decision stage disclosure; tap mở/đóng Claude composer; và đổi viewport portrait → landscape → portrait trên Skill Workspace. Kết quả full suite là 27 pass, 9 skip có chủ đích cho ba desktop project không thuộc touch device matrix. Route, ARIA expanded state, dialog dismiss, visibility và không có horizontal scroll đều được giữ qua các thao tác. Không phát hiện lỗi ứng dụng cần sửa thêm; `bun run typecheck` và `bun run test` (6 pass/37 assertions) tiếp tục pass.

## Radix Dialog integration

Sau khi đối chiếu tài liệu chính thức, app dùng `@radix-ui/react-dialog` 1.1.23 trong hai luồng trọng yếu: Claude custom-prompt handoff và mobile workspace navigation. Primitive Dialog thay thế `<dialog>` thủ công cùng overlay navigation tùy biến, mang lại focus trap, Escape/outside dismiss, focus return về trigger, `Dialog.Title`/`Dialog.Description` cho screen reader và state attributes rõ ràng.[5] [6]

Motion vẫn là UnoCSS utility-only: `uno.config.ts` định nghĩa sáu animation state-driven (dialog, overlay, sheet) theo thời lượng 120–200ms; component chỉ sử dụng `data-[state=...]` classes và `motion-reduce:animate-none`. Radix giữ mount trong lúc CSS exit animation chạy, nên animation open/closed không đòi hỏi JS motion library.[5] UnoCSS theme hỗ trợ deep-merge motion token, còn arbitrary variants được preset mini/Wind3 xử lý.[7] [8]

Playwright hồi quy sau refactor pass 27 scenario với 9 desktop-only touch test được skip có chủ đích. Kịch bản touch còn assert explicit accessible name cho `Workspace navigation` và `Prepare a Claude prompt` dialogs. `bun run typecheck`, `bun run test` (6 pass/37 expectations) và production build pass.

## Footer, canonical slug and final audit

Shell `SiteLayout` hiện là flex column `min-h-screen`; grid workspace nhận `flex-1`, content wrapper nhận `flex flex-col`, main nhận `flex-1`, và `WorkspaceFooter` dùng `mt-auto`. Footer là landmark có tên `Workspace footer`; ở route 404 ngắn, test đo footer top ở hoặc dưới cạnh dưới viewport và footer bottom không nằm trước viewport. Cùng test chạy pass trên sáu browser/device profile ở dev và production preview.

Skill detail vẫn dùng canonical ID `hr-*` trong registry/data file. `resolveCanonicalSkillId()` normalizes lowercase, chỉ cho phép slug kebab ASCII, rồi map alias không prefix `hr-` sang canonical ID khi tồn tại. Ví dụ `/skills/onboarding` và `/skills/HR-Onboarding` replace-history sang `/skills/hr-onboarding`; slug không tồn tại, traversal-style hoặc malformed vẫn là 404. Bun unit test thêm 6 assertions cho helper này; Playwright kiểm tra alias đại diện mỗi domain và canonical ID dài nhất trên cả dev/production.

Audit layout cuối trên dev và production gồm 60 case Playwright: responsive routes, boundary width, footer, slug, dialog, touch và orientation. Kết quả đều là 46 pass, 14 skip có chủ đích (touch ở desktop và router sweep chỉ chạy một Chromium để tránh nhân 146 route cho mọi profile). Boundary matrix phủ desktop 1024/1280/1440, mobile 320/360/375/390/412 và tablet 768/820/1024; không còn horizontal scroll hoặc browser error. Một iPhone WebKit production run từng dừng ở lazy loading sau 5 giây dù cuối cùng chỉ còn `Loading workspace…`; boundary test hiện chờ tối đa 15 giây cho dynamic route heading, kiểm tra lại đã pass mà không nới lỏng assertion overflow.

Static security audit không tìm thấy `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function` hoặc `window.open`. Markdown có `rehypeSanitize` và không dùng raw HTML; mọi link target mới trong code có `rel="noreferrer"`. Browser storage chỉ dùng local `hr-skills-worklist:v1` cho worklist. `bun-types` direct dependency đã bị gỡ; tsconfig dùng `types: ["vite/client", "bun"]` qua `@types/bun` theo hướng dẫn Bun. `bun-types` còn xuất hiện transitive do dependency của `@types/bun`, không phải direct manifest entry.

Validation cuối: `bun run typecheck` pass; `bun run test` pass (7 tests/43 assertions); `bun run build` pass và sinh 146 detail files. Vite chỉ giữ advisory không chặn về shared chunk 609.95 kB raw / 185.12 kB gzip. UnoCSS audit xác nhận Wind3 responsive variants và static extraction đều hoạt động trong production build; không thêm custom CSS, preflight hoặc shortcut.[9] [10]

## Explorer progressive results and typography confirmation

Tài liệu preset Web Fonts của UnoCSS xác nhận cấu hình `fonts.sans` mở rộng `fontFamily` và sinh utility `font-sans`; theme của UnoCSS được deep-merge, nên có thể giữ fallback typography riêng trong `theme.fontFamily`.[11] [7] Cấu hình hiện hành dùng `presetWebFonts({ provider: 'google', fonts: { sans: 'Inter:400,500,600,700', heading: 'Manrope…', mono: 'Fira Code…' } })` cùng `theme.fontFamily.sans = 'Inter, system-ui, sans-serif'`. `SiteLayout` đặt `font-sans` ở shell, vì vậy **Inter là font mặc định cho toàn bộ body/UI**; `font-heading` (Manrope) và `font-mono` (Fira Code) vẫn là lựa chọn có chủ ý cho heading và technical labels.

Explorer chỉ render 6 skill ban đầu cho mọi nguồn kết quả (all, facet, worklist và search). Footer của card hiển thị `Showing X of Y skills` và chỉ xuất hiện `Load 6 more skills` khi còn kết quả; mỗi lượt thêm tối đa 6 item và mọi query/filter/view mới đều reset limit về 6. Khi người dùng nhập, URL vẫn đồng bộ sau debounce 180 ms, nhưng kết quả và facet count chỉ commit sau cửa sổ ngắn 260 ms. Khoảng đó giữ nguyên result set đang xem, hiển thị `Searching registry…` trong vùng trạng thái đã có sẵn, rồi mới thay danh sách. Điều này mô tả đúng search local (không giả vờ gọi mạng), tránh một list rỗng hoặc chuyển card đột ngột trong khi gõ.

Regression mới kiểm tra 6 → 12 cards, hiển thị loading, giữ 12 card cũ khi pending, rồi reset về 6 card của truy vấn canonical mới. Test chuyên biệt pass trên sáu profile. Full production preview suite hiện có 66 test: **52 pass, 14 skip có chủ đích**, hoàn tất trong 58.7 giây. `bun run typecheck`, `bun run test` (7 pass/43 assertions) và `bun run build` đều pass; build giữ advisory không chặn duy nhất cho shared entry 609.95 kB raw / 185.12 kB gzip. Không có commit hoặc push nào được thực hiện sau phần việc này.

## Search and Load more code audit

Audit source xác nhận Explorer không tải thêm record qua mạng khi nhấn `Load more`: canonical index đã có sẵn 146 summary record để `searchSkills` làm exact/fuzzy ranking cục bộ. Nút chỉ tăng `visibleCount` thêm tối đa 6 và `displayedSkills` cắt bằng `slice`, nên số card React render mới là phần duy nhất tăng theo thao tác. Nhãn nút hiện dùng số còn lại thật, ví dụ `Load 1 more skill` với practice area có 7 record, thay vì luôn nói 6.

`searchSkills` của `hr-skills-build/client` duyệt candidates, score và sort trước khi giới hạn result. Trước audit, Explorer gọi lại hàm này cho từng practice area để tính facet, tức tối đa 13 lần scan/rank registry cho một query. Explorer hiện gọi một lần không domain để giữ thứ hạng canonical và evidence; `domainCounts` được tổng hợp bằng một lượt qua `searchResult.results`, còn `visibleSkills` lọc result đã xếp hạng theo domain khi cần. Điều này giữ nguyên semantics search/facet nhưng loại bỏ các scan/rank lặp theo số domain.

Lifecycle search gom timeout query URL (180 ms) và commit result (260 ms) qua một helper cancellation. Mọi input mới, clear, URL change ngoài luồng hoặc unmount đều hủy timer cũ; cleanup unmount chỉ clear timer/ref và không gọi `setState`. Trong khoảng pending, UI giữ result set và facet của committed query, vì vậy tránh list rỗng/nhảy layout đồng thời không tuyên bố sai là đang fetch mạng.

Regression mở rộng chạy trên dev và production preview qua sáu browser/device profile: 6 → 12, giữ kết quả trước đó khi `Searching registry…`, reset về 6 sau query, và practice area 7 record tải chính xác item cuối. Cả hai run chuyên biệt đều 6/6 pass. Validation cuối của audit: `bun run typecheck`, `bun run test` (7 pass/43 assertions), `bun run build`, và full Playwright production preview 52 pass/14 skip có chủ đích trên 66 test. Không có commit hoặc push nào được thực hiện.

## Audit observations — next improvement pass

Preview Explorer và People System Canvas đều render canonical registry, sidebar navigation, stage controls, result cards và inventory workspace đúng ở desktop. Audit source/DOM ghi nhận các control còn thiếu state semantics nhất quán (pin, filter, worklist) và nút xóa search chưa có accessible name; đây là các cải tiến accessibility ưu tiên cùng với chuẩn hóa font family duy nhất về Inter.

Sau chuẩn hóa, `presetWebFonts` chỉ còn tải Inter; token `sans`, `heading` và `mono` cùng resolve về `Inter, system-ui, sans-serif`, đồng thời `index.html` đặt `font-sans` trực tiếp trên `body`. Runtime inspection sau restart dev xác nhận body, h1/h2 và kbd đều resolve về Inter; production CSS không còn reference Manrope/Fira Code.

Các cải tiến ưu tiên đã triển khai gồm: `aria-current="page"` cho điều hướng Explorer/Canvas; `aria-pressed` cho filter, worklist, pin skill và decision stage; accessible name cho hai clear-search control; và status `aria-live` cố định cho Canvas inventory, nêu rõ khi đang matching canonical registry, số skill khớp hoặc trạng thái browse. Đây là UI local search, không mô tả sai là network loading. Regression `accessibility-controls.e2e.ts` kiểm tra các state/label này qua sáu profile; full production suite cuối cùng có **58 pass, 14 skip có chủ đích** trên **72 test**. `bun run typecheck`, `bun run test` (7 pass/43 assertions), `bun run build` và kiểm tra CSS font đều pass. Không có commit hoặc push nào được thực hiện.

## Explorer full-list runtime audit

Manual runtime audit trên preview mới đo Explorer từ trạng thái 6 card đến đủ 146 card qua 24 lượt `Load more`. Phép đo bao gồm hai `requestAnimationFrame` mỗi lượt để chờ React commit/paint: tổng 2,199.5 ms, tức là có chủ ý bao gồm thời gian frame scheduling chứ không phải CPU-only. Batch đầu 6 → 12 mất 73.1 ms với cùng phương pháp; 146 card tạo 2,590 descendant DOM node trong `#workspace-main`, JS heap dùng 25.6 MB trên heap 59.9 MB và `PerformanceObserver` không ghi nhận long task. Do Explorer mặc định chỉ render 6 và 146 item chỉ xuất hiện sau hành động có chủ đích của người dùng, số liệu hiện không biện minh cho virtualization phức tạp hoặc thay đổi UX; tiếp tục theo dõi nếu canonical registry tăng đáng kể vượt quy mô hiện tại.

## Biome unused-code audit

`@biomejs/biome` 2.5.7 đã có sẵn tại root workspace. `apps/web/biome.json` thiết lập scope source/test/config của app, bỏ generated output và bật `noUnusedImports`/`noUnusedVariables` ở error; formatter được tắt để việc đưa Biome vào không tạo một diff format diện rộng ngoài phạm vi cleanup. `bun run lint` và `bunx biome check` đều pass trên 35 file. Biome không tìm thấy import hoặc variable không dùng.

Cleanup có bằng chứng gồm bỏ case `read` trùng default trong helper Claude, bỏ non-null assertion không cần thiết trong registry test, và bỏ `aria-label` không hợp lệ trên native footer rồi để test định vị native `contentinfo` landmark. Không xóa dependency manifest nào: audit import/config xác nhận mọi runtime dependency được import; mọi devDependency có đường dùng qua TypeScript, Bun, Vite/UnoCSS, Playwright hoặc config build. Knip được thử ở workspace và app directory nhưng oxc parser dừng vì `RangeError: Array buffer allocation failed`; kết quả đó không được coi là bằng chứng để gỡ bất kỳ package nào. Biome xác nhận unused imports/variables và hỗ trợ lint/check theo hướng dẫn chính thức.[12] [13] [14]

## Bundle size after Biome cleanup

Fresh production build sau cleanup giữ bundle runtime gần như không đổi, đúng với phạm vi cleanup chỉ loại bỏ logic/source dư thừa không làm thay đổi dependency graph. Main shared JS hiện là 609.98 kB raw / 185.13 kB gzip, so với baseline gần nhất 610.02 kB / 185.14 kB: chênh lệch hiển thị là -0.04 kB raw và -0.01 kB gzip (mức làm tròn). Asset application tổng cộng 972,283 B raw / 280,928 B gzip qua 9 file. Toàn `dist` là 4,430,463 B raw / 1,316,444 B gzip qua 157 file; 3,457,415 B raw / 1,035,035 B gzip trong đó là 147 canonical JSON data files, không phải JS/CSS runtime. Cảnh báo Vite duy nhất vẫn là shared entry vượt 500 kB; không có regression bundle sau Biome cleanup.

## References

[1]: ../docs/engineering/package-architecture.md
[2]: https://www.algolia.com/blog/ux/search-filter-ux-best-practices
[3]: https://www.nngroup.com/articles/ia-study-guide/
[4]: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
[5]: https://www.radix-ui.com/primitives/docs/components/dialog
[6]: https://www.radix-ui.com/primitives/docs/guides/animation
[7]: https://unocss.dev/config/theme
[8]: https://unocss.dev/extractors/arbitrary-variants
[9]: https://unocss.dev/presets/wind3
[10]: https://unocss.dev/guide/extracting
[11]: https://unocss.dev/presets/web-fonts
[12]: https://biomejs.dev/guides/getting-started/
[13]: https://biomejs.dev/linter/rules/no-unused-imports/
[14]: https://biomejs.dev/linter/rules/no-unused-variables/
