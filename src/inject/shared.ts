import { readStorage, type Profile, type Settings } from '../storage';

type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
const edited = new WeakSet<EventTarget>();
document.addEventListener('input', event => {
  if (event.isTrusted && event.target) edited.add(event.target);
}, true);
document.addEventListener('change', event => {
  if (event.isTrusted && event.target) edited.add(event.target);
}, true);

export const fullName = (profile: Profile) => [profile.firstName, profile.lastName].filter(Boolean).join(' ');
export const expiry = (profile: Profile) => profile.expiryMonth && profile.expiryYear
  ? `${profile.expiryMonth}/${profile.expiryYear.slice(-2)}` : '';

export function isShopifyPaymentHost(hostname = location.hostname) {
  return /(^|\.)shopifycs\.com$/.test(hostname) || hostname === 'checkout.pci.shopifyinc.com';
}

export function isShopifyCheckout() {
  if (isShopifyPaymentHost() || /(^|\.)(shopee\.com\.my|stripe\.com)$/.test(location.hostname)) return false;
  if (document.querySelector('#order_billing_name, #order_email')) return false;
  if (/\/checkouts\//.test(location.pathname)) return true;
  return /\/checkout\/?$/.test(location.pathname) && !!document.querySelector(
    '[data-step], #checkout_email, [name="checkout[email]"], script[src*="cdn.shopify.com"], script[src*="checkout-web"]',
  );
}

export function contactFields(p: Profile): Record<string, string> {
  return {
    '[autocomplete~="country" i], [autocomplete~="country-name" i], select[name="countryCode"], select[name="country"]': p.country,
    '[autocomplete~="address-level1" i], [name="province"], [name="zone"], [name="state"], #state': p.state,
    'input[autocomplete~="email" i], input[name="email"], #email': p.email,
    'input[autocomplete~="name" i], input[name="name"], input[name="fullName"], input#name, #fullName': fullName(p),
    'input[autocomplete~="given-name" i], input[name="firstName"], input[name="first-name"], input[name="firstname"], #firstName, #firstname, #first-name': p.firstName,
    'input[autocomplete~="family-name" i], input[name="lastName"], input[name="last-name"], input[name="lastname"], #lastName, #lastname, #last-name': p.lastName,
    'input[autocomplete~="tel" i], input[autocomplete~="tel-national" i], input[name="phone"], input[name="tel"], #tel': p.phoneNumber,
    '[autocomplete~="address-line1" i], [name="address1"], #address1': p.address,
    '[autocomplete~="address-line2" i], [name="address2"], #address2': p.address2,
    '[autocomplete~="street-address" i]': [p.address, p.address2, p.address3].filter(Boolean).join(', '),
    '[autocomplete~="address-level2" i], [name="city"], #city': p.city,
    '[autocomplete~="postal-code" i], [name="postalCode"], [name="zipcode"], [name="postcode"], [name="post-code"], #zipcode, #postcode': p.zipcode,
  };
}

function setValue(element: Field, value: string) {
  const prototype = element instanceof HTMLSelectElement ? HTMLSelectElement.prototype
    : element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  // Bypass React's instance value tracker, then notify controlled forms.
  Object.getOwnPropertyDescriptor(prototype, 'value')?.set?.call(element, value);
  element.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
}

async function fill(element: Field, value: string, typing: boolean) {
  if (!value || element.disabled || edited.has(element) || !element.getClientRects().length) return false;
  // Hosted card frames also contain non-interactive copies of other fields.
  if (element.matches('[data-honeypot-field]') || element.closest('[hidden], [inert], [aria-hidden="true"]')) return false;
  if (['hidden', 'collapse'].includes(getComputedStyle(element).visibility)) return false;
  if (element instanceof HTMLInputElement && ['hidden', 'checkbox', 'radio', 'file', 'submit', 'button', 'password'].includes(element.type)) return false;
  if ('readOnly' in element && element.readOnly) return false;
  if (element instanceof HTMLSelectElement) {
    const wanted = value.trim().toLowerCase();
    const option = [...element.options].find(option => !option.disabled &&
      [option.value, option.textContent ?? '', option.value.split('-').at(-1) ?? '']
        .some(candidate => candidate.trim().toLowerCase() === wanted));
    if (!option) return false; // Do not clear a selection when its options have not loaded.
    value = option.value;
  }
  const formattedCardField = element.matches('[autocomplete~="cc-number" i], [autocomplete~="cc-exp" i], [data-current-field="number"], [data-current-field="expiry"]');
  const equivalent = (actual: string) => formattedCardField
    ? actual.replace(/[\s/-]/g, '') === value.replace(/[\s/-]/g, '') : actual === value;
  if (equivalent(element.value)) return true;
  if (typing && !(element instanceof HTMLSelectElement)) {
    for (let length = 1; length <= value.length; length++) {
      if (!element.isConnected || edited.has(element)) return false;
      setValue(element, value.slice(0, length));
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  } else {
    setValue(element, value);
  }
  element.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  return equivalent(element.value);
}

export async function fillFields(fields: Record<string, string>, typing = false) {
  let filled = 0;
  for (const [selector, value] of Object.entries(fields)) {
    const elements = [...document.querySelectorAll<Field>(selector)].filter(element =>
      element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement);
    const results = await Promise.all(elements.map(element => fill(element, value, typing)));
    filled += results.filter(Boolean).length;
  }
  return filled;
}

// Handles late fields, one-page checkouts, route changes and dependent selects.
export function watchAutofill(
  fillProfile: (profile: Profile, settings: Settings) => unknown | Promise<unknown>,
  matches: () => boolean = () => true,
) {
  let data: Awaited<ReturnType<typeof readStorage>> | undefined;
  let running = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const run = async () => {
    const profile = data?.profiles.find(profile => profile.id === data?.selectedProfile);
    if (running || !data?.settings.enabled || !profile || !matches()) return;
    running = true;
    try { await fillProfile(profile, data.settings); }
    finally { running = false; }
  };
  const schedule = () => {
    if (timer !== undefined) return;
    timer = setTimeout(() => {
      timer = undefined;
      void run().catch(console.error);
    }, 80);
  };
  const load = () => { void readStorage().then(value => { data = value; schedule(); }).catch(console.error); };
  const onStorageChanged = (_changes: unknown, area: string) => { if (area === 'local') load(); };
  chrome.storage.onChanged.addListener(onStorageChanged);
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, {
    childList: true, subtree: true, attributes: true,
    attributeFilter: ['name', 'id', 'autocomplete', 'placeholder', 'disabled', 'hidden', 'class'],
  });
  const interval = setInterval(schedule, 1000);
  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    observer.disconnect();
    clearInterval(interval);
    clearTimeout(timer);
    chrome.storage.onChanged.removeListener(onStorageChanged);
  }, { once: true });
  load();
}

export function hasCaptcha() {
  return !!document.querySelector('#g-recaptcha, .g-recaptcha, .h-captcha, iframe[src*="recaptcha"], iframe[src*="hcaptcha"]');
}
