<script setup lang="ts">
import VCheckbox from '../components/VCheckbox.vue';
import VIcon from '../components/VIcon.vue';
import { useStorage } from '../useStorage';
import { useLocale } from '../useLocale';

const { settings } = useStorage();
const { t } = useLocale();
</script>

<template>
  <div class="page-heading"><h1>{{ t('settingsTitle') }}</h1><VIcon class="heading-icon" name="settings" /></div>
  <p class="page-description">{{ t('settingsDescription') }}</p>
  <section class="settings-section" aria-labelledby="language-heading"><h2 id="language-heading">{{ t('language') }}<span>01</span></h2><div class="settings-card"><label class="language-row"><span class="setting-copy"><span class="setting-label">{{ t('language') }}</span><span class="setting-description">{{ t('languageDescription') }}</span></span><select v-model="settings.language" :aria-label="t('language')"><option value="ms">{{ t('malay') }}</option><option value="en">{{ t('english') }}</option></select></label></div></section>
  <section class="settings-section" aria-labelledby="general-heading"><h2 id="general-heading">{{ t('general') }}<span>02</span></h2><div class="settings-card"><VCheckbox v-model="settings.enabled" :label="t('enableAutofill')" :description="t('enableAutofillDescription')" /><VCheckbox v-model="settings.simulateTyping" :label="t('simulateTyping')" :description="t('simulateTypingDescription')" /></div></section>
  <section class="settings-section" aria-labelledby="shopify-heading"><h2 id="shopify-heading">Shopify<span>03</span></h2><div class="settings-card"><VCheckbox v-model="settings.shopify.processCheckoutSteps" :label="t('continueCheckout')" :description="t('continueCheckoutDescription')" /><VCheckbox v-model="settings.shopify.completeCheckout" :label="t('completeCheckout')" :description="t('completeCheckoutDescription')" /></div></section>
  <section class="settings-section" aria-labelledby="supreme-heading"><h2 id="supreme-heading">Supreme<span>04</span></h2><div class="settings-card"><VCheckbox v-model="settings.supreme.processPayment" :label="t('processPayment')" :description="t('processPaymentDescription')" /></div></section>
  <p class="settings-note">{{ t('settingsNote') }}</p>
</template>
