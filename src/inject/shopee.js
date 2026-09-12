import { contactFields, fillFields, fullName, watchAutofill } from './shared';

watchAutofill((profile, settings) => fillFields({
  ...contactFields(profile),
  'input[placeholder*="Nama" i]:not([placeholder*="Jalan" i]):not([placeholder*="Bangunan" i]), input[placeholder*="Full name" i]': fullName(profile),
  'input[placeholder*="Phone" i], input[placeholder*="Telefon" i], input[placeholder*="Nombor mudah alih" i]': profile.phoneNumber,
  'input[placeholder*="Poskod" i], input[placeholder*="Postcode" i], input[placeholder*="Postal code" i]': profile.zipcode,
  'input[placeholder*="Bandar" i], input[placeholder*="City" i]': profile.city,
  'input[placeholder*="Alamat" i]:not([type="email"]):not([placeholder*="e-mel" i]), textarea[placeholder*="Alamat" i], input[placeholder*="Address" i]:not([type="email"]), textarea[placeholder*="Address" i], input[placeholder*="Jalan" i], input[placeholder*="Street" i]':
    [profile.address, profile.address2, profile.address3].filter(Boolean).join(', '),
}, settings.simulateTyping), () => /^\/checkout(?:\/|$)/.test(location.pathname));
