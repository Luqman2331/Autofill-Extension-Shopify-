export interface Profile {
  id: string;
  profileName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  address2: string;
  address3: string;
  city: string;
  country: string;
  state: string;
  zipcode: string;
  cardholderName: string;
  cardType: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface Settings {
  language: 'en' | 'ms';
  enabled: boolean;
  simulateTyping: boolean;
  supreme: { processPayment: boolean };
  shopify: { processCheckoutSteps: boolean; completeCheckout: boolean };
}

export interface StoredData {
  profiles: Profile[];
  selectedProfile: string | null;
  settings: Settings;
}

export function emptyProfile(): Profile {
  return {
    id: '', profileName: 'New profile', firstName: '', lastName: '', email: '',
    phoneNumber: '', address: '', address2: '', address3: '', city: '', country: '',
    state: '', zipcode: '', cardholderName: '', cardType: 'visa', cardNumber: '',
    expiryMonth: '', expiryYear: '', cvv: '',
  };
}

export function defaultSettings(): Settings {
  return {
    language: 'ms',
    enabled: false,
    simulateTyping: false,
    supreme: { processPayment: false },
    shopify: { processCheckoutSteps: false, completeCheckout: false },
  };
}

export async function readStorage(): Promise<StoredData> {
  const stored = await chrome.storage.local.get<{
    profiles: Partial<Profile>[];
    selectedProfile: string | null;
    settings: Partial<Omit<Settings, 'supreme' | 'shopify'>> & {
      supreme?: Partial<Settings['supreme']>;
      shopify?: Partial<Settings['shopify']>;
    };
  }>({ profiles: [], selectedProfile: null, settings: {} });
  const defaults = defaultSettings();
  const settings = stored.settings ?? {};
  return {
    profiles: Array.isArray(stored.profiles)
      ? stored.profiles.map((profile: Partial<Profile>) => ({ ...emptyProfile(), ...profile })) : [],
    selectedProfile: stored.selectedProfile,
    settings: {
      ...defaults, ...settings,
      supreme: { ...defaults.supreme, ...settings.supreme },
      shopify: { ...defaults.shopify, ...settings.shopify },
    },
  };
}
