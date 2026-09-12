import { computed } from 'vue';
import { useStorage } from './useStorage';

const translations = {
  en: {
    autofillOn: 'Autofill on', paused: 'Paused', pauseAutofill: 'Pause autofill', turnOnAutofill: 'Turn on autofill',
    profiles: 'Profiles', settings: 'Settings', changesSaved: 'Changes save automatically',
    yourProfiles: 'Your profiles', new: 'New', addProfile: 'Add profile', selectedProfile: 'Selected profile', unnamedProfile: 'Unnamed profile', deleteProfile: 'Delete profile', profileDetails: 'Profile details',
    details: 'Details', address: 'Address', payment: 'Payment',
    profileName: 'Profile name', profileNameHint: 'Give this profile a name', firstName: 'First name', lastName: 'Last name', email: 'Email address', emailHint: 'you@example.com', phone: 'Phone number',
    streetAddress: 'Street address', streetAddressHint: 'House number and street', addressLine2: 'Address line 2', addressLine2Hint: 'Apartment, unit (optional)', addressLine3: 'Address line 3', addressLine3Hint: 'Other details (optional)', city: 'City', postcode: 'Postcode / ZIP', state: 'State / province', stateHint: 'State or province', country: 'Country / region', countryHint: 'e.g. Malaysia',
    paymentMethod: 'Payment method', addCard: 'Add your card below', cardholder: 'Cardholder name', cardholderHint: 'Name on card', cardType: 'Card type', cardNumber: 'Card number', expiryMonth: 'Expiry month', expiryYear: 'Expiry year', securityCode: 'Security code', cardNote: 'Use the details printed on your card.',
    lessTyping: 'A little less typing', readyTitle: 'Your details.|Ready to go.', readyDescription: 'Keep your contact, address and payment details together in one profile.', createProfile: 'Create your first profile',
    settingsTitle: 'Make it yours.', settingsDescription: 'A few preferences. A smoother checkout.', language: 'Language', languageDescription: 'Choose the language used in the popup.', english: 'English', malay: 'Bahasa Melayu', general: 'General', enableAutofill: 'Enable autofill', enableAutofillDescription: 'Fill checkout fields with your selected profile.', simulateTyping: 'Simulate typing', simulateTypingDescription: 'Enter your details one character at a time.', continueCheckout: 'Continue checkout', continueCheckoutDescription: 'Move through checkout steps automatically.', completeCheckout: 'Complete checkout', completeCheckoutDescription: 'Submit the order automatically.', processPayment: 'Process payment', processPaymentDescription: 'Submit the payment automatically.', settingsNote: 'Automatic checkout options apply to supported legacy checkout pages.',
  },
  ms: {
    autofillOn: 'Isi automatik aktif', paused: 'Dijeda', pauseAutofill: 'Jeda isi automatik', turnOnAutofill: 'Aktifkan isi automatik',
    profiles: 'Profil', settings: 'Tetapan', changesSaved: 'Perubahan disimpan secara automatik',
    yourProfiles: 'Profil anda', new: 'Baharu', addProfile: 'Tambah profil', selectedProfile: 'Profil dipilih', unnamedProfile: 'Profil tanpa nama', deleteProfile: 'Padam profil', profileDetails: 'Butiran profil',
    details: 'Butiran', address: 'Alamat', payment: 'Bayaran',
    profileName: 'Nama profil', profileNameHint: 'Namakan profil ini', firstName: 'Nama pertama', lastName: 'Nama akhir', email: 'Alamat e-mel', emailHint: 'anda@contoh.com', phone: 'Nombor telefon',
    streetAddress: 'Alamat jalan', streetAddressHint: 'Nombor rumah dan nama jalan', addressLine2: 'Alamat baris 2', addressLine2Hint: 'Apartmen, unit (pilihan)', addressLine3: 'Alamat baris 3', addressLine3Hint: 'Butiran lain (pilihan)', city: 'Bandar', postcode: 'Poskod', state: 'Negeri', stateHint: 'Negeri', country: 'Negara / rantau', countryHint: 'Contoh: Malaysia',
    paymentMethod: 'Kaedah bayaran', addCard: 'Tambah kad di bawah', cardholder: 'Nama pemegang kad', cardholderHint: 'Nama pada kad', cardType: 'Jenis kad', cardNumber: 'Nombor kad', expiryMonth: 'Bulan tamat tempoh', expiryYear: 'Tahun tamat tempoh', securityCode: 'Kod keselamatan', cardNote: 'Gunakan butiran yang tertera pada kad anda.',
    lessTyping: 'Kurang menaip, lebih cepat', readyTitle: 'Butiran anda.|Sedia digunakan.', readyDescription: 'Simpan butiran hubungan, alamat dan bayaran anda dalam satu profil.', createProfile: 'Cipta profil pertama anda',
    settingsTitle: 'Tetapkan pilihan anda.', settingsDescription: 'Beberapa pilihan untuk checkout yang lebih lancar.', language: 'Bahasa', languageDescription: 'Pilih bahasa yang digunakan dalam popup.', english: 'English', malay: 'Bahasa Melayu', general: 'Umum', enableAutofill: 'Aktifkan isi automatik', enableAutofillDescription: 'Isi ruangan checkout dengan profil yang dipilih.', simulateTyping: 'Simulasikan menaip', simulateTypingDescription: 'Masukkan butiran satu aksara pada satu masa.', continueCheckout: 'Teruskan checkout', continueCheckoutDescription: 'Terus ke langkah checkout seterusnya secara automatik.', completeCheckout: 'Lengkapkan checkout', completeCheckoutDescription: 'Hantar pesanan secara automatik.', processPayment: 'Proses bayaran', processPaymentDescription: 'Hantar bayaran secara automatik.', settingsNote: 'Pilihan checkout automatik hanya digunakan pada halaman checkout lama yang disokong.',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function useLocale() {
  const { settings } = useStorage();
  const language = computed(() => settings.language === 'en' ? 'en' : 'ms');
  return { language, t: (key: TranslationKey) => translations[language.value][key] };
}
