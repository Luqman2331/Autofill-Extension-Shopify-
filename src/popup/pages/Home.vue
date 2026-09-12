<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { emptyProfile, type Profile } from '../../storage';
import { useStorage } from '../useStorage';
import { type TranslationKey, useLocale } from '../useLocale';
import VIcon from '../components/VIcon.vue';

const state = useStorage();
const { t } = useLocale();
const profile = computed(() => state.profiles.find(profile => profile.id === state.selectedProfile));
const initials = computed(() => [profile.value?.firstName, profile.value?.lastName].map(name => name?.trim()[0] ?? '').join('').toUpperCase() || 'SS');
const tabs = [
  { id: 'details', label: 'details', icon: 'user' }, { id: 'address', label: 'address', icon: 'pin' }, { id: 'payment', label: 'payment', icon: 'card' },
] as const;
const section = ref<(typeof tabs)[number]['id']>('details');
type Field = [keyof Profile, TranslationKey, TranslationKey, boolean];
const contactFields: Field[] = [
  ['profileName', 'profileName', 'profileNameHint', true], ['firstName', 'firstName', 'firstName', false], ['lastName', 'lastName', 'lastName', false], ['email', 'email', 'emailHint', true], ['phoneNumber', 'phone', 'phone', true],
];
const addressFields: Field[] = [
  ['address', 'streetAddress', 'streetAddressHint', true], ['address2', 'addressLine2', 'addressLine2Hint', false], ['address3', 'addressLine3', 'addressLine3Hint', false], ['city', 'city', 'city', false], ['zipcode', 'postcode', 'postcode', false], ['state', 'state', 'stateHint', false], ['country', 'country', 'countryHint', false],
];
const cardNames: Record<string, string> = { visa: 'Visa', american_express: 'American Express', master: 'Mastercard', solo: 'Solo', paypal: 'PayPal' };
const years = Array.from({ length: 15 }, (_, i) => String(new Date().getFullYear() + i));
const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

async function addProfile() {
  const profile = { ...emptyProfile(), id: crypto.randomUUID() };
  state.profiles.push(profile); state.selectedProfile = profile.id; section.value = 'details';
  await nextTick(); document.getElementById('profileName')?.focus();
}
function deleteProfile() { state.profiles = state.profiles.filter(profile => profile.id !== state.selectedProfile); state.selectedProfile = state.profiles[0]?.id ?? null; }
function switchTab(event: KeyboardEvent, index: number) {
  const next = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 }[event.key];
  if (next === undefined) return;
  event.preventDefault(); section.value = tabs[next]!.id; document.getElementById(`tab-${section.value}`)?.focus();
}
</script>

