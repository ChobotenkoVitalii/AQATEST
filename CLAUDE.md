# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Install dependencies: `npm ci`
- Run all tests (both projects below): `npx playwright test` (there is no `npm test` script)
- Run only the E2E project: `npm run ui-e2e` (= `npx playwright test --project=e2e-tests`)
- Run only the API project: `npm run api` (= `npx playwright test --project=api-tests`)
- Run a single test file: `npx playwright test tests/e2e.spec.js`
- Run a single test by name: `npx playwright test -g "<test name>"`
- Playwright UI mode: `npx playwright test --ui`
- View the last HTML report: `npx playwright show-report`

There is no configured lint script — `eslint` is a devDependency but there's no `eslint.config.js`/`.eslintrc` or `lint` script in this repo yet.

Requires a `.env` file (gitignored; loaded by `playwright.config.js` via `dotenv`) with `UI_BASE_URL`, `API_BASE_URL`, `CARD_NUMBER`, and `CARD_DATE`. The first two feed each project's `baseURL`; the card values are read in `data/testData.js`.

## Rules

- **All assertions belong in the test (spec) files, never in page objects.** Page objects in `page-object/` may only define locators and action methods (click, fill, navigate, read/return values). Do not use `expect(...)` or any other assertion there, and do not add `check*`/`verify*` style methods that assert. If a page object needs to wait for something, use a non-asserting wait (`waitFor`, `waitForURL`) and keep the actual verification in the spec.
- **Never read `.env`** when it contains real keys/secrets, and **never commit it** (it stays gitignored).
- **Never log sensitive data** (credentials, card numbers, tokens, personal data) via `console.log`, test output, or reports.
- **Always maintain a `.env.example`** with dummy placeholder values for every variable the project needs; add to it whenever a new variable is introduced.
- **Always provide environment variables via `export`** (shell or CI environment) rather than hardcoding values in code.
- **Always use hooks to secure files**: protect sensitive files such as `.env` with Claude Code hooks (e.g. a `PreToolUse` hook that blocks reading or editing them).

## Architecture

**Projects and base URLs**: `playwright.config.js` defines two projects, each pinned to a single spec file via `testMatch` (a bare string is auto-prefixed with `**/` and matched against the absolute path) so a spec never runs under the other project's `baseURL`:
- `e2e-tests` → `tests/e2e.spec.js`, `baseURL = process.env.UI_BASE_URL`
- `api-tests` → `tests/api.spec.js`, `baseURL = process.env.API_BASE_URL`

Because specs and page objects use relative URLs (`page.goto('/login')`, `waitForURL('/checkout')`, `toHaveURL('/account')`, `request.get('/posts/1')`), a project with an unset `baseURL` fails immediately (`Invalid URL`). Any new spec file needs its own `testMatch`-scoped project, otherwise it will not run (or will run under the wrong `baseURL`).

**Target apps**: the UI project targets a deployed demo shop (`https://aqa-app.vercel.app`) that exposes a no-signup "demo account" login (admin / admin123), useful for inspecting the UI without registering a user. The API project targets a JSONPlaceholder-style REST API (`/posts`).

**Page Object Model**: every file in `page-object/*.page.js` exports one class taking a Playwright `page`. Page objects are thin: locators as instance properties plus small action methods (e.g. `RegisterPage.fillRegistrrationFrom`, `CatalogPage.selectProduct`/`gotoBasket`, `MyAccountPage.logout`). Locators are mostly `page.locator('[id="..."]')` attribute selectors matching dedicated ids the app bakes into its markup (e.g. `account-edit-button`, `cart-item-price-6`); `CheckoutPage` uses `getByPlaceholder`/`getByRole`/`getByText` where the elements have no ids. Match the surrounding style for new locators.

**`tests/e2e.spec.js`**: one linear scenario: register (`newUser1`) → login → add coffee machine (product 6) and tablet (product 5) → open basket and compare names/prices → checkout with card data → payment-success and URL assertions → My Account (order total, ordered items visible, Edit/Logout enabled) → logout. `test.setTimeout(50*1000)` and a 1024x760 viewport are set at file level.

**Data flow between pages**: `CatalogPage.selectProduct()` returns `{ firstProduct: {name, price}, secondProduct: {name, price} }` read from the catalog (firstProduct = tablet/id 5, secondProduct = coffee machine/id 6), and the spec feeds those values into basket and My Account assertions. Basket element ids are inverse-ordered (`cart-item-*-6` = coffee machine is the "first" basket row, `-5` = tablet is the "second"), so in basket assertions `firstProductItem`/`firstItemPrice` correspond to `items.secondProduct`.

**Cross-page state**: `BascketPage.checkTotalPrice()` only clicks checkout and waits for `/checkout` — it navigates away from the cart. Basket locators (`totalValue`, `firstItemPrice`, ...) match nothing after that, so read any basket values (`innerText()`) *before* calling it, not after.

**`tests/api.spec.js`**: three REST checks (GET, POST, PATCH) using request bodies `apiDataPost`/`apiDataPatch` from `data/testData.js`.

**`data/testData.js`**: ES-module fixtures — `newUser1` (generated with `@faker-js/faker` at import time), `cardData` (`CARD_NUMBER`/`CARD_DATE` from `.env`, CVV from faker), and the two API payloads. (`package.json` declares `"type": "commonjs"` but the code uses ESM `import`/`export`; Playwright's own loader handles this.)

**Price formatting gotcha**: individual item/catalog prices render as whole dollars with no decimal (e.g. `"$420"`), but aggregate totals (`cart-total`, the My Account order total) render with a trailing `.00`. Parse them differently: per-item prices with `.replace(/\D/g, '')`; totals by keeping the dot and truncating — `parseInt(text.replace(/[^\d.]/g, ''), 10)`. Using the digit-only regex on a total silently inflates it 100x (`"$990.00"` → `99000`) instead of erroring.

**CI**: `.github/workflows/playwright.yml` runs `npx playwright test` on push/PR to `main`/`master` (ubuntu-latest) and uploads the HTML report. Two known gaps: the workflow does not provide `UI_BASE_URL`/`API_BASE_URL`/`CARD_*` (`.env` is gitignored), and `playwright.config.js` sets `headless: false` with no virtual display step.

**Naming note**: the basket page object is `page-object/Bascket.page.js` / `BascketPage` (misspelled, not "Basket"), as are `fillRegistrrationFrom` and the `totalAmountFiled` locator — keep these exact spellings when referencing them. `BascketPage`'s constructor takes an optional `productInfo` argument that it no longer uses.
