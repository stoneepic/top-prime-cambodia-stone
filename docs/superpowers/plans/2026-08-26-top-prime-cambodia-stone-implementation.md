# TOP PRIME STONE CAMBODIA 双语展示站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive, bilingual English / Chinese single-page showcase site for TOP PRIME STONE CAMBODIA using the supplied quarry, factory, material, tombstone, and packing imagery.

**Architecture:** Use a lightweight Vite + React app. Keep all bilingual copy and image metadata in one content module, render each page section as a focused component, and keep language, lightbox, mobile navigation, and inquiry success state in the top-level app. Copy only the images needed for the first showcase into `public/assets`; do not make the initial page depend on large `.MOV` files.

**Tech Stack:** Vite, React, plain CSS, Vitest + Testing Library for small interaction/content tests, `npm.cmd` on Windows.

**Spec:** `docs/superpowers/specs/2026-08-26-top-prime-cambodia-stone-design.md`

## Global Constraints

- The site is a single-page English / Chinese bilingual showcase with no backend, payment, CMS, login, inventory, or fabricated capacity / certification / customer numbers.
- Use the real supplied images from `E:\TOP PRIME网站建设素材` copied into URL-safe folders under `public/assets/`.
- Keep `Quarry Source`, `Factory Processing`, and `Custom Supply` as capability labels, not numerical claims.
- Use `TOP PRIME STONE CAMBODIA Co., Ltd.` and `Kampong Speu Province, Cambodia` from `联系方式.docx`; show phone, email, and WhatsApp as `Details to be confirmed / 待补充` until verified values are supplied.
- The four materials are `Cambodia Black`, `Cambodia Dark Grey`, `Cambodia Grey`, and `Cambodia Luna Pearl`.
- Use `npm.cmd run build` as the required build check; verify desktop and mobile render plus language toggle, lightbox, mobile menu, and form success state.
- Respect `prefers-reduced-motion`; do not put a heavy `.MOV` file on the first viewport.

## File Map

- Create: `package.json`, `vite.config.js`, `index.html`
- Create: `src/main.jsx`, `src/App.jsx`, `src/styles.css`
- Create: `src/data/siteContent.js`
- Create: `src/components/Header.jsx`, `src/components/Hero.jsx`, `src/components/MaterialsSection.jsx`, `src/components/ProductShowcase.jsx`, `src/components/ProcessSection.jsx`, `src/components/AboutSection.jsx`, `src/components/ContactSection.jsx`, `src/components/Lightbox.jsx`
- Create: `src/components/InquiryForm.jsx`
- Create: `src/test/setup.js`, `src/test/siteContent.test.js`, `src/test/App.test.jsx`, `vitest.config.js`
- Create: `public/assets/quarry/*`, `public/assets/materials/*`, `public/assets/factory/*`, `public/assets/products/*`
- Modify: none; the starting worktree contains only Git metadata and the committed design documents.

### Task 1: Scaffold the React app and test harness

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `vitest.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/styles.css`
- Test: `src/test/siteContent.test.js`

**Interfaces:**
- Produces a runnable Vite entry at `src/main.jsx` and an `App` component that later tasks can expand.
- Produces `npm.cmd run dev`, `npm.cmd run build`, and `npm.cmd run test` scripts.

- [ ] **Step 1: Create the minimal project manifest and config**

  Add the exact scripts and dependencies below:

  ```json
  {
    "name": "top-prime-cambodia-stone",
    "private": true,
    "version": "0.1.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "test": "vitest run"
    },
    "dependencies": {
      "@vitejs/plugin-react": "latest",
      "@testing-library/jest-dom": "latest",
      "@testing-library/react": "latest",
      "@testing-library/user-event": "latest",
      "jsdom": "latest",
      "react": "latest",
      "react-dom": "latest",
      "vite": "latest",
      "vitest": "latest"
    },
    "devDependencies": {}
  }
  ```

  Configure Vite with the React plugin and Vitest with `environment: 'jsdom'`, `globals: true`, and `setupFiles: './src/test/setup.js'`; create that setup file with `import '@testing-library/jest-dom';`.

