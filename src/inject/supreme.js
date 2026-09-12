import { fillFields, fullName, hasCaptcha, watchAutofill } from './shared';

const submitted = new WeakSet();
watchAutofill(async (profile, settings) => {
  await fillFields({
    '#order_billing_country': getCountryCode(profile.country),
    '#order_billing_state': profile.state,
    '#order_billing_name': fullName(profile),
    '#order_email': profile.email,
    '#order_tel': profile.phoneNumber,
    '#bo': profile.address,
    '#oba3': profile.address2,
    '#order_billing_address_3': profile.address3,
    '#order_billing_city': profile.city,
    '#order_billing_zip': profile.zipcode,
    '#cnb, #rnsnckrn': profile.cardNumber,
    '#vval, #orcer': profile.cvv,
    '#credit_card_type': profile.cardType,
    '#credit_card_month': profile.expiryMonth,
    '#credit_card_year': profile.expiryYear,
  }, settings.simulateTyping);

  const terms = document.querySelector('.terms .icheckbox_minimal');
  if (terms instanceof HTMLElement && !terms.classList.contains('checked')) terms.click();
  const button = document.querySelector('input.button[type="submit"], button.button, button.checkout, input.checkout[type="submit"], #pay');
  if (settings.supreme.processPayment && button instanceof HTMLElement &&
      !button.matches(':disabled') && !submitted.has(button) && !hasCaptcha()) {
    submitted.add(button);
    button.click();
  }
}, () => /\/checkout(?:\/|$)/.test(location.pathname) && !!document.querySelector('#order_billing_name, #order_email'));

/** @param {string} country */
function getCountryCode(country) {
	/** @type {Record<string, string>} */
	const countries = {
		"united kingdom": "GB",
		"northern ireland": "NB",
		"united states": "USA",
		"canada": "CANADA",
		"austria": "AT",
		"belarus": "BY",
		"belgium": "BE",
		"bulgaria": "BG",
		"croatia": "HR",
		"czech republic": "CZ",
		"denmark": "DK",
		"estonia": "EE",
		"finland": "FI",
		"france": "FR",
		"germany": "DE",
		"greece": "GR",
		"hungary": "HU",
		"iceland": "IS",
		"ireland": "IE",
		"italy": "IT",
		"latvia": "LV",
		"lithuania": "LT",
		"luxembourg": "LU",
		"monaco": "MC",
		"netherlands": "NL",
		"norway": "NO",
		"poland": "PL",
		"portugal": "PT",
		"romania": "RO",
		"russia": "RU",
		"slovakia": "SK",
		"slovenia": "SI",
		"spain": "ES",
		"sweden": "SE",
		"switzerland": "CH",
		"turkey": "TR",
	}

	return countries[country.toLowerCase()] || country;
}
