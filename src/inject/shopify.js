import { contactFields, fillFields, hasCaptcha, isShopifyCheckout, watchAutofill } from './shared';

import { readStorage } from '../storage';

const advanced = new WeakSet();
/** @type {ReturnType<typeof setTimeout> | undefined} */
let completionTimer;
watchAutofill(async (profile, settings) => {
  const fields = contactFields(profile);
  fields['#checkout_email, #checkout_email_or_phone, [name="checkout[email]"], [name="checkout[email_or_phone]"]'] = profile.email;
  for (const address of ['shipping', 'billing']) {
    for (const [field, value] of Object.entries({
      country: profile.country, province: profile.state,
      first_name: profile.firstName, last_name: profile.lastName,
      address1: profile.address, address2: profile.address2,
      city: profile.city, zip: profile.zipcode, phone: profile.phoneNumber,
    })) {
      fields[`#checkout_${address}_address_${field}, [name="checkout[${address}_address][${field}]"]`] = value;
    }
  }
  await fillFields(fields, settings.simulateTyping);
  const step = document.querySelector('[data-step]');
  if (settings.shopify.processCheckoutSteps && step && !advanced.has(step) &&
      ['contact_information', 'shipping_method'].includes(step.getAttribute('data-step') ?? '') && !hasCaptcha()) {
    const button = document.querySelector('.step__footer__continue-btn');
    if (button instanceof HTMLButtonElement && !button.disabled) {
      advanced.add(step);
      button.click();
    }
  }
}, isShopifyCheckout);

// Preserve the original opt-in completion on legacy payment steps only.
chrome.runtime.onMessage.addListener(request => {
  if (request?.action !== 'completeCheckout' || !isShopifyCheckout()) return;
  clearTimeout(completionTimer);
  completionTimer = setTimeout(async () => {
    const { settings, profiles, selectedProfile } = await readStorage();
    const step = document.querySelector('[data-step="payment_method"]');
    const button = document.querySelector('.step__footer__continue-btn');
    if (settings.enabled && settings.shopify.completeCheckout &&
        profiles.some(profile => profile.id === selectedProfile) && step && !advanced.has(step) &&
        button instanceof HTMLButtonElement && !button.disabled && !hasCaptcha()) {
      advanced.add(step);
      button.click();
    }
  }, 1000);
});