- [ ] **Step 2: Add the entry shell and a failing content smoke test**

  Render `<App />` from `src/main.jsx`, set the document language to `en` in `index.html`, and add this initial test:

  ```js
  import { describe, expect, it } from 'vitest';
  import { siteContent } from '../data/siteContent';

  describe('site content contract', () => {
    it('contains both supported languages', () => {
      expect(Object.keys(siteContent)).toEqual(expect.arrayContaining(['en', 'zh']));
    });
  });
  ```

  This test should initially fail because `src/data/siteContent.js` does not exist yet.

- [ ] **Step 3: Run the smoke test and confirm the expected failure**

  Run `npm.cmd install` followed by `npm.cmd run test -- src/test/siteContent.test.js`.

  Expected result: the test command reaches Vitest and fails with a module-not-found error for `src/data/siteContent.js`.

- [ ] **Step 4: Commit the scaffold**

  Run `git add package.json vite.config.js vitest.config.js index.html src/main.jsx src/App.jsx src/styles.css src/test/setup.js src/test/siteContent.test.js` and commit with `git -c user.name="Codex" -c user.email="codex@local" commit -m "chore: scaffold bilingual stone showcase"`.

### Task 2: Add the real image assets and bilingual content contract

**Files:**
- Create: `src/data/siteContent.js`
- Create: `public/assets/quarry/quarry-main.jpg`, `public/assets/quarry/quarry-wide.jpg`
- Create: `public/assets/materials/cambodia-black.jpg`, `public/assets/materials/cambodia-dark-grey.jpg`, `public/assets/materials/cambodia-grey.jpg`, `public/assets/materials/cambodia-luna-pearl.jpg`
- Create: `public/assets/factory/automatic-polishing.jpg`, `public/assets/factory/bridge-saw.jpg`, `public/assets/factory/hand-polishing.jpg`, `public/assets/factory/packing.jpg`, `public/assets/factory/warehouse-full.jpg`, `public/assets/factory/tombstone-inspection.jpg`
- Create: `public/assets/products/tombstone-01.jpg` through `public/assets/products/tombstone-05.jpg`
- Test: `src/test/siteContent.test.js`

**Interfaces:**
- Produces `siteContent.en` and `siteContent.zh` with identical keys so every visible section can switch language.
- Each material item has `{ id, name, description, application, image }`.
- Each process item has `{ id, label, title, description, image }`.
- `siteContent.contact.details` contains `{ phone, email, whatsapp }` with the bilingual confirmed-later copy, not invented values.

