// Relay a card frame's completion to its own tab, even if another tab is active.
chrome.runtime.onMessage.addListener((request, sender) => {
  if (request?.action !== 'completeCheckout' || sender.tab?.id === undefined) return;
  if (!sender.url || !/(^|\.)shopifycs\.com$/.test(new URL(sender.url).hostname)) return;
  void chrome.tabs.sendMessage(sender.tab.id, { action: 'completeCheckout' }, { frameId: 0 })
    .catch(() => { /* The checkout may have navigated away. */ });
});
