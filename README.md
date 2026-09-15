# Chatgpt6 Astra Project

A small Chrome Manifest V3 autofill extension for Shopify, Supreme, Stripe and Shopee Malaysia.
## Build and load

Use Node **22.12 or later** (the included `.nvmrc` selects Node 22):

```sh
npm install
npm run build
```

Open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select `dist/`.
Add or select a profile in the popup, then turn on **Settings → Enable autofill**.
For changes during development, use `npm run watch:dev`, reload the extension, and reload the checkout tab.

The output contains:

- `dist/manifest.json`
- `dist/background.js`
- `dist/popup/popup.html`, `popup.js`, and the generated stylesheet
- `dist/inject/all.js`, `shopify.js`, `shopify-card.js`, `supreme.js`, `stripe.js`, and `shopee.js`
- `dist/icons/`

## Migration

- Vue 3 Composition API and TypeScript replace Vue 2, Vuex and the old router setup.
- Vite 8 replaces Webpack/Babel; Dart Sass and a small SCSS stylesheet replace node-sass and the Tailwind pipeline. No transition utility plugins or `@apply` remain.
- The MV3 background service worker forwards card-frame messages to the originating tab. The popup uses `action`; host access is in `host_permissions`.
- Existing `chrome.storage.local` keys (`profiles`, `selectedProfile`, `settings`) and profile fields remain compatible. Missing settings are merged with disabled defaults before use.
- Content scripts are independent IIFE bundles. They use native input setters and bubbling input/change events, retry dynamic fields, match select values or labels, and avoid overwriting fields after trusted user edits.
- Shopify supports the legacy checkout IDs plus modern field names and tokenized autocomplete attributes, including `/checkouts/` URLs on custom domains. The broad HTTPS match also supports navigation into checkout without a document reload and preserves generic autofill.
- Shopee Malaysia supports checkout address inputs with Malay/English names, phone, postcode, city and address placeholders. Custom region pickers still require manual selection.

The existing automatic checkout options remain disabled by default. Shopify step progression and completion retain the legacy `[data-step]` and continue-button behavior. Modern one-page checkout and Shopee receive autofill; their final order submission remains manual. Supreme's legacy payment option is retained. No CAPTCHA handling is added.

## v0.2.2 Bahasa Melayu and English popup

- Warm cream, deep green and lime palette with a compact 400 × 600 popup.
- Profile selector and a clear empty state for creating the first profile.
- Details, Address and Payment tabs keep the existing fields together; arrow keys, Home and End navigate the tabs.
- A header button pauses or enables the existing autofill setting. Settings use labelled switches with descriptions.
- Profile edits still save automatically. Storage keys, autofill scripts and checkout behavior are unchanged by this UI update.
- No new runtime dependencies, external fonts or remote assets.
- The popup has a saved Bahasa Melayu / English language selector in Settings.

## v0.1.1 payment-field fix

- Extend Shopify card-script injection to `checkout.pci.shopifyinc.com`, keeping the legacy `*.shopifycs.com` frames.
- Exclude the payment host from generic contact autofill so cardholder names are not replaced with contact names.
- Match hosted card fields using their active-field marker, autocomplete token or displayed placeholder as well as legacy IDs/names.
- Fill only interactive visible fields; ignore hidden replica inputs. Avoid repeatedly rewriting equivalent card-number/expiry formatting.
- Send a legacy completion notification only after a matching visible field is populated. Automatic submission is not added to the newer host.

To upgrade an unpacked installation, copy the contents of the new `dist/` into the **same existing `dist/` folder**, replacing files. Open `chrome://extensions`, click **Reload** on SSS Autofill, verify version **0.2.2**, then refresh the checkout tab. Keep the same installed extension and folder path to retain its storage.

The selected profile must already contain the card number, expiry month/year and CVV under **Profiles → Payment**. Selecting Mastercard alone supplies only a card type; blank saved values are intentionally not filled.

The screenshot does not identify the merchant or iframe origin, so this patch fixes reproduced coverage gaps rather than claiming a verified diagnosis of that live checkout. The active/hidden field structure is also documented in [Mozilla's captured Shopify fixture](https://searchfox.org/mozilla-central/source/browser/extensions/formautofill/test/fixtures/third_party/Inkbox/verification_value.html).

## Verification

`npm install` and `npm run build` passed on Node **22.23.2**, including strict Vue/TypeScript checks. Sixteen isolated DOM-fixture checks passed for output assets, modern and legacy Shopify fields, delayed country/state options, settings changes, Shopee SPA navigation, Stripe/Shopify card frames, Supreme, originating-tab message routing, and popup profile/settings persistence. The v0.1.1 regressions also cover a Mastercard test number on the newer Shopify PCI host, separate active fields with hidden replicas, and placeholder-based fields with generated IDs.

The fixtures use synthetic data and mocked Chrome APIs. The popup checks also cover all three form tabs, keyboard navigation, payment edits and creating a first profile. A real Chrome extension load, rendered popup and live merchant checkouts were not verified: the preview browser blocks local file URLs in this environment. Checkout markup and hosted payment fields can vary by merchant; the selectors are fallbacks, not a guarantee for every checkout variant.
