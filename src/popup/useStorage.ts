import { reactive, watch } from 'vue';
import { defaultSettings, readStorage, type StoredData } from '../storage';

const state = reactive<StoredData>({
  profiles: [], selectedProfile: null, settings: defaultSettings(),
});

export async function loadStorage() {
  Object.assign(state, await readStorage());
  if (!state.profiles.some(profile => profile.id === state.selectedProfile)) {
    const selectedProfile = state.profiles[0]?.id ?? null;
    if (state.selectedProfile !== selectedProfile) {
      state.selectedProfile = selectedProfile;
      await chrome.storage.local.set({ selectedProfile });
    }
  }
  // Start watching after hydration; opening the popup must not overwrite saved data.
  watch([() => state.profiles, () => state.selectedProfile], () => {
    void chrome.storage.local.set(JSON.parse(JSON.stringify({
      profiles: state.profiles, selectedProfile: state.selectedProfile,
    }))).catch(console.error);
  }, { deep: true });
  watch(() => state.settings, settings => {
    void chrome.storage.local.set({ settings: JSON.parse(JSON.stringify(settings)) }).catch(console.error);
  }, { deep: true });
}

export const useStorage = () => state;