<template>
  <div class="page-heading">
    <h1>{{ t('yourProfiles') }}<span class="count-badge">{{ state.profiles.length.toString().padStart(2, '0') }}</span></h1>
    <button v-if="profile" type="button" class="new-profile" @click="addProfile" :aria-label="t('addProfile')"><VIcon name="plus" />{{ t('new') }}</button>
  </div>
  <template v-if="profile">
    <div class="profile-card">
      <span class="profile-avatar" aria-hidden="true">{{ initials }}</span>
      <div class="profile-choice"><label for="selected-profile">{{ t('selectedProfile') }}</label><div class="profile-select">
        <select id="selected-profile" v-model="state.selectedProfile" :aria-label="t('selectedProfile')"><option v-for="item in state.profiles" :key="item.id" :value="item.id">{{ item.profileName || t('unnamedProfile') }}</option></select><VIcon name="chevron" />
      </div></div>
      <button type="button" class="delete-profile" @click="deleteProfile" :aria-label="t('deleteProfile')" :title="t('deleteProfile')"><VIcon name="trash" /></button>
    </div>
    <div class="section-tabs" role="tablist" :aria-label="t('profileDetails')">
      <button v-for="(tab, index) in tabs" :id="`tab-${tab.id}`" :key="tab.id" type="button" role="tab" :aria-selected="section === tab.id" :aria-controls="`panel-${tab.id}`" :tabindex="section === tab.id ? 0 : -1" @click="section = tab.id" @keydown="switchTab($event, index)"><VIcon :name="tab.icon" />{{ t(tab.label) }}</button>
    </div>
    <form @submit.prevent autocomplete="off">
      <div id="panel-details" v-show="section === 'details'" role="tabpanel" aria-labelledby="tab-details" class="fields"><label v-for="[key, label, placeholder, wide] in contactFields" :key="key" class="field" :class="{ wide }">{{ t(label) }}<input :id="key" v-model="profile[key]" type="text" :placeholder="t(placeholder)" :inputmode="key === 'phoneNumber' ? 'tel' : key === 'email' ? 'email' : 'text'" :spellcheck="false"></label></div>
      <div id="panel-address" v-show="section === 'address'" role="tabpanel" aria-labelledby="tab-address" class="fields"><label v-for="[key, label, placeholder, wide] in addressFields" :key="key" class="field" :class="{ wide }">{{ t(label) }}<input :id="key" v-model="profile[key]" type="text" :placeholder="t(placeholder)"></label></div>
      <div id="panel-payment" v-show="section === 'payment'" role="tabpanel" aria-labelledby="tab-payment">
        <div class="payment-summary"><span v-if="profile.cardType === 'master'" class="mastercard-mark" aria-hidden="true" /><VIcon v-else name="card" /><span>{{ cardNames[profile.cardType] || t('paymentMethod') }}</span><span class="card-ending">{{ profile.cardNumber ? '•••• ' + profile.cardNumber.replace(/\D/g, '').slice(-4) : t('addCard') }}</span></div>
        <div class="fields">
          <label class="field">{{ t('cardholder') }}<input id="cardholderName" v-model="profile.cardholderName" type="text" :placeholder="t('cardholderHint')"></label>
          <label class="field">{{ t('cardType') }}<select id="cardType" v-model="profile.cardType"><option v-for="(name, value) in cardNames" :key="value" :value="value">{{ name }}</option></select></label>
          <label class="field wide">{{ t('cardNumber') }}<input id="cardNumber" v-model="profile.cardNumber" type="text" inputmode="numeric" placeholder="0000 0000 0000 0000"></label>
        </div>
        <div class="fields card-expiry">
          <label class="field">{{ t('expiryMonth') }}<select id="expiryMonth" v-model="profile.expiryMonth"><option value="" disabled>MM</option><option v-for="month in months" :key="month" :value="month">{{ month }}</option></select></label>
          <label class="field">{{ t('expiryYear') }}<select id="expiryYear" v-model="profile.expiryYear"><option value="" disabled>YYYY</option><option v-if="profile.expiryYear && !years.includes(profile.expiryYear)" :value="profile.expiryYear">{{ profile.expiryYear }}</option><option v-for="year in years" :key="year" :value="year">{{ year }}</option></select></label>
          <label class="field">{{ t('securityCode') }}<input id="cvv" v-model="profile.cvv" type="password" inputmode="numeric" placeholder="CVV" autocomplete="off"></label>
        </div>
        <p class="field-note">{{ t('cardNote') }}</p>
      </div>
    </form>
  </template>
  <div v-else class="empty-state">
    <div class="empty-art" aria-hidden="true"><div class="art-card art-back" /><div class="art-card art-front"><VIcon name="user" /><span /><span /></div><span class="art-spark"><VIcon name="bolt" /></span></div>
    <span class="eyebrow">{{ t('lessTyping') }}</span><h2>{{ t('readyTitle').split('|')[0] }}<br>{{ t('readyTitle').split('|')[1] }}</h2><p>{{ t('readyDescription') }}</p>
    <button type="button" class="primary-button" @click="addProfile" :aria-label="t('addProfile')">{{ t('createProfile') }}<VIcon name="arrow" /></button><div class="platforms"><span>Shopify</span><span>Supreme</span><span>Stripe</span><span>Shopee MY</span></div>
  </div>
</template>
