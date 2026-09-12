import { expiry, fillFields, isShopifyPaymentHost, watchAutofill } from './shared';

let notified = false;
watchAutofill(async (profile, settings) => {
  const fields = {
    '#number, [name="number"], [name="cardNumber"], [data-current-field="number"], [autocomplete~="cc-number" i], input[placeholder="Card number" i]': profile.cardNumber,
    '#name, [name="name"], [data-current-field="name"], [autocomplete~="cc-name" i], input[placeholder="Name on card" i]': profile.cardholderName,
    '#expiry, [name="expiry"], [data-current-field="expiry"], [autocomplete~="cc-exp" i], input[placeholder^="Expiration date" i]': expiry(profile),
    '#verification_value, [name="verification_value"], [data-current-field="verification_value"], [autocomplete~="cc-csc" i], input[placeholder="Security code" i]': profile.cvv,
  };
  const filled = await fillFields(fields, settings.simulateTyping);
  // Retain the legacy completion signal without extending automatic submission to new hosts.
  if (!notified && filled > 0 && /(^|\.)shopifycs\.com$/.test(location.hostname) &&
      profile.cardNumber && profile.cardholderName && expiry(profile) && profile.cvv) {
    notified = true;
    void chrome.runtime.sendMessage({ action: 'completeCheckout' }).catch(() => {});
  }
}, isShopifyPaymentHost);