- [ ] **Step 1: Copy a bounded image set from the supplied folder**

  Use PowerShell `Copy-Item` with explicit source and destination paths:

  ```powershell
  New-Item -ItemType Directory -Force public/assets/quarry,public/assets/materials,public/assets/factory,public/assets/products | Out-Null
  Copy-Item 'E:\TOP PRIME网站建设素材\矿山图片\QUARRY.jpg' 'public/assets/quarry/quarry-main.jpg'
  Copy-Item 'E:\TOP PRIME网站建设素材\矿山图片\QUARRY2.jpg' 'public/assets/quarry/quarry-wide.jpg'
  Copy-Item 'E:\TOP PRIME网站建设素材\产品图片\Cambodia Black.jpg' 'public/assets/materials/cambodia-black.jpg'
  Copy-Item 'E:\TOP PRIME网站建设素材\产品图片\Cambodia Dark Grey.jpg' 'public/assets/materials/cambodia-dark-grey.jpg'
  Copy-Item 'E:\TOP PRIME网站建设素材\产品图片\Cambodia Grey.jpg' 'public/assets/materials/cambodia-grey.jpg'
  Copy-Item 'E:\TOP PRIME网站建设素材\产品图片\Cambodia Luna Pearl.jpg' 'public/assets/materials/cambodia-luna-pearl.jpg'
  Copy-Item 'E:\TOP PRIME网站建设素材\工厂图片\Automatic Polishing.jpg' 'public/assets/factory/automatic-polishing.jpg'
  Copy-Item 'E:\TOP PRIME网站建设素材\工厂图片\Bridge Saw.JPG' 'public/assets/factory/bridge-saw.jpg'
  Copy-Item 'E:\TOP PRIME网站建设素材\工厂图片\Hand craft.jpg' 'public/assets/factory/hand-polishing.jpg'
  Copy-Item 'E:\TOP PRIME网站建设素材\工厂图片\Packing (1).JPG' 'public/assets/factory/packing.jpg'
  Copy-Item 'E:\TOP PRIME网站建设素材\工厂图片\warehouse full.jpg' 'public/assets/factory/warehouse-full.jpg'
  Copy-Item 'E:\TOP PRIME网站建设素材\工厂图片\Tomestone Inspection.jpg' 'public/assets/factory/tombstone-inspection.jpg'
  Copy-Item 'E:\TOP PRIME网站建设素材\产品图片\tombstone\IMG_0958.JPG' 'public/assets/products/tombstone-01.jpg'
  Copy-Item 'E:\TOP PRIME网站建设素材\产品图片\tombstone\IMG_0959.JPG' 'public/assets/products/tombstone-02.jpg'
  Copy-Item 'E:\TOP PRIME网站建设素材\产品图片\tombstone\IMG_0960.JPG' 'public/assets/products/tombstone-03.jpg'
  Copy-Item 'E:\TOP PRIME网站建设素材\产品图片\tombstone\IMG_0961.JPG' 'public/assets/products/tombstone-04.jpg'
  Copy-Item 'E:\TOP PRIME网站建设素材\产品图片\tombstone\IMG_0962.JPG' 'public/assets/products/tombstone-05.jpg'
  ```

- [ ] **Step 2: Add the bilingual data module**

  Populate `siteContent.js` with the exact high-level keys `brand`, `nav`, `hero`, `capabilities`, `materials`, `products`, `process`, `about`, `contact`, `form`, and `footer` in both `en` and `zh` objects. Use the approved hero copy `Stone from Cambodia. Made for the world.` / `柬埔寨石材，连接世界建筑。`; use `Explore Materials` / `查看石材` and `Request a Quote` / `获取报价`; use the four supplied material names exactly.

  Use the supplied address text as `Ou Snuol Village, Toap Mean Commune, Thpong District, Kampong Speu Province, Cambodia` and preserve `topprimestone.com`. For unverified contact channels use `Details to be confirmed` and `联系方式待补充`.

- [ ] **Step 3: Replace the failing test with content invariants**

  Extend `src/test/siteContent.test.js` with these assertions:

  ```js
  it('keeps the bilingual material catalog aligned', () => {
    expect(siteContent.en.materials).toHaveLength(4);
    expect(siteContent.zh.materials).toHaveLength(4);
    expect(siteContent.en.materials.map(({ id }) => id)).toEqual(
      siteContent.zh.materials.map(({ id }) => id),
    );
  });

  it('does not publish unverified contact numbers', () => {
    expect(siteContent.en.contact.details.phone.value).toBe('Details to be confirmed');
    expect(siteContent.en.contact.details.whatsapp.value).toBe('Details to be confirmed');
  });
  ```

- [ ] **Step 4: Run the content tests and commit the asset/content layer**

  Run `npm.cmd run test -- src/test/siteContent.test.js` and expect PASS. Verify every copied image exists with `Get-ChildItem public/assets -Recurse -File`. Commit with `git -c user.name="Codex" -c user.email="codex@local" commit -m "feat: add stone assets and bilingual content"`.

### Task 3: Implement header, hero, material cards, and lightbox

