import { contactFields, fillFields, isShopifyCheckout, isShopifyPaymentHost, watchAutofill } from './shared';

// Dedicated adapters own these forms, avoiding duplicate writes and card-name collisions.
watchAutofill(profile => fillFields(contactFields(profile)), () =>
  !isShopifyCheckout() &&
  !isShopifyPaymentHost() &&
  !/(^|\.)(stripe\.com|shopee\.com\.my)$/.test(location.hostname) &&
  !(/(^|\.)(supremenewyork\.com|supreme\.com)$/.test(location.hostname) && /\/checkout/.test(location.pathname)),
);
