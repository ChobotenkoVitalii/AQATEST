# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Install dependencies: `npm ci`
- Run all tests (both projects below): `npm test` (= `npx playwright test`)
- Run only the E2E project: `npx playwright test --project=chromium`
- Run only the API project: `npm run api` (= `npx playwright test --project=api-tests`)
- Run a single test file: `npx playwright test tests/e2e.spec.js`
- Run a single test by name: `npx playwright test -g "<test name>"`
- Playwright UI mode: `npm run "test ui"` (script name contains a space, quote it)
- View the last HTML report: `npx playwright show-report`

There is no configured lint script — `eslint` is a devDependency but there's no `.eslintrc`/`eslint.config.js` or `lint` script in this repo yet.

Requires a `.env` file (loaded by `playwright.config.js` via `dotenv`) providing at least `CARD_NUMBER`, `CARD_DATE`, and `API_BASE_URL` (consumed by `data/testData.js` and the `api-tests` project's `baseURL`).

## Architecture

**Page Object Model**: every file in `page-object/*.page.js` exports one class that takes a Playwright `page` in its constructor (some, like `BascketPage`, also take data from a prior page object) and defines locators as instance properties. Locators are consistently `page.locator('[id="..."]')` CSS attribute selectors, matching dedicated test ids the app under test bakes into its markup (e.g. `account-edit-button`, `cart-item-price-6`) — prefer this same id-based style for new locators unless a semantic locator (`getByRole`, etc.) is clearly simpler and unambiguous. Methods on these classes mix actions and assertions together (e.g. `checkTotalPrice()` both asserts the cart total and clicks checkout to navigate to `/checkout`) rather than separating "do" from "verify".

**Target app**: a deployed demo shop at `https://aqa-app.vercel.app` (URL is hardcoded across several page objects: `Register.page.js`, `Bascket.page.js`, `Checkout.page.js`). It exposes a no-signup "demo account" login (admin / admin123) on the login page, useful for inspecting the UI without registering a new user.

**`tests/e2e.spec.js`**: one linear scenario chaining the page objects through a full purchase flow: register → login → select two products from the catalog → verify the basket and its total → checkout with card payment → confirm the success message → verify the order total on the My Account page. `test.setTimeout(50*1000)` overrides the default per-test timeout for this flow.

**`tests/api.spec.js`** (`api-tests` project): simple REST checks (get/post/patch) against `process.env.API_BASE_URL`, using request bodies from `data/testData.js`.

**`data/testData.js`**: exports test fixtures — `newUser1` (dynamically generated via `@faker-js/faker`), `cardData` (partly from `.env`, partly faker), and `apiDataPost`/`apiDataPatch` for the API tests.

**Cross-page state capture**: because page objects like `BascketPage.checkTotalPrice()` navigate away from their own page as part of the method (clicking checkout and waiting for the `/checkout` URL), any value read from that page (e.g. item price text) must be captured into an instance property *before* the navigating call, not re-queried afterward — the locator has nothing to match once the SPA has moved to a different route. See `this.firstItemPriceText` / `this.secondItemPriceText` in `Bascket.page.js`.

**Price formatting gotcha**: individual item/catalog prices render as whole dollars with no decimal (e.g. `"$420"`), but aggregate totals (`cart-total`, the My Account order total) render with a trailing `.00`. Parsing code must handle these differently: strip everything but digits for per-item prices (`.replace(/\D/g, '')`), but for aggregate totals keep the decimal point and truncate with `parseInt` (`.replace(/[^\d.]/g, '')` then `parseInt(str, 10)`) — see `Bascket.page.js`'s `checkTotalPrice()` and `MyAccount.page.js`'s `checkFinalOrder()`. Using the wrong regex on a totals field silently inflates the parsed value by 100x instead of erroring.

**CI**: `.github/workflows/playwright.yml` runs `npx playwright test` on push/PR to `main`/`master` on `ubuntu-latest` and uploads the HTML report as an artifact. Note that `playwright.config.js` sets `headless: false` — this project has not yet been reconciled with running headed in CI's default (no virtual display) environment.

**Debug leftovers**: `MyAccount.page.js`'s `checkFinalOrder()` still contains an intentional `await this.page.pause()` for interactive debugging — it opens the Playwright Inspector and blocks the test until manually resumed, so expect any full local `chromium` run to pause there rather than complete unattended.

**Naming note**: the basket page object is `page-object/Bascket.page.js` / `BascketPage` (misspelled, not "Basket") — match this exact spelling when importing it.