**Files:**
- Create: `src/components/Header.jsx`
- Create: `src/components/Hero.jsx`
- Create: `src/components/MaterialsSection.jsx`
- Create: `src/components/Lightbox.jsx`
- Modify: `src/App.jsx`, `src/styles.css`
- Test: `src/test/App.test.jsx`

**Interfaces:**
- `Header({ content, language, onLanguageChange, isMenuOpen, onMenuToggle, onQuoteClick })` renders the navigation and mobile menu.
- `Hero({ content, onExplore, onQuote })` renders the hero image, bilingual current copy, capability labels, and two CTAs.
- `MaterialsSection({ content, onMaterialSelect })` renders four clickable material cards.
- `Lightbox({ item, content, onClose, onQuote })` returns `null` when `item` is absent and otherwise exposes close and quote actions.
- `App` owns `language`, `selectedMaterial`, `isMenuOpen`, and passes the selected language slice from `siteContent` to all components.

- [ ] **Step 1: Write failing interaction tests**

  Add tests covering the required visible flow:

  ```jsx
  import { render, screen } from '@testing-library/react';
  import userEvent from '@testing-library/user-event';
  import App from '../App';

  it('switches all hero copy to Chinese', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '中文' }));
    expect(screen.getByRole('heading', { name: '柬埔寨石材，连接世界建筑。' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '获取报价' })).toBeInTheDocument();
  });

  it('opens and closes a material lightbox', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Cambodia Black/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Close/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  ```

- [ ] **Step 2: Run the new tests and confirm they fail**

  Run `npm.cmd run test -- src/test/App.test.jsx`. Expected result: FAIL because the new component structure and state handlers are not implemented.

- [ ] **Step 3: Implement the top-level state and section components**

  In `App.jsx`, initialize `const [language, setLanguage] = useState('en')`, `const [selectedMaterial, setSelectedMaterial] = useState(null)`, and `const [isMenuOpen, setIsMenuOpen] = useState(false)`. Derive `const content = siteContent[language]`. Render `<Header />`, `<Hero />`, `<MaterialsSection />`, and `<Lightbox />`; wire hero and header quote actions to `document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })` and close the mobile menu after a nav click.

  In `Header`, use real anchor links `#materials`, `#products`, `#process`, `#about`, `#contact`; use a button for language selection and a button with `aria-expanded` for mobile navigation. In `Lightbox`, use `role="dialog"`, `aria-modal="true"`, a close button, and escape-key handling.

- [ ] **Step 4: Make the tests pass and commit**

  Run `npm.cmd run test -- src/test/App.test.jsx` and expect PASS. Commit with `git -c user.name="Codex" -c user.email="codex@local" commit -m "feat: add bilingual hero and material lightbox"`.

### Task 4: Implement products, process, about, and contact sections

**Files:**
- Create: `src/components/ProductShowcase.jsx`
- Create: `src/components/ProcessSection.jsx`
- Create: `src/components/AboutSection.jsx`
- Create: `src/components/ContactSection.jsx`
- Create: `src/components/InquiryForm.jsx`
- Modify: `src/App.jsx`, `src/styles.css`
- Test: `src/test/App.test.jsx`

**Interfaces:**
- `ProductShowcase({ content })` consumes `content.products` and renders tombstone images plus slabs / cut-to-size / custom stonework tags.
- `ProcessSection({ content })` consumes `content.process` and renders four steps with quarry, cutting, finishing, and packing images.
- `AboutSection({ content })` consumes `content.about` and renders the company / address text and warehouse image.
- `InquiryForm({ content, onSubmitted })` owns local field values and calls `onSubmitted()` after browser validation succeeds.
- `ContactSection({ content, onSubmitted })` composes contact details and the form, including a visible success state after submission.

