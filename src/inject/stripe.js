import { expiry, fillFields, watchAutofill } from './shared';

watchAutofill((profile, settings) => fillFields({
  '[name="cardnumber"], [name="cardNumber"], [autocomplete~="cc-number"]': profile.cardNumber,
  '[name="exp-date"], [name="expiry"], [autocomplete~="cc-exp"]': expiry(profile),
  '[name="cvc"], [name="cvv"], [autocomplete~="cc-csc"]': profile.cvv,
  '[name="postal"], [name="postalCode"], [autocomplete~="postal-code"]': profile.zipcode,
}, settings.simulateTyping));