- [ ] **Step 1: Add failing tests for process/form behavior**

  Add these tests to `src/test/App.test.jsx`:

  ```jsx
  it('shows the four process steps', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Quarry/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Cutting/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Finishing/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Packing/i })).toBeInTheDocument();
  });

  it('shows the bilingual success message after a valid inquiry', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText(/Your name/i), 'Alex');
    await user.type(screen.getByLabelText(/Email/i), 'alex@example.com');
    await user.click(screen.getByRole('button', { name: /Submit Inquiry/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/Thank you/i);
  });
  ```

- [ ] **Step 2: Run the tests and confirm the new tests fail**

  Run `npm.cmd run test -- src/test/App.test.jsx`. Expected result: FAIL because process and contact sections are not present.

- [ ] **Step 3: Implement the content sections**

  Render the product area with one large tombstone image, a five-image strip, and application tags. Render the process area as a horizontal timeline at desktop widths and a normal vertical list below `760px`. Render the about area with the warehouse image, company name, address, and a short factual paragraph based on the approved content model.

  Implement `InquiryForm` with controlled inputs for name, company, email, phone / WhatsApp, material interest, and project details. Mark name and email as required, use `type="email"` for email, prevent default submission, and call `onSubmitted()` only when `event.currentTarget.checkValidity()` is true. Use `<p role="status">` for the success message and retain the form without sending network requests.

- [ ] **Step 4: Make tests pass and commit**

  Run `npm.cmd run test -- src/test/App.test.jsx` and expect PASS. Commit with `git -c user.name="Codex" -c user.email="codex@local" commit -m "feat: add process and inquiry sections"`.

### Task 5: Apply the approved visual system and responsive layout

**Files:**
- Modify: `src/styles.css`, `index.html`
- Modify: `src/components/Header.jsx`, `src/components/Hero.jsx`, `src/components/MaterialsSection.jsx`, `src/components/ProductShowcase.jsx`, `src/components/ProcessSection.jsx`, `src/components/AboutSection.jsx`, `src/components/ContactSection.jsx`, `src/components/InquiryForm.jsx`, `src/components/Lightbox.jsx`

**Interfaces:**
- Keeps component props and content data unchanged while providing the visual system from the design spec.
- Exposes stable landmarks and classes for browser inspection: `.site-header`, `.hero`, `.materials-grid`, `.process-track`, `.contact-grid`, `.mobile-menu`, and `.lightbox`.

- [ ] **Step 1: Add typography, tokens, and base layout**

  In `index.html`, add a descriptive title and meta description in English, then load `Cormorant Garamond` and `Manrope` with system fallbacks. In `styles.css`, define:

  ```css
  :root {
    --ink: #131414;
    --slate: #282a29;
    --moss: #56645b;
    --sand: #d8d0c2;
    --copper: #b98956;
    --paper: #f1eee7;
    --display: 'Cormorant Garamond', Georgia, serif;
    --body: 'Manrope', 'Segoe UI', sans-serif;
  }
  ```

  Use a centered max-width container, thin borders, large spacing, sharp image crops, small uppercase labels, and no generic stock imagery. Keep the hero image original in color and use only a subtle local contrast overlay so text remains readable.

- [ ] **Step 2: Style the desktop composition**

  Build a full-height hero with left-aligned title and right-aligned capability labels; put the materials section on a paper background; use a 4-column material grid, a two-column product showcase, a dark process band, and a split about/contact layout. Use copper only for the active CTA, section numerals, focus rings, and small highlights.

- [ ] **Step 3: Style mobile navigation and breakpoints**

  At `max-width: 900px`, collapse the header nav behind the menu button, change product and contact grids to one column, and reduce the hero heading scale. At `max-width: 640px`, make the hero CTA stack, make material cards one column, move the process timeline to a vertical list, keep form fields full width, and ensure no child is wider than the viewport.

- [ ] **Step 4: Add accessible interaction states and reduced-motion behavior**

  Give buttons and links visible `:focus-visible` rings, ensure dark-background text has sufficient contrast, add `alt` text from the data model, and add:

  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
    }
  }
  ```

- [ ] **Step 5: Commit the visual layer**

  Run `npm.cmd run test` and `npm.cmd run build`, expect both PASS, then commit with `git -c user.name="Codex" -c user.email="codex@local" commit -m "style: polish responsive stone showcase"`.

### Task 6: Generate and accept the visual concept, then align the implementation

**Files:**
- Create or store: `docs/superpowers/concepts/top-prime-stone-homepage.png`
- Modify: `src/styles.css` and affected component files only when comparison finds a concrete mismatch.
- Create: `docs/superpowers/qa/top-prime-stone-fidelity-ledger.md`

**Interfaces:**
- The accepted concept defines first-viewport balance, palette, typography, image treatment, spacing, and section order.
- The fidelity ledger records at least five concrete comparison points with concept evidence, render evidence, and any repair.

- [ ] **Step 1: Generate a complete concept image using Image Gen**

  Generate a desktop homepage concept for an English / Chinese Cambodian stone supplier using the real visual direction: quarry panorama hero, charcoal / slate / moss / warm copper palette, high-contrast serif headline, restrained sans-serif navigation, material texture cards, and a visible start of the next section. Do not introduce logos, certifications, numeric capacity claims, or invented customer logos.

- [ ] **Step 2: Render the current implementation at the concept viewport**

  Start the app with `npm.cmd run dev -- --host 127.0.0.1`, capture the desktop first viewport at the concept's dimensions, and also capture a mobile viewport around `390x844`.

- [ ] **Step 3: Compare and repair the five required points**

  Inspect concept and implementation for: first-viewport copy and hierarchy, hero crop / overlay, typography scale and line breaks, material card spacing and image treatment, palette / borders / CTA contrast, next-section preview, and mobile overflow. Fix concrete mismatches in the implementation and recapture until the comparison is faithful.

- [ ] **Step 4: Write the fidelity ledger and commit**

  Record at least five rows in `docs/superpowers/qa/top-prime-stone-fidelity-ledger.md`, including any intentional deviation such as the concept using a generated placeholder texture while the implementation uses the supplied Cambodia material images. Commit with `git -c user.name="Codex" -c user.email="codex@local" commit -m "qa: verify visual fidelity of stone showcase"`.

### Task 7: Final browser-level verification and handoff

**Files:**
- Modify: `src/components/*` or `src/styles.css` only if verification reveals a defect.
- Create: `docs/superpowers/qa/top-prime-stone-browser-check.md`

**Interfaces:**
- The final app must pass build and tests and expose working bilingual, navigation, lightbox, mobile menu, and inquiry interactions without a backend.

- [ ] **Step 1: Run all automated checks**

  Run `npm.cmd run test` and `npm.cmd run build`. Expected result: both commands exit with code 0 and Vite produces `dist/`.

- [ ] **Step 2: Verify the desktop core flow**

  Open the local dev URL in the available browser workflow. Check that the hero scroll CTA reaches `#materials`, the quote CTA reaches `#contact`, the language toggle updates hero, section headings, labels, and form copy, and a material card opens and closes a `role="dialog"` lightbox.

- [ ] **Step 3: Verify mobile behavior**

  Check a `390x844` viewport: the menu button opens and closes the nav, anchor navigation closes the menu, the hero CTAs stack, materials and process sections remain readable, form controls do not overflow, and the page has no horizontal scrollbar.

- [ ] **Step 4: Verify the local-only form state**

  Submit with missing required fields and confirm native validation prevents success. Submit with a valid name and email and confirm the bilingual success status appears without a network request or page reload.

- [ ] **Step 5: Write the final verification note and commit**

  In `docs/superpowers/qa/top-prime-stone-browser-check.md`, record the exact commands, viewport sizes, interaction checks, asset load result, and any remaining intentional deviation. Commit with `git -c user.name="Codex" -c user.email="codex@local" commit -m "test: verify bilingual stone site"`.
